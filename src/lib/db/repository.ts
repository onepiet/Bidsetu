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
  initialUsers,
  initialOrganizations,
  initialTenders,
  initialDocuments,
  initialBids,
  initialComplianceAnalyses,
  initialRiskAssessments,
  initialReports,
  initialAuditLogs,
} from "./seedData";

class DataRepository {
  private users: User[] = JSON.parse(JSON.stringify(initialUsers));
  private organizations: Organization[] = JSON.parse(JSON.stringify(initialOrganizations));
  private tenders: Tender[] = JSON.parse(JSON.stringify(initialTenders));
  private documents: DocumentRecord[] = JSON.parse(JSON.stringify(initialDocuments));
  private bids: Bid[] = JSON.parse(JSON.stringify(initialBids));
  private complianceAnalyses: ComplianceAnalysis[] = JSON.parse(JSON.stringify(initialComplianceAnalyses));
  private riskAssessments: RiskAssessment[] = JSON.parse(JSON.stringify(initialRiskAssessments));
  private reports: Report[] = JSON.parse(JSON.stringify(initialReports));
  private auditLogs: AuditLog[] = JSON.parse(JSON.stringify(initialAuditLogs));

  /**
   * Reset Repository to the deterministic presentation baseline state
   */
  public resetToPresentationState(): void {
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.organizations = JSON.parse(JSON.stringify(initialOrganizations));
    this.tenders = JSON.parse(JSON.stringify(initialTenders));
    this.documents = JSON.parse(JSON.stringify(initialDocuments));
    this.bids = JSON.parse(JSON.stringify(initialBids));
    this.complianceAnalyses = JSON.parse(JSON.stringify(initialComplianceAnalyses));
    this.riskAssessments = JSON.parse(JSON.stringify(initialRiskAssessments));
    this.reports = JSON.parse(JSON.stringify(initialReports));
    this.auditLogs = JSON.parse(JSON.stringify(initialAuditLogs));

    this.createAuditLog({
      actorUserId: "usr-adm-001",
      actorName: "System Administrator",
      actorRole: "ADMIN",
      action: "PRESENTATION_STATE_RESET",
      resourceType: "SECURITY",
      resourceId: "tnd-001",
      result: "SUCCESS",
      metadata: { resetAt: new Date().toISOString(), scenario: "SIH26100 Presentation Baseline" },
    });
  }

