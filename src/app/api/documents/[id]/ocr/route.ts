import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { DocumentModel, OCRResultModel, AuditLogModel, TenderModel } from "@/lib/db/models";
import { requireAuth } from "@/lib/auth";
import { DocumentProcessor } from "@/lib/services/documentProcessor";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = requireAuth(req);
    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }
    const { user } = authResult;

    await connectToDatabase();
    const documentId = params.id;

    const doc = await DocumentModel.findById(documentId).lean();
    if (!doc) {
      return NextResponse.json(
        { success: false, error: { code: "DOCUMENT_NOT_FOUND", message: `Document '${documentId}' not found.` } },
        { status: 404 }
      );
    }

    // RBAC check: Vendor can only access own organization's document
    if (user.role === "VENDOR") {
      if (user.organizationId && doc.organizationId !== user.organizationId && doc.uploadedBy !== user.userId) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "You are not authorized to view OCR results for this document.",
            },
          },
          { status: 403 }
        );
      }
    }

    // Attempt to find persisted OCR result
    let ocrResult = await OCRResultModel.findOne({ documentId }).lean();

    // If no OCRResult exists yet but document is uploaded, run processor to extract
    if (!ocrResult && doc) {
      try {
        const processed = await DocumentProcessor.processDocumentAsync(documentId, user.userId);
        ocrResult = await OCRResultModel.findOne({ documentId }).lean();
      } catch (procErr: any) {
        console.error("[OCR Route Processor Error]", procErr);
      }
    }

    if (!ocrResult) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "OCR_RESULT_NOT_FOUND",
            message: "OCR processing has not completed for this document yet.",
          },
        },
        { status: 404 }
      );
    }

    // Log Audit Event
    await AuditLogModel.create({
      _id: `aud-${Date.now()}`,
      actorUserId: user.userId,
      actorName: user.name || user.email,
      actorRole: user.role,
      organizationId: user.organizationId,
      action: "OCR_RESULT_VIEWED",
      resourceType: "DOCUMENT",
      resourceId: documentId,
      result: "SUCCESS",
      metadata: { documentName: doc.fileName },
    });

    return NextResponse.json({ success: true, data: ocrResult }, { status: 200 });
  } catch (error: any) {
    console.error("[GET OCR Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: error?.message || "Failed to retrieve OCR data" },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = requireAuth(req);
    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }
    const { user } = authResult;

    await connectToDatabase();
    const documentId = params.id;

    const doc = await DocumentModel.findById(documentId);
    if (!doc) {
      return NextResponse.json(
        { success: false, error: { code: "DOCUMENT_NOT_FOUND", message: `Document '${documentId}' not found.` } },
        { status: 404 }
      );
    }

    if (user.role === "VENDOR") {
      if (user.organizationId && doc.organizationId !== user.organizationId && doc.uploadedBy !== user.userId) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "You are not authorized to re-process this document.",
            },
          },
          { status: 403 }
        );
      }
    }

    // Trigger DocumentProcessor
    const { doc: updatedDoc } = await DocumentProcessor.processDocumentAsync(documentId, user.userId);
    const ocrResult = await OCRResultModel.findOne({ documentId }).lean();

    await AuditLogModel.create({
      _id: `aud-${Date.now()}`,
      actorUserId: user.userId,
      actorName: user.name || user.email,
      actorRole: user.role,
      organizationId: user.organizationId,
      action: "OCR_REPROCESS_REQUESTED",
      resourceType: "DOCUMENT",
      resourceId: documentId,
      result: "SUCCESS",
      metadata: { documentName: doc.fileName },
    });

    return NextResponse.json({
      success: true,
      data: ocrResult,
      message: "OCR processing re-executed successfully.",
    });
  } catch (error: any) {
    console.error("[POST OCR Reprocess Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "REPROCESS_FAILED", message: error?.message || "Failed to reprocess OCR document" },
      },
      { status: 500 }
    );
  }
}
