import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { GeminiService } from "@/lib/ai/gemini";
import { BidEvaluationContext } from "@/lib/ai/fallback";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bidId, mode = "compliance_summary", requirementId } = body;

    if (!bidId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter 'bidId'." },
        { status: 400 }
      );
    }

    // 1. Fetch authoritative ground-truth data from repository
    const compliance = repository.getComplianceAnalysisById(bidId);
    const bid = repository.getBidById(bidId) || (compliance ? repository.getBidById(compliance.bidId) : undefined);
    const tender = bid ? repository.getTenderById(bid.tenderId) : undefined;
    const risk = repository.getRiskAssessmentByBidId(bidId) || (bid ? repository.getRiskAssessmentByBidId(bid._id) : undefined);

    if (!compliance && !bid) {
      return NextResponse.json(
        { success: false, error: `No evaluation or bid record found for ID '${bidId}'.` },
        { status: 404 }
      );
    }

    // 2. Build structured BidEvaluationContext
    const context: BidEvaluationContext = {
      tender: {
        title: tender?.title || compliance?.tenderTitle || "Procurement Tender",
        tenderId: tender?.tenderId || "TND-2026-001",
        category: tender?.category || "GOODS",
        estimatedValue: tender?.estimatedValue || 50000000,
      },
      vendor: {
        name: compliance?.vendorName || bid?.vendorName || "Vendor Firm",
        registrationStatus: "ACTIVE",
        gstin: "07WKMCP4023I9ZY",
        pan: "WKMCP4023I",
      },
      requirements: (tender?.technicalRequirements || []).map((r) => ({
        requirementId: r._id,
        text: `${r.title}: ${r.description}`,
        classification: r.category,
        mandatory: r.mandatory,
      })),
      complianceResults: (compliance?.results || []).map((r) => ({
        requirementId: r.requirementId,
        requirementTitle: r.requirementTitle,
        category: r.category,
        status: r.result,
        reason: r.explanation,
        mandatory: r.mandatory,
        evidence: {
          document: r.evidence?.documentId || "Submitted Dossier",
          page: r.evidence?.pageNumber || 1,
          text: r.evidence?.extractedText || r.explanation,
          clauseReference: r.evidence?.clauseReference,
        },
        verification: r.statutoryVerification
          ? {
              portal: r.statutoryVerification.portal,
              status: r.statutoryVerification.status,
              verifiedName: r.statutoryVerification.verifiedName,
            }
          : undefined,
        nliResult: r.nliResult,
        officerOverride: r.officerOverride,
      })),
      risk: {
        level: compliance?.riskLevel || risk?.level || "MEDIUM",
        score: compliance?.score || 85,
        factors: risk?.signals ? risk.signals.map((s) => s.description) : ["Statutory verification check", "Document review"],
      },
      score: compliance?.score || 85,
    };

    // Audit Log Request
    repository.createAuditLog({
      actorUserId: "usr-off-001",
      actorName: "Procurement Officer",
      actorRole: "PROCUREMENT_OFFICER",
      action: "GEMINI_REQUESTED",
      resourceType: "COMPLIANCE",
      resourceId: bidId,
      result: "SUCCESS",
      metadata: { mode, requirementId },
    });

    // 3. Dispatch to GeminiService based on mode
    let aiResult: any;
    if (mode === "risk_explain") {
      aiResult = await GeminiService.generateRiskExplanation(context);
    } else if (mode === "evidence_explain") {
      aiResult = await GeminiService.generateEvidenceExplanation(context, requirementId);
    } else if (mode === "executive_report") {
      aiResult = await GeminiService.generateExecutiveReport(context);
    } else {
      aiResult = await GeminiService.generateComplianceExplanation(context);
    }

    // Audit Log Completion
    repository.createAuditLog({
      actorUserId: "usr-off-001",
      actorName: "Procurement Officer",
      actorRole: "PROCUREMENT_OFFICER",
      action: aiResult.metadata?.fallbackUsed ? "GEMINI_FALLBACK_USED" : "GEMINI_COMPLETED",
      resourceType: "COMPLIANCE",
      resourceId: bidId,
      result: "SUCCESS",
      metadata: {
        provider: aiResult.metadata?.provider,
        fallbackUsed: aiResult.metadata?.fallbackUsed,
      },
    });

    return NextResponse.json({
      success: true,
      data: aiResult,
    });
  } catch (err: any) {
    console.error("[Explain Bid API Error]", err);

    repository.createAuditLog({
      actorUserId: "usr-off-001",
      actorName: "Procurement Officer",
      actorRole: "PROCUREMENT_OFFICER",
      action: "GEMINI_FAILED",
      resourceType: "COMPLIANCE",
      resourceId: "unknown",
      result: "FAILURE",
      metadata: { error: err.message },
    });

    return NextResponse.json(
      { success: false, error: "AI Explanation Endpoint encountered an internal error." },
      { status: 500 }
    );
  }
}
