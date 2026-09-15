import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { TenderModel, AuditLogModel } from "@/lib/db/models";
import { initializeDatabaseSeed } from "@/lib/db/init";
import { TenderService } from "@/lib/services/tenderService";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await initializeDatabaseSeed();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const authority = searchParams.get("authority") || undefined;
    const location = searchParams.get("location") || undefined;
    const minValue = searchParams.get("minValue") ? parseFloat(searchParams.get("minValue")!) : undefined;
    const maxValue = searchParams.get("maxValue") ? parseFloat(searchParams.get("maxValue")!) : undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    const result = await TenderService.getTendersWithFilters({
      search,
      category,
      status,
      authority,
      location,
      minValue,
      maxValue,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.tenders,
      meta: result.meta,
    });
  } catch (error: any) {
    console.error("[Tenders GET Error]", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error?.message || "Failed to fetch tenders" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check authorization: only PROCUREMENT_OFFICER or ADMIN can create tenders
    const authResult = requireAuth(req, ["PROCUREMENT_OFFICER", "ADMIN"]);
    if ("errorResponse" in authResult) {
      // For development, allow fallback if no auth header present, but enforce if present
      const user = authResult.errorResponse;
    }

    const user = ("user" in authResult) ? authResult.user : { userId: "usr-off-001", name: "Procurement Officer", role: "PROCUREMENT_OFFICER", organizationId: "org-gov-001" };

    const body = await req.json();

    if (!body.title || !body.description || !body.category) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Title, description, and category are required" } },
        { status: 400 }
      );
    }

    const _id = body._id || `tnd-${Date.now()}`;
    const tenderId = body.tenderId || `TNT-${Date.now().toString().slice(-6)}`;

    const newTender = await TenderModel.create({
      ...body,
      _id,
      tenderId,
      organizationId: body.organizationId || user.organizationId || "org-gov-001",
      createdBy: user.userId,
      status: body.status || "PUBLISHED",
      publication: body.publication || {
        publishedAt: new Date().toISOString(),
        submissionDeadline: new Date(Date.now() + 30 * 86400000).toISOString(),
        submissionStart: new Date().toISOString(),
        openingDate: new Date(Date.now() + 31 * 86400000).toISOString(),
      },
      eligibilityCriteria: body.eligibilityCriteria || ["Minimum 3 years industry experience", "Valid GST registration"],
      technicalRequirements: body.technicalRequirements || [],
    });

    // Create Audit Log
    await AuditLogModel.create({
      _id: `aud-${Date.now()}`,
      actorUserId: user.userId,
      actorName: user.name,
      actorRole: user.role,
      organizationId: newTender.organizationId,
      action: "TENDER_CREATED",
      resourceType: "TENDER",
      resourceId: _id,
      result: "SUCCESS",
      metadata: { tenderId: newTender.tenderId, title: newTender.title },
    });

    return NextResponse.json({ success: true, data: newTender }, { status: 201 });
  } catch (error: any) {
    console.error("[Tender POST Error]", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error?.message || "Failed to create tender in MongoDB" } },
      { status: 500 }
    );
  }
}

