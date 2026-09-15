import {
  User,
  Organization,
  Tender,
  Bid,
  DocumentRecord,
  ComplianceAnalysis,
  RiskAssessment,
  Report,
  AuditLog,
} from "@/types";
import {
  PRESENTATION_TENDER_ID,
  presentationTender,
  presentationBids,
  presentationComplianceAnalyses,
  presentationRiskAssessments,
  PRESENTATION_DOCUMENT_REGISTRY,
} from "@/lib/presentation/registry";

export const initialOrganizations: Organization[] = [
  {
    _id: "org-gov-001",
    name: "Ministry of New and Renewable Energy",
    type: "GOVERNMENT",
    registrationNumber: "GOI-MNRE-2026-01",
    address: {
      line1: "Atal Akshay Urja Bhawan, CGO Complex, Lodhi Road",
      city: "New Delhi",
      state: "Delhi",
      pinCode: "110003",
    },
    status: "VERIFIED",
    createdAt: "2026-01-15T09:00:00Z",
  },
  {
    _id: "org-gov-002",
    name: "National Informatics Centre Services Inc.",
    type: "PUBLIC_SECTOR",
    registrationNumber: "NICSI-DEL-1995-09",
    address: {
      line1: "Hall No. 2 & 3, 6th Floor, NBCC Tower, Bhikaji Cama Place",
      city: "New Delhi",
      state: "Delhi",
      pinCode: "110066",
    },
    status: "VERIFIED",
    createdAt: "2026-02-01T10:30:00Z",
  },
  {
    _id: "org-ven-001",
    name: "Tata Power Renewable Energy Limited",
    type: "PRIVATE_ENTERPRISE",
    registrationNumber: "CIN-U40108MH2007PLC168314",
    address: {
      line1: "Corporate Centre, 34 Sant Tukaram Road, Carnac Bunder",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: "400009",
    },
    status: "VERIFIED",
    createdAt: "2026-02-10T14:20:00Z",
  },
  {
    _id: "org-ven-002",
    name: "Adani Green Energy Systems Ltd",
    type: "PRIVATE_ENTERPRISE",
    registrationNumber: "CIN-L40106GJ2015PLC082007",
    address: {
      line1: "Adani Corporate House, Shantigram, Near Vaishno Devi Circle",
      city: "Ahmedabad",
      state: "Gujarat",
      pinCode: "382421",
    },
    status: "VERIFIED",
    createdAt: "2026-02-12T11:15:00Z",
  },
  {
    _id: "org-ven-003",
    name: "Vertex Infotech & Power Solutions Pvt Ltd",
    type: "MSME",
    registrationNumber: "CIN-U72200DL2018PTC334512",
    address: {
      line1: "42 Industry House, Okhla Industrial Area Phase-III",
      city: "New Delhi",
      state: "Delhi",
      pinCode: "110020",
    },
    status: "VERIFIED",
    createdAt: "2026-02-14T09:10:00Z",
  },
  {
    _id: "org-ven-004",
    name: "Evergreen Energy Private Limited",
    type: "PRIVATE_ENTERPRISE",
    registrationNumber: "CIN-U40100UP2019PTC118902",
    address: {
      line1: "Tech Tower 8, Sector 62",
      city: "Noida",
      state: "Uttar Pradesh",
      pinCode: "201301",
    },
    status: "VERIFIED",
    createdAt: "2026-02-16T15:40:00Z",
  },
];

export const initialUsers: User[] = [
  {
    _id: "usr-off-001",
    email: "officer@mnre.gov.in",
    role: "PROCUREMENT_OFFICER",
    organizationId: "org-gov-001",
    profile: {
      fullName: "Prayag Kaushik",
      phone: "+91 98110 44219",
    },
    status: "ACTIVE",
    createdAt: "2026-01-20T08:00:00Z",
  },
  {
    _id: "usr-ven-001",
    email: "tenders@tatapowerrenewable.com",
    role: "VENDOR",
    organizationId: "org-ven-001",
    profile: {
      fullName: "Ananya Deshmukh",
      phone: "+91 98201 55678",
    },
    status: "ACTIVE",
    createdAt: "2026-02-15T09:30:00Z",
  },
  {
    _id: "usr-ven-002",
    email: "bids@adanigreen.com",
    role: "VENDOR",
    organizationId: "org-ven-002",
    profile: {
      fullName: "Rajesh Adani",
      phone: "+91 98795 11024",
    },
    status: "ACTIVE",
    createdAt: "2026-02-16T10:00:00Z",
  },
  {
    _id: "usr-ven-003",
    email: "tenders@vertexinfotech.co.in",
    role: "VENDOR",
    organizationId: "org-ven-003",
    profile: {
      fullName: "Vikram Malhotra",
      phone: "+91 98102 33491",
    },
    status: "ACTIVE",
    createdAt: "2026-02-18T14:15:00Z",
  },
  {
    _id: "usr-ven-004",
    email: "contracts@evergreenenergy.in",
    role: "VENDOR",
    organizationId: "org-ven-004",
    profile: {
      fullName: "Sanjay Verma",
      phone: "+91 99580 44210",
    },
    status: "ACTIVE",
    createdAt: "2026-02-20T11:45:00Z",
  },
  {
    _id: "usr-adm-001",
    email: "admin@bidsetu.gov.in",
    role: "ADMIN",
    profile: {
      fullName: "Shubham Kaushik",
      phone: "+91 99100 88231",
    },
    status: "ACTIVE",
    createdAt: "2026-01-10T07:00:00Z",
  },
];

