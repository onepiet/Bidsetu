import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { BidModel, AuditLogModel } from "@/lib/db/models";
import { initializeDatabaseSeed } from "@/lib/db/init";

export async function GET() {
  try {
    await connectToDatabase();
    await initializeDatabaseSeed();

    const bids = await BidModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(bids);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch bids" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const _id = body._id || `bid-${Date.now()}`;

    // Calculate dynamic compliance score (78% - 97%) if not specified
    let calculatedScore = 84;
    const documentCount = Array.isArray(body.documentIds)
      ? body.documentIds.length
      : Array.isArray(body.documents)
      ? body.documents.length
      : 1;
    const techLength = (body.technicalProposal || "").length;

    if (documentCount >= 4) calculatedScore += 7;
    else if (documentCount >= 2) calculatedScore += 4;

    if (techLength > 150) calculatedScore += 4;
    else if (techLength > 50) calculatedScore += 2;

    // Vendor hash seed variance (-3 to +3)
    let hashSeed = 0;
    const seedStr = (body.vendorName || "") + _id;
    for (let i = 0; i < seedStr.length; i++) {
      hashSeed = (hashSeed + seedStr.charCodeAt(i) * (i + 1)) % 7;
    }
    calculatedScore = Math.min(98, Math.max(72, calculatedScore + (hashSeed - 3)));

    const complianceScore = body.complianceScore !== undefined ? body.complianceScore : calculatedScore;

    const newBid = await BidModel.create({
      ...body,
      _id,
      complianceScore,
      submittedAt: body.submittedAt || new Date().toISOString(),
    });

    // Create Audit Log
    await AuditLogModel.create({
      _id: `aud-${Date.now()}`,
      actorUserId: body.submittedBy || "usr-ven-001",
      actorName: body.vendorName || "Vendor Representative",
      actorRole: "VENDOR",
      action: "BID_SUBMISSION",
      resourceType: "BID",
      resourceId: _id,
      result: "SUCCESS",
      metadata: { tenderId: body.tenderId },
    });

    return NextResponse.json(newBid, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to submit bid to MongoDB" }, { status: 500 });
  }
}
