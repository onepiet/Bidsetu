import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { TenderModel } from "@/lib/db/models";
import { TenderService } from "@/lib/services/tenderService";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const id = params.id;

    const tender = await TenderModel.findOne({ $or: [{ _id: id }, { tenderId: id }] }).lean();
    if (!tender) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Tender not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: tender });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error?.message || "Failed to fetch tender detail" } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const id = params.id;
    const body = await req.json();
    const user = getAuthenticatedUser(req) || { userId: "usr-off-001", name: "Procurement Officer", role: "PROCUREMENT_OFFICER" };

    if (body.status) {
      const result = await TenderService.updateTenderStatus(
        id,
        body.status,
        user.userId,
        user.name,
        user.role
      );

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: { code: "INVALID_TRANSITION", message: result.error } },
          { status: 400 }
        );
      }

      delete body.status;
    }

    if (Object.keys(body).length > 0) {
      const updated = await TenderModel.findOneAndUpdate(
        { $or: [{ _id: id }, { tenderId: id }] },
        { $set: body },
        { returnDocument: "after" }
      ).lean();

      return NextResponse.json({ success: true, data: updated });
    }

    const currentTender = await TenderModel.findOne({ $or: [{ _id: id }, { tenderId: id }] }).lean();
    return NextResponse.json({ success: true, data: currentTender });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error?.message || "Failed to update tender" } },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return PATCH(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const id = params.id;

    const deleted = await TenderModel.findOneAndDelete({ $or: [{ _id: id }, { tenderId: id }] });
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Tender not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Tender deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error?.message || "Failed to delete tender" } },
      { status: 500 }
    );
  }
}