export const initialTenders: Tender[] = [presentationTender];

export const initialDocuments: DocumentRecord[] = PRESENTATION_DOCUMENT_REGISTRY.map((doc) => ({
  _id: doc.documentId,
  fileName: doc.fileName,
  mimeType: "application/pdf",
  size: 4892400,
  sha256: doc.sha256,
  uploadedBy: "usr-ven-001",
  organizationId: "org-ven-001",
  tenderId: PRESENTATION_TENDER_ID,
  bidId: doc.bidderId,
  status: "PROCESSED",
  processing: {
    stage: "COMPLETED",
    startedAt: "2026-02-28T11:00:00Z",
    completedAt: "2026-02-28T11:04:15Z",
  },
  extractedText: doc.extractedText,
  createdAt: "2026-02-28T11:00:00Z",
}));

export const initialBids: Bid[] = presentationBids;

export const initialComplianceAnalyses: ComplianceAnalysis[] = presentationComplianceAnalyses;

export const initialRiskAssessments: RiskAssessment[] = presentationRiskAssessments;

export const initialReports: Report[] = [
  {
    _id: "rep-001",
    type: "COMPLIANCE_EVALUATION",
    title: "Bid Compliance Verification & Evaluation Report — TND-2026-MNRE-0842",
    tenderId: PRESENTATION_TENDER_ID,
    bidId: "bid-001",
    createdBy: "usr-off-001",
    status: "FINAL",
    generatedAt: "2026-03-02T10:15:00Z",
    content: {
      summary:
        "Comprehensive automated verification of technical, financial and statutory documentation for Tata Power Renewable Energy Limited against Tender TND-2026-MNRE-0842.",
      details: {
        score: 96,
        risk: "LOW",
        evaluatedRequirements: 10,
        passedMandatory: 10,
        itemsRequiringReview: 0,
      },
    },
  },
];

export const initialAuditLogs: AuditLog[] = [
  {
    _id: "aud-001",
    actorUserId: "usr-off-001",
    actorName: "Prayag Kaushik",
    actorRole: "PROCUREMENT_OFFICER",
    organizationId: "org-gov-001",
    action: "TENDER_PUBLISHED",
    resourceType: "TENDER",
    resourceId: PRESENTATION_TENDER_ID,
    result: "SUCCESS",
    metadata: { tenderId: "TND-2026-MNRE-0842", category: "Renewable Energy & Infrastructure" },
    createdAt: "2026-02-01T10:00:00Z",
  },
  {
    _id: "aud-002",
    actorUserId: "usr-ven-001",
    actorName: "Tata Power Renewable Energy Limited",
    actorRole: "VENDOR",
    organizationId: "org-ven-001",
    action: "BID_SUBMITTED",
    resourceType: "BID",
    resourceId: "bid-001",
    result: "SUCCESS",
    metadata: { tenderId: PRESENTATION_TENDER_ID, documentsCount: 5 },
    createdAt: "2026-02-28T11:10:00Z",
  },
  {
    _id: "aud-003",
    actorUserId: "usr-ven-002",
    actorName: "Adani Green Energy Systems Ltd",
    actorRole: "VENDOR",
    organizationId: "org-ven-002",
    action: "BID_SUBMITTED",
    resourceType: "BID",
    resourceId: "bid-002",
    result: "SUCCESS",
    metadata: { tenderId: PRESENTATION_TENDER_ID, documentsCount: 2 },
    createdAt: "2026-03-01T09:15:00Z",
  },
  {
    _id: "aud-004",
    actorUserId: "usr-ven-003",
    actorName: "Vertex Infotech & Power Solutions Pvt Ltd",
    actorRole: "VENDOR",
    organizationId: "org-ven-003",
    action: "BID_SUBMITTED",
    resourceType: "BID",
    resourceId: "bid-003",
    result: "SUCCESS",
    metadata: { tenderId: PRESENTATION_TENDER_ID, documentsCount: 1 },
    createdAt: "2026-03-02T14:20:00Z",
  },
  {
    _id: "aud-005",
    actorUserId: "usr-off-001",
    actorName: "Compliance Engine Service",
    actorRole: "SYSTEM",
    action: "COMPLIANCE_EVALUATION_EXECUTED",
    resourceType: "COMPLIANCE",
    resourceId: "cmp-001",
    result: "SUCCESS",
    metadata: { score: 96, riskLevel: "LOW", bidId: "bid-001" },
    createdAt: "2026-03-01T14:30:00Z",
  },
];
