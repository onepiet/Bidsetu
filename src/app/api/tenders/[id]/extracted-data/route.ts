import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { TenderModel, OCRResultModel, AuditLogModel } from "@/lib/db/models";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = requireAuth(req);
    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }
    const { user } = authResult;

    await connectToDatabase();
    const tenderId = params.id;

    const tender = await TenderModel.findOne({
      $or: [{ _id: tenderId }, { tenderId: tenderId }],
    }).lean();

    if (!tender) {
      return NextResponse.json(
        { success: false, error: { code: "TENDER_NOT_FOUND", message: `Tender '${tenderId}' not found.` } },
        { status: 404 }
      );
    }

    // Fetch all OCR results for this tender
    const ocrResults = await OCRResultModel.find({
      $or: [{ tenderId: tender._id }, { tenderId: tender.tenderId }],
    }).lean();

    // Flatten all structured fields across documents
    const allStructuredFields = ocrResults.flatMap((res: any) => res.structuredFields || []);

    await AuditLogModel.create({
      _id: `aud-${Date.now()}`,
      actorUserId: user.userId,
      actorName: user.name || user.email,
      actorRole: user.role,
      organizationId: user.organizationId,
      action: "TENDER_EXTRACTED_DATA_VIEWED",
      resourceType: "TENDER",
      resourceId: tender._id,
      result: "SUCCESS",
      metadata: { tenderTitle: tender.title, totalDocuments: ocrResults.length },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          tenderId: tender._id,
          title: tender.title,
          totalDocuments: ocrResults.length,
          fields: allStructuredFields,
          documents: ocrResults.map((r: any) => ({
            documentId: r.documentId,
            documentName: r.documentName,
            status: r.status,
            overallConfidence: r.overallConfidence,
            structuredFieldsCount: (r.structuredFields || []).length,
            totalPages: r.totalPages,
            processedAt: r.processedAt,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[GET Tender Extracted Data Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: error?.message || "Failed to retrieve tender extracted data" },
      },
      { status: 500 }
    );
  }
}
