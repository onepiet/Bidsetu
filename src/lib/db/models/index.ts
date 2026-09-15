import mongoose, { Schema, Document as MongooseDocument } from "mongoose";
import {
  UserRole,
  ProcessingStage,
  ComplianceStatus,
} from "@/types";

// 1. User Schema
const UserSchema = new Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["PROCUREMENT_OFFICER", "VENDOR", "ADMIN"] },
    organizationId: { type: String },
    profile: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
    },
    status: { type: String, enum: ["ACTIVE", "INACTIVE", "PENDING"], default: "ACTIVE" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// 2. Organization Schema
const OrganizationSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["GOVERNMENT", "PUBLIC_SECTOR", "PRIVATE_ENTERPRISE", "MSME"],
    },
    registrationNumber: { type: String, required: true },
    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
    },
    status: { type: String, enum: ["VERIFIED", "PENDING", "REJECTED"], default: "VERIFIED" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// 3. Requirement Schema (Embedded)
const RequirementSchema = new Schema({
  _id: { type: String, required: true },
  tenderId: { type: String, required: true },
  category: {
    type: String,
    enum: ["ELIGIBILITY", "TECHNICAL", "FINANCIAL", "CERTIFICATION", "COMPLIANCE"],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  mandatory: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

// 4. Tender Schema
const TenderSchema = new Schema(
  {
    _id: { type: String, required: true },
    tenderId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    organizationId: { type: String, required: true },
    authority: { type: String },
    department: { type: String },
    location: { type: String },
    estimatedValue: { type: Number },
    emdAmount: { type: Number },
    tenderFee: { type: Number },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "DRAFT",
        "PUBLISHED",
        "PROCESSING",
        "ACTIVE",
        "CLOSING_SOON",
        "CLOSED",
        "CANCELLED",
        "AWARDED",
        "ARCHIVED",
        "UNDER_EVALUATION",
      ],
      default: "PUBLISHED",
    },
    publication: {
      publishedAt: { type: String, required: true },
      submissionDeadline: { type: String, required: true },
      submissionStart: { type: String },
      openingDate: { type: String },
    },
    eligibilityCriteria: [{ type: String }],
    technicalRequirements: [RequirementSchema],
    documentIds: [{ type: String }],
    createdBy: { type: String, required: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

TenderSchema.index({ status: 1, category: 1, createdBy: 1 });
TenderSchema.index({ title: "text", description: "text", authority: "text", department: "text" });

// 5. DocumentRecord Schema
const DocumentRecordSchema = new Schema(
  {
    _id: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    sha256: { type: String },
    uploadedBy: { type: String, required: true },
    organizationId: { type: String, required: true },
    tenderId: { type: String, required: true },
    bidId: { type: String },
    status: {
      type: String,
      enum: ["UPLOADED", "PROCESSING", "PROCESSED", "FAILED"],
      default: "UPLOADED",
    },
    processing: {
      stage: {
        type: String,
        enum: [
          "UPLOADED",
          "VALIDATING",
          "PARSING_OCR",
          "CLEANING",
          "STRUCTURED_DATA",
          "AI_ANALYSIS",
          "COMPLETED",
          "FAILED",
        ],
        default: "UPLOADED",
      },
      startedAt: { type: String },
      completedAt: { type: String },
      errorCode: { type: String },
    },
    extractedText: { type: String },
    fileData: { type: String }, // Base64 encoded file data if stored inline
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

DocumentRecordSchema.index({ tenderId: 1, organizationId: 1, status: 1 });

// 6. Bid Schema
const BidSchema = new Schema(
  {
    _id: { type: String, required: true },
    tenderId: { type: String, required: true, index: true },
    vendorOrganizationId: { type: String, required: true, index: true },
    vendorName: { type: String, required: true },
    submittedBy: { type: String, required: true },
    status: {
      type: String,
      enum: ["SUBMITTED", "UNDER_REVIEW", "ACCEPTED", "REJECTED"],
      default: "SUBMITTED",
    },
    submittedAt: { type: String, required: true },
    documentIds: [{ type: String }],
    complianceAnalysisId: { type: String },
    riskLevel: { type: String, enum: ["LOW", "MEDIUM", "HIGH"] },
    complianceScore: { type: Number },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// 7. ComplianceAnalysis Schema
const ComplianceAnalysisSchema = new Schema(
  {
    _id: { type: String, required: true },
    tenderId: { type: String, required: true, index: true },
    tenderTitle: { type: String, required: true },
    bidId: { type: String, required: true, index: true },
    vendorName: { type: String, required: true },
    score: { type: Number, required: true },
    compliantCount: { type: Number, required: true },
    reviewRequiredCount: { type: Number, required: true },
    nonCompliantCount: { type: Number, required: true },
    riskLevel: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], required: true },
    results: [Schema.Types.Mixed],
    status: {
      type: String,
      enum: ["COMPLETED", "REQUIRES_REVIEW", "PROCESSING"],
      default: "COMPLETED",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// 8. RiskAssessment Schema
const RiskAssessmentSchema = new Schema(
  {
    _id: { type: String, required: true },
    bidId: { type: String, required: true, index: true },
    vendorName: { type: String, required: true },
    tenderTitle: { type: String, required: true },
    complianceAnalysisId: { type: String, required: true },
    level: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], required: true },
    score: { type: Number, required: true },
    signals: [Schema.Types.Mixed],
    explanation: { type: String, required: true },
    engineVersion: { type: String, default: "v2.4.0-ml" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// 9. Report Schema
const ReportSchema = new Schema(
  {
    _id: { type: String, required: true },
    type: {
      type: String,
      enum: ["COMPLIANCE_EVALUATION", "RISK_ASSESSMENT", "BID_SUMMARY"],
      required: true,
    },
    title: { type: String, required: true },
    tenderId: { type: String, required: true, index: true },
    bidId: { type: String },
    createdBy: { type: String, required: true },
    status: { type: String, enum: ["FINAL", "DRAFT"], default: "FINAL" },
    generatedAt: { type: String, required: true },
    content: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// 10. AuditLog Schema
const AuditLogSchema = new Schema(
  {
    _id: { type: String, required: true },
    actorUserId: { type: String, required: true, index: true },
    actorName: { type: String, required: true },
    actorRole: { type: String, required: true },
    organizationId: { type: String },
    action: { type: String, required: true },
    resourceType: {
      type: String,
      enum: ["TENDER", "BID", "DOCUMENT", "COMPLIANCE", "SECURITY", "USER"],
      required: true,
    },
    resourceId: { type: String, required: true },
    result: { type: String, enum: ["SUCCESS", "FAILURE"], default: "SUCCESS" },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// 11. ProcessingJob Schema
const ProcessingJobSchema = new Schema(
  {
    _id: { type: String, required: true },
    jobId: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true, enum: ["OCR", "EXTRACTION", "VERIFICATION", "SCORING"] },
    status: { type: String, required: true, enum: ["QUEUED", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"], default: "QUEUED" },
    progress: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    documentId: { type: String },
    tenderId: { type: String },
    bidId: { type: String },
    error: { type: String },
    resultReference: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// 12. Score Schema
const ScoreSchema = new Schema(
  {
    _id: { type: String, required: true },
    tenderId: { type: String, required: true, index: true },
    bidId: { type: String, required: true, index: true },
    overallScore: { type: Number, required: true },
    categoryScores: {
      eligibility: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
      financial: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      documentation: { type: Number, default: 0 },
      compliance: { type: Number, default: 0 },
    },
    strengths: [{ type: String }],
    issues: [{ type: String }],
    scoreVersion: { type: String, default: "v2.0" },
    criteriaVersion: { type: String, default: "v1.0" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// 13. OCRResult Schema
const OCRResultSchema = new Schema(
  {
    _id: { type: String, required: true },
    documentId: { type: String, required: true, index: true },
    tenderId: { type: String, required: true, index: true },
    bidId: { type: String, index: true },
    organizationId: { type: String, required: true, index: true },
    documentName: { type: String, required: true },
    mimeType: { type: String },
    documentVersion: { type: String, default: "1.0" },
    ocrVersion: { type: String, default: "v2.1-pdfparse" },
    extractionModel: { type: String, default: "gemini-flash-1.5" },
    status: {
      type: String,
      enum: ["NOT_STARTED", "QUEUED", "PROCESSING", "COMPLETED", "PARTIAL", "FAILED", "REQUIRES_REVIEW"],
      default: "PROCESSING",
    },
    overallConfidence: { type: Number, default: 0 },
    pagesProcessed: { type: Number, default: 0 },
    totalPages: { type: Number, default: 0 },
    pages: [
      {
        pageNumber: { type: Number, required: true },
        text: { type: String, required: true },
        confidence: { type: Number, default: 0.9 },
      },
    ],
    structuredFields: [
      {
        key: { type: String, required: true },
        label: { type: String, required: true },
        category: { type: String, required: true },
        value: Schema.Types.Mixed,
        unit: { type: String },
        confidence: { type: Number, default: 0.9 },
        source: {
          documentId: { type: String },
          documentName: { type: String },
          page: { type: Number, default: 1 },
          textReference: { type: String },
        },
      },
    ],
    rawText: { type: String },
    errorMessage: { type: String },
    processedAt: { type: String },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

OCRResultSchema.index({ documentId: 1, organizationId: 1 });
OCRResultSchema.index({ tenderId: 1, status: 1 });

// Exports - use existing models if compiled, or compile new ones
export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export const OrganizationModel =
  mongoose.models.Organization || mongoose.model("Organization", OrganizationSchema);
export const TenderModel = mongoose.models.Tender || mongoose.model("Tender", TenderSchema);
export const DocumentModel =
  mongoose.models.DocumentRecord || mongoose.model("DocumentRecord", DocumentRecordSchema);
export const BidModel = mongoose.models.Bid || mongoose.model("Bid", BidSchema);
export const ComplianceAnalysisModel =
  mongoose.models.ComplianceAnalysis ||
  mongoose.model("ComplianceAnalysis", ComplianceAnalysisSchema);
export const RiskAssessmentModel =
  mongoose.models.RiskAssessment || mongoose.model("RiskAssessment", RiskAssessmentSchema);
export const ReportModel = mongoose.models.Report || mongoose.model("Report", ReportSchema);
export const AuditLogModel =
  mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
export const ProcessingJobModel =
  mongoose.models.ProcessingJob || mongoose.model("ProcessingJob", ProcessingJobSchema);
export const ScoreModel =
  mongoose.models.Score || mongoose.model("Score", ScoreSchema);
export const OCRResultModel =
  mongoose.models.OCRResult || mongoose.model("OCRResult", OCRResultSchema);

