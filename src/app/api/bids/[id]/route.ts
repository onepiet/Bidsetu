import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { BidModel, ComplianceAnalysisModel, RiskAssessmentModel, AuditLogModel, TenderModel } from "@/lib/db/models";
import { ComplianceEngine } from "@/lib/services/complianceEngine";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const bid = await BidModel.findOne({ $or: [{ _id: params.id }, { id: params.id }] }).lean();
    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }
    return NextResponse.json(bid);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch bid" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const bidId = params.id;
    const bid = await BidModel.findOne({ $or: [{ _id: bidId }, { id: bidId }] }).lean();
    if (!bid) {
      return NextResponse.json({ error: "Bid not found for compliance evaluation" }, { status: 404 });
    }

    const tender = await TenderModel.findOne({ $or: [{ _id: bid.tenderId }, { tenderId: bid.tenderId }] }).lean();
    if (!tender) {
      return NextResponse.json({ error: "Associated tender not found" }, { status: 404 });
    }

    // Run Compliance Evaluation
    const analysisResult = await ComplianceEngine.evaluate(tender as any, bid as any);

    // Save or update MongoDB ComplianceAnalysisModel via upsert
    const targetId = analysisResult._id || `cmp-${Date.now()}`;
    const newAnalysis = await ComplianceAnalysisModel.findOneAndUpdate(
      { $or: [{ bidId: bidId }, { _id: targetId }] },
      {
        $set: {
          ...analysisResult,
          _id: targetId,
          bidId: bidId,
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    // Update Bid Status & Compliance Score
    await BidModel.updateOne(
      { _id: bidId },
      {
        $set: {
          complianceAnalysisId: newAnalysis._id,
          complianceScore: newAnalysis.score,
          riskLevel: newAnalysis.riskLevel,
          status: "UNDER_REVIEW",
        },
      }
    );

    return NextResponse.json(newAnalysis, { status: 200 });
  } catch (error: any) {
    console.error("[Bid Evaluate Error]", error);
    return NextResponse.json({ error: error?.message || "Failed to evaluate bid compliance" }, { status: 500 });
  }
}
