import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { GeminiService } from "@/lib/ai/gemini";
import { BidEvaluationContext } from "@/lib/ai/fallback";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bidId, message, history = [] } = body;

    if (!bidId || !message) {
      return NextResponse.json(
        { success: false, error: "Missing parameters 'bidId' and 'message'." },
        { status: 400 }
      );
    }

    const compliance = repository.getComplianceAnalysisById(bidId);
    const bid = repository.getBidById(bidId) || (compliance ? repository.getBidById(compliance.bidId) : undefined);
    const tender = bid ? repository.getTenderById(bid.tenderId) : undefined;
    const risk = repository.getRiskAssessmentByBidId(bidId) || (bid ? repository.getRiskAssessmentByBidId(bid._id) : undefined);

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
        verification: r.statutoryVerification,
        nliResult: r.nliResult,
        officerOverride: r.officerOverride,
      })),
      risk: {
        level: compliance?.riskLevel || risk?.level || "MEDIUM",
        score: compliance?.score || 85,
        factors: risk?.signals ? risk.signals.map((s) => s.description) : ["Statutory verification check"],
      },
      score: compliance?.score || 85,
    };

    const chatRes = await GeminiService.chatWithOfficerAssistant(context, message, history);

    return NextResponse.json({
      success: true,
      data: chatRes,
    });
  } catch (err: any) {
    console.error("[Officer Chat API Error]", err);
    return NextResponse.json(
      { success: false, error: "Officer Assistant encountered an internal error." },
      { status: 500 }
    );
  }
}
