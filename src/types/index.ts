export type UserRole = "PROCUREMENT_OFFICER" | "VENDOR" | "ADMIN" | "SYSTEM";

export interface UserProfile {
  fullName: string;
  phone: string;
}

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  profile: UserProfile;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
}

export interface OrganizationAddress {
  line1: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface Organization {
  _id: string;
  name: string;
  type: "GOVERNMENT" | "PUBLIC_SECTOR" | "PRIVATE_ENTERPRISE" | "MSME";
  registrationNumber: string;
  address: OrganizationAddress;
  status: "VERIFIED" | "PENDING" | "REJECTED";
  createdAt: string;
}

export interface Requirement {
  _id: string;
  tenderId: string;
  category: "ELIGIBILITY" | "TECHNICAL" | "FINANCIAL" | "CERTIFICATION" | "COMPLIANCE";
  title: string;
  description: string;
  type:
    | "NUMERIC"
    | "TEXT"
    | "DOCUMENT"
    | "BOOLEAN"
    | "FINANCIAL"
    | "CERTIFICATION"
    | "TECHNICAL"
    | "ELIGIBILITY"
    | "EXPERIENCE"
    | "OTHER";
  mandatory: boolean;
  order: number;
}

export type TenderStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "PROCESSING"
  | "ACTIVE"
  | "CLOSING_SOON"
  | "CLOSED"
  | "CANCELLED"
  | "AWARDED"
  | "ARCHIVED"
  | "UNDER_EVALUATION";

export interface Tender {
  _id: string;
  tenderId: string;
  title: string;
  description: string;
  organizationId: string;
  authority?: string;
  department?: string;
  location?: string;
  estimatedValue?: number;
  emdAmount?: number;
  tenderFee?: number;
  category: string;
  status: TenderStatus;
  publication: {
    publishedAt: string;
    submissionDeadline: string;
    submissionStart?: string;
    openingDate?: string;
  };
  eligibilityCriteria: string[];
  technicalRequirements: Requirement[];
  documentIds: string[];
  createdBy: string;
  createdAt: string;
}

export interface ProcessingJob {
  _id: string;
  jobId: string;
  type: "OCR" | "EXTRACTION" | "VERIFICATION" | "SCORING";
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  progress: number;
  attempts?: number;
  documentId?: string;
  tenderId?: string;
  bidId?: string;
  error?: string;
  resultReference?: any;
  createdAt: string;
}

export interface ScoreRecord {
  _id: string;
  tenderId: string;
  bidId: string;
  overallScore: number;
  categoryScores: {
    eligibility: number;
    technical: number;
    financial: number;
    experience: number;
    documentation: number;
    compliance: number;
  };
  strengths: string[];
  issues: string[];
  scoreVersion: string;
  criteriaVersion: string;
  createdAt: string;
}

export type ProcessingStage =
  | "UPLOADED"
  | "VALIDATING"
  | "PARSING_OCR"
  | "CLEANING"
  | "STRUCTURED_DATA"
  | "AI_ANALYSIS"
  | "COMPLETED"
  | "FAILED";

export interface DocumentRecord {
  _id: string;
  fileName: string;
  mimeType: string;
  size: number;
  sha256?: string;
  uploadedBy: string;
  organizationId: string;
  tenderId: string;
  bidId?: string;
  status: "UPLOADED" | "PROCESSING" | "PROCESSED" | "FAILED";
  processing: {
    stage: ProcessingStage;
    startedAt: string;
    completedAt?: string;
    errorCode?: string;
  };
  extractedText?: string;
  createdAt: string;
}

export type ComplianceStatus = "COMPLIANT" | "REVIEW_REQUIRED" | "NON_COMPLIANT";

export interface Evidence {
  _id: string;
  documentId: string;
  documentName: string;
  requirementId: string;
  bidId: string;
  pageNumber: number;
  clauseReference: string;
  extractedText: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export type NLIStatus = "SUPPORTS" | "CONTRADICTS" | "INSUFFICIENT";

export interface StatutoryVerificationData {
  portal: "GST" | "PAN" | "UDYAM" | "MCA" | "BIS" | "DEBARMENT" | "EPFO";
  identifier: string;
  status: "VERIFIED" | "NOT_FOUND" | "MISMATCH" | "NON_COMPLIANT" | "UNAVAILABLE" | "MANUAL_REVIEW_REQUIRED" | "INVALID_INPUT";
  verifiedName?: string;
  matchedName?: string;
  isMatch: boolean;
  isDebarred?: boolean;
  environment: "DEMO / SYNTHETIC VERIFICATION DATA";
  verifiedAt: string;
}

export interface ComplianceResultItem {
  _id: string;
  requirementId: string;
  requirementTitle: string;
  category: string;
  mandatory: boolean;
  result: ComplianceStatus;
  confidence: number;
  evidence: Evidence;
  explanation: string;
  reviewStatus: "PENDING_REVIEW" | "VERIFIED" | "OVERRIDDEN";
  debertaClassification?: {
    category: string;
    confidence: number;
    modelVersion: string;
  };
  nliResult?: {
    status: NLIStatus;
    explanation: string;
    confidence: number;
    modelVersion: string;
  };
  statutoryVerification?: StatutoryVerificationData;
  ruleEvaluation?: {
    rule: string;
    extractedValue: string;
    thresholdValue: string;
    passed: boolean;
  };
  officerOverride?: {
    overriddenBy: string;
    overriddenAt: string;
    previousResult: ComplianceStatus;
    newResult: ComplianceStatus;
    reason: string;
  };
}

export interface ComplianceAnalysis {
  _id: string;
  tenderId: string;
  tenderTitle: string;
  bidId: string;
  vendorName: string;
  score: number;
  compliantCount: number;
  reviewRequiredCount: number;
  nonCompliantCount: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  results: ComplianceResultItem[];
  status: "COMPLETED" | "REQUIRES_REVIEW" | "PROCESSING";
  officerFinalDecision?: {
    decision: "QUALIFIED" | "DISQUALIFIED" | "KEEP_FOR_REVIEW";
    decidedBy: string;
    decidedAt: string;
    reason: string;
  };
  createdAt: string;
}

export interface Bid {
  _id: string;
  tenderId: string;
  vendorOrganizationId: string;
  vendorName: string;
  submittedBy: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
  submittedAt: string;
  documentIds: string[];
  complianceAnalysisId?: string;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
  complianceScore?: number;
  createdAt: string;
}

export interface RiskSignal {
  id: string;
  type: "DISCREPANCY" | "ANOMALY" | "MISSING_EVIDENCE" | "MARGINAL_COMPLIANCE";
  severity: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  affectedRequirementId?: string;
}

export interface RiskAssessment {
  _id: string;
  bidId: string;
  vendorName: string;
  tenderTitle: string;
  complianceAnalysisId: string;
  level: "LOW" | "MEDIUM" | "HIGH";
  score: number;
  signals: RiskSignal[];
  explanation: string;
  engineVersion: string;
  createdAt: string;
}

export interface Report {
  _id: string;
  type: "COMPLIANCE_EVALUATION" | "RISK_ASSESSMENT" | "BID_SUMMARY";
  title: string;
  tenderId: string;
  bidId?: string;
  createdBy: string;
  status: "FINAL" | "DRAFT";
  generatedAt: string;
  content: {
    summary: string;
    details: any;
  };
}

export interface AuditLog {
  _id: string;
  actorUserId: string;
  actorName: string;
  actorRole: UserRole;
  organizationId?: string;
  action: string;
  resourceType: "TENDER" | "BID" | "DOCUMENT" | "COMPLIANCE" | "SECURITY" | "USER";
  resourceId: string;
  result: "SUCCESS" | "FAILURE";
  metadata?: Record<string, any>;
  createdAt: string;
}

export type OCRStatus =
  | "NOT_STARTED"
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "PARTIAL"
  | "FAILED"
  | "REQUIRES_REVIEW";

export type ExtractedCategory =
  | "IDENTITY"
  | "FINANCIAL"
  | "DATES"
  | "EXPERIENCE"
  | "TECHNICAL"
  | "REGISTRATION"
  | "REQUIREMENTS";

export interface OCRSourceReference {
  documentId: string;
  documentName?: string;
  page: number;
  textReference?: string;
}

export interface StructuredOCRField {
  key: string;
  label: string;
  category: ExtractedCategory;
  value: string | number | boolean | string[];
  unit?: string;
  confidence: number;
  source: OCRSourceReference;
}

export interface OCRPageChunk {
  pageNumber: number;
  text: string;
  confidence: number;
}

export interface OCRResult {
  _id: string;
  documentId: string;
  tenderId: string;
  bidId?: string;
  organizationId: string;
  documentName: string;
  mimeType?: string;
  documentVersion?: string;
  ocrVersion?: string;
  extractionModel?: string;
  status: OCRStatus;
  overallConfidence: number;
  pagesProcessed: number;
  totalPages: number;
  pages: OCRPageChunk[];
  structuredFields: StructuredOCRField[];
  rawText: string;
  errorMessage?: string;
  processedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

