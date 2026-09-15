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
    const newBid = await BidModel.create({
      ...body,
      _id,
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
