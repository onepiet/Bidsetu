import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { ComplianceAnalysisModel, BidModel, AuditLogModel } from "@/lib/db/models";
import { initializeDatabaseSeed } from "@/lib/db/init";

export async function GET() {
  try {
    await connectToDatabase();
    await initializeDatabaseSeed();

    const analyses = await ComplianceAnalysisModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(analyses);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch compliance analyses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const _id = body._id || `cmp-${Date.now()}`;
    const newAnalysis = await ComplianceAnalysisModel.create({
      ...body,
      _id,
    });

    // Also update referenced bid if bidId present
    if (body.bidId) {
      await BidModel.updateOne(
        { _id: body.bidId },
        {
          $set: {
            complianceAnalysisId: _id,
            complianceScore: body.score,
            riskLevel: body.riskLevel,
          },
        }
      );
    }

    // Create Audit Log
    await AuditLogModel.create({
      _id: `aud-${Date.now()}`,
      actorUserId: "usr-off-001",
      actorName: "Procurement Officer",
      actorRole: "PROCUREMENT_OFFICER",
      action: "COMPLIANCE_ANALYSIS_EXECUTED",
      resourceType: "COMPLIANCE",
      resourceId: _id,
      result: "SUCCESS",
      metadata: { score: body.score, riskLevel: body.riskLevel },
    });

    return NextResponse.json(newAnalysis, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to save compliance analysis" }, { status: 500 });
  }
}
