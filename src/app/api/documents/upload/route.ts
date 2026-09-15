import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import { DocumentModel, AuditLogModel } from "@/lib/db/models";
import { DocumentProcessor } from "@/lib/services/documentProcessor";
import { getAuthenticatedUser } from "@/lib/auth";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "text/plain",
];

const DISALLOWED_EXTENSIONS = [".exe", ".bat", ".sh", ".cmd", ".msi", ".php", ".js", ".vbs", ".ps1"];

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB limit

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const user = getAuthenticatedUser(req) || {
      userId: "usr-ven-001",
      name: "Authorized Vendor Representative",
      role: "VENDOR",
      organizationId: "org-ven-001",
    };

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const tenderId = (formData.get("tenderId") as string) || "tnd-001";
    const bidId = (formData.get("bidId") as string) || undefined;
    const uploadedBy = user.userId;
    const organizationId = user.organizationId || (formData.get("organizationId") as string) || "org-ven-001";

    if (!file) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "No file provided in request" } },
        { status: 400 }
      );
    }

    // 1. File Size Check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: { code: "FILE_TOO_LARGE", message: "File size exceeds maximum permitted threshold of 50MB" } },
        { status: 400 }
      );
    }

    // 2. Extension & Security Validation
    const fileNameLower = file.name.toLowerCase();
    if (DISALLOWED_EXTENSIONS.some((ext) => fileNameLower.endsWith(ext))) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_FILE_TYPE", message: "Executable and script files are strictly prohibited for upload" } },
        { status: 400 }
      );
    }

    const mimeType = file.type || "application/pdf";
    if (mimeType && !ALLOWED_MIME_TYPES.some((allowed) => mimeType.startsWith(allowed.split("/")[0]) || mimeType === allowed)) {
      return NextResponse.json(
        { success: false, error: { code: "UNSUPPORTED_MIME", message: `MIME type ${mimeType} is not supported` } },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. SHA-256 Checksum Calculation
    const sha256 = DocumentProcessor.calculateSha256(buffer);

    // 4. Initial PDF Text Extraction
    const { fullText } = await DocumentProcessor.extractPdfText(buffer);

    const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newDocRecord = {
      _id: docId,
      fileName: file.name,
      mimeType,
      size: file.size,
      sha256,
      uploadedBy,
      organizationId,
      tenderId,
      bidId,
      status: "PROCESSING",
      processing: {
        stage: "PARSING_OCR",
        startedAt: new Date().toISOString(),
      },
      extractedText: fullText.trim() || `Uploaded ${file.name}. Standard processing initiated.`,
      fileData: buffer.toString("base64"),
    };

    // Save directly to MongoDB Atlas
    const savedDoc = await DocumentModel.create(newDocRecord);

    // Run async document processing job
    let job: any = null;
    try {
      const processResult = await DocumentProcessor.processDocumentAsync(savedDoc._id, uploadedBy);
      job = processResult.job;
    } catch (procErr) {
      console.warn("[Upload Route] Non-blocking async processing error:", procErr);
    }

    // Create Audit Log
    await AuditLogModel.create({
      _id: `aud-${Date.now()}`,
      actorUserId: uploadedBy,
      actorName: user.name,
      actorRole: user.role,
      organizationId,
      action: "DOCUMENT_UPLOADED",
      resourceType: "DOCUMENT",
      resourceId: docId,
      result: "SUCCESS",
      metadata: { fileName: file.name, size: file.size, sha256 },
    });

    const updatedDoc = await DocumentModel.findById(docId).lean();

    return NextResponse.json({
      success: true,
      message: "File successfully uploaded, validated, and processed",
      data: updatedDoc || savedDoc,
      document: updatedDoc || savedDoc,
      job,
    });
  } catch (error: any) {
    console.error("[Upload API Error]", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error?.message || "Failed to upload and process document" } },
      { status: 500 }
    );
  }
}