  // Users
  getUsers(): User[] {
    return this.users;
  }
  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  createUser(user: Omit<User, "_id" | "createdAt">): User {
    const newUser: User = {
      ...user,
      _id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // Organizations
  getOrganizations(): Organization[] {
    return this.organizations;
  }
  getOrganizationById(id: string): Organization | undefined {
    return this.organizations.find((o) => o._id === id);
  }
  createOrganization(org: Omit<Organization, "_id" | "createdAt">): Organization {
    const newOrg: Organization = {
      ...org,
      _id: `org-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.organizations.push(newOrg);
    return newOrg;
  }

  // Tenders
  getTenders(): Tender[] {
    return this.tenders;
  }
  getTenderById(id: string): Tender | undefined {
    return this.tenders.find((t) => t._id === id || t.tenderId === id);
  }
  createTender(tender: Omit<Tender, "_id" | "createdAt">): Tender {
    const newTender: Tender = {
      ...tender,
      _id: `tnd-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.tenders.unshift(newTender);
    this.createAuditLog({
      actorUserId: tender.createdBy,
      actorName: "Procurement Officer",
      actorRole: "PROCUREMENT_OFFICER",
      action: "TENDER_CREATED",
      resourceType: "TENDER",
      resourceId: newTender._id,
      result: "SUCCESS",
      metadata: { tenderId: newTender.tenderId, title: newTender.title },
    });
    return newTender;
  }

  // Bids
  getBids(): Bid[] {
    return this.bids;
  }
  getBidById(id: string): Bid | undefined {
    return this.bids.find((b) => b._id === id);
  }
  getBidsByTender(tenderId: string): Bid[] {
    return this.bids.filter((b) => b.tenderId === tenderId);
  }
  createBid(bid: Omit<Bid, "_id" | "createdAt">): Bid {
    const newBid: Bid = {
      ...bid,
      _id: `bid-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.bids.unshift(newBid);
    this.createAuditLog({
      actorUserId: bid.submittedBy,
      actorName: bid.vendorName,
      actorRole: "VENDOR",
      action: "BID_SUBMISSION",
      resourceType: "BID",
      resourceId: newBid._id,
      result: "SUCCESS",
      metadata: { tenderId: bid.tenderId },
    });
    return newBid;
  }
  updateBid(id: string, updates: Partial<Bid>): Bid | undefined {
    const bidIndex = this.bids.findIndex((b) => b._id === id);
    if (bidIndex === -1) return undefined;
    this.bids[bidIndex] = { ...this.bids[bidIndex], ...updates };
    return this.bids[bidIndex];
  }

  // Documents
  getDocuments(): DocumentRecord[] {
    return this.documents;
  }
  getDocumentById(id: string): DocumentRecord | undefined {
    return this.documents.find((d) => d._id === id);
  }
  createDocument(doc: Omit<DocumentRecord, "_id" | "createdAt">): DocumentRecord {
    const newDoc: DocumentRecord = {
      ...doc,
      _id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.documents.unshift(newDoc);
    return newDoc;
  }

  // Compliance
  getComplianceAnalyses(): ComplianceAnalysis[] {
    return this.complianceAnalyses;
  }
  getComplianceAnalysisById(id: string): ComplianceAnalysis | undefined {
    return this.complianceAnalyses.find((c) => c._id === id || c.bidId === id);
  }
  createComplianceAnalysis(analysis: Omit<ComplianceAnalysis, "_id" | "createdAt">): ComplianceAnalysis {
    const newAnalysis: ComplianceAnalysis = {
      ...analysis,
      _id: `cmp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.complianceAnalyses.unshift(newAnalysis);

    // Also update bid status & reference
    const bid = this.getBidById(analysis.bidId);
    if (bid) {
      bid.complianceAnalysisId = newAnalysis._id;
      bid.complianceScore = newAnalysis.score;
      bid.riskLevel = newAnalysis.riskLevel;
    }

    this.createAuditLog({
      actorUserId: "usr-off-001",
      actorName: "Procurement Officer",
      actorRole: "PROCUREMENT_OFFICER",
      action: "COMPLIANCE_ANALYSIS_EXECUTED",
      resourceType: "COMPLIANCE",
      resourceId: newAnalysis._id,
      result: "SUCCESS",
      metadata: { score: newAnalysis.score, riskLevel: newAnalysis.riskLevel },
    });
    return newAnalysis;
  }

  updateComplianceItem(
    analysisId: string,
    resultId: string,
    newResult: "COMPLIANT" | "NON_COMPLIANT" | "REVIEW_REQUIRED",
    reason: string,
    officerName: string = "Prayag Kaushik"
  ): ComplianceAnalysis | undefined {
    const analysis = this.getComplianceAnalysisById(analysisId);
    if (!analysis) return undefined;

    const item = analysis.results.find((r) => r._id === resultId);
    if (!item) return undefined;

    const previousResult = item.result;
    item.result = newResult;
    item.reviewStatus = "OVERRIDDEN";
    item.officerOverride = {
      overriddenBy: officerName,
      overriddenAt: new Date().toISOString(),
      previousResult,
      newResult,
      reason,
    };

    // Recalculate summary metrics
    analysis.compliantCount = analysis.results.filter((r) => r.result === "COMPLIANT").length;
    analysis.reviewRequiredCount = analysis.results.filter((r) => r.result === "REVIEW_REQUIRED").length;
    analysis.nonCompliantCount = analysis.results.filter((r) => r.result === "NON_COMPLIANT").length;

    if (analysis.reviewRequiredCount === 0) {
      analysis.status = "COMPLETED";
    }

    this.createAuditLog({
      actorUserId: "usr-off-001",
      actorName: officerName,
      actorRole: "PROCUREMENT_OFFICER",
      action: "OFFICER_RESULT_OVERRIDE",
      resourceType: "COMPLIANCE",
      resourceId: analysis._id,
      result: "SUCCESS",
      metadata: { resultId, previousResult, newResult, reason, bidId: analysis.bidId },
    });

    return analysis;
  }

  recordFinalOfficerDecision(
    analysisId: string,
    decision: "QUALIFIED" | "DISQUALIFIED" | "KEEP_FOR_REVIEW",
    reason: string,
    officerName: string = "Prayag Kaushik"
  ): ComplianceAnalysis | undefined {
    const analysis = this.getComplianceAnalysisById(analysisId);
    if (!analysis) return undefined;

    analysis.officerFinalDecision = {
      decision,
      decidedBy: officerName,
      decidedAt: new Date().toISOString(),
      reason,
    };
    analysis.status = decision === "KEEP_FOR_REVIEW" ? "REQUIRES_REVIEW" : "COMPLETED";

    // Update Bid Status in Repository
    const bid = this.getBidById(analysis.bidId);
    if (bid) {
      bid.status = decision === "QUALIFIED" ? "ACCEPTED" : decision === "DISQUALIFIED" ? "REJECTED" : "UNDER_REVIEW";
    }

    this.createAuditLog({
      actorUserId: "usr-off-001",
      actorName: officerName,
      actorRole: "PROCUREMENT_OFFICER",
      action: "FINAL_PROCUREMENT_OFFICER_DECISION",
      resourceType: "BID",
      resourceId: analysis.bidId,
      result: "SUCCESS",
      metadata: { decision, reason, tenderId: analysis.tenderId, score: analysis.score },
    });

    return analysis;
  }

  // Risk
  getRiskAssessments(): RiskAssessment[] {
    return this.riskAssessments;
  }
  getRiskAssessmentByBidId(bidId: string): RiskAssessment | undefined {
    return this.riskAssessments.find((r) => r.bidId === bidId);
  }

  // Reports
  getReports(): Report[] {
    return this.reports;
  }
  getReportById(id: string): Report | undefined {
    return this.reports.find((r) => r._id === id);
  }
  createReport(report: Omit<Report, "_id" | "generatedAt">): Report {
    const newReport: Report = {
      ...report,
      _id: `rep-${Date.now()}`,
      generatedAt: new Date().toISOString(),
    };
    this.reports.unshift(newReport);
    return newReport;
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }
  createAuditLog(log: Omit<AuditLog, "_id" | "createdAt">): AuditLog {
    const newLog: AuditLog = {
      ...log,
      _id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }
}

// Global singleton instance
const globalForRepo = global as unknown as { repositoryInstance?: DataRepository };
export const repository = globalForRepo.repositoryInstance || new DataRepository();
if (process.env.NODE_ENV !== "production") globalForRepo.repositoryInstance = repository;
