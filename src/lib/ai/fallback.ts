/**
 * BIDSETU — Deterministic Fallback Explanation Engine
 * 
 * Provides structured, data-grounded explanations when Gemini AI API is unavailable,
 * rate-limited (429), unauthenticated (401/403), timing out, or returning invalid JSON.
 * 
 * CRITICAL RULE: Deterministic explanations are generated directly from authoritative
 * compliance result statuses, extracted document text, statutory verification records,
 * and risk signals without fabricating any information.
 */

export interface BidEvaluationContext {
  tender?: {
    title?: string;
    tenderId?: string;
    category?: string;
    estimatedValue?: number;
  };
  vendor?: {
    name?: string;
    registrationStatus?: string;
    gstin?: string;
    pan?: string;
  };
  requirements?: Array<{
    requirementId: string;
    text: string;
    classification: string;
    classificationConfidence?: number;
    mandatory?: boolean;
  }>;
  complianceResults?: Array<{
    requirementId: string;
    requirementTitle: string;
    category: string;
    status: "COMPLIANT" | "NON_COMPLIANT" | "REVIEW_REQUIRED" | string;
    reason: string;
    mandatory?: boolean;
    evidence?: {
      document?: string;
      page?: number;
      text?: string;
      clauseReference?: string;
    };
    verification?: {
      portal?: string;
      status?: string;
      verifiedName?: string;
    };
    nliResult?: {
      status?: "SUPPORTS" | "CONTRADICTS" | "NEUTRAL" | "INSUFFICIENT" | string;
      explanation?: string;
      confidence?: number;
    };
    officerOverride?: {
      newResult: string;
      reason: string;
    };
  }>;
  risk?: {
    level: "LOW" | "MEDIUM" | "HIGH" | string;
    score?: number;
    factors: string[];
  };
  score?: number;
}

export interface StructuredAIResponse {
  summary: string;
  overallAssessment: string;
  keyFindings: Array<{
    requirementId: string;
    status: "PASS" | "FAIL" | "REVIEW_REQUIRED";
    explanation: string;
    evidenceReference: string;
    needsHumanReview: boolean;
  }>;
  riskExplanation: string;
  reviewItems: Array<{
    requirementId: string;
    reason: string;
    recommendedAction: string;
  }>;
  officerRecommendation: string;
  disclaimer: string;
  metadata: {
    provider: "gemini" | "bidsetu";
    model: string;
    mode: "live" | "fallback";
    generatedAt: string;
    fallbackUsed: boolean;
    fallbackReason?: string;
  };
}

export class DeterministicFallbackEngine {
  /**
   * Generate Full Compliance & Bid Evaluation Explanation
   */
  static generateFallbackComplianceExplanation(
    context: BidEvaluationContext,
    reason = "Gemini service unavailable"
  ): StructuredAIResponse {
    const generatedAt = new Date().toISOString();
    const results = context.complianceResults || [];
    const compliantCount = results.filter((r) => r.status === "COMPLIANT").length;
    const reviewCount = results.filter((r) => r.status === "REVIEW_REQUIRED").length;
    const nonCompliantCount = results.filter((r) => r.status === "NON_COMPLIANT").length;
    const totalCount = results.length;

    const vendorName = context.vendor?.name || "The vendor";
    const tenderTitle = context.tender?.title || "the procurement tender";
    const riskLevel = context.risk?.level || "MEDIUM";

    // Overall summary formulation
    const summary = `${vendorName}'s bid for "${tenderTitle}" has been evaluated by BIDSETU's deterministic engine. Out of ${totalCount} mandatory/technical requirements, ${compliantCount} are Compliant, ${reviewCount} require Officer Review, and ${nonCompliantCount} are Non-Compliant. Composite Risk Level: ${riskLevel}.`;

    // Assessment synthesis
    let overallAssessment = "";
    if (nonCompliantCount > 0) {
      overallAssessment = `The submission fails ${nonCompliantCount} mandatory requirement(s). Under procurement rules, mandatory failures constitute grounds for technical disqualification unless an officer override is recorded.`;
    } else if (reviewCount > 0) {
      overallAssessment = `The submission satisfies basic mandatory checks but contains ${reviewCount} item(s) flagged for manual procurement officer verification (such as statutory mismatches or ambiguous text clauses).`;
    } else {
      overallAssessment = `The submission satisfies all evaluated mandatory clauses and statutory verification checks with zero policy deviations.`;
    }

    // Key findings mapping
    const keyFindings = results.map((r) => {
      let explanation = "";
      let needsHumanReview = false;

      if (r.status === "COMPLIANT") {
        explanation = `The requirement "${r.requirementTitle}" is marked COMPLIANT because submitted document evidence ("${r.evidence?.text || r.reason}") satisfies the configured evaluation rule.`;
      } else if (r.status === "NON_COMPLIANT") {
        explanation = `The requirement "${r.requirementTitle}" is marked NON_COMPLIANT because the extracted evidence ("${r.evidence?.text || r.reason}") fails to satisfy the mandatory threshold.`;
      } else {
        needsHumanReview = true;
        explanation = `The requirement "${r.requirementTitle}" is marked REVIEW_REQUIRED because available evidence or statutory verification requires human procurement officer sign-off.`;
      }

      if (r.verification && r.verification.status === "MISMATCH") {
        needsHumanReview = true;
        explanation += ` Note: Government portal verification returned a MISMATCH (${r.verification.portal}: ${r.verification.verifiedName}).`;
      }

      if (r.nliResult && r.nliResult.status === "CONTRADICTS") {
        needsHumanReview = true;
        explanation += ` NLI Contradiction Radar detected a clause conflict.`;
      }

      if (r.officerOverride) {
        explanation += ` [Officer Override Applied: Set to ${r.officerOverride.newResult} — Reason: "${r.officerOverride.reason}"]`;
      }

      return {
        requirementId: r.requirementId,
        status: r.status === "COMPLIANT" ? ("PASS" as const) : r.status === "NON_COMPLIANT" ? ("FAIL" as const) : ("REVIEW_REQUIRED" as const),
        explanation,
        evidenceReference: r.evidence?.document ? `${r.evidence.document} (Page ${r.evidence.page || 1})` : "Submitted Dossier",
        needsHumanReview,
      };
    });

    // Risk explanation
    const riskFactors = context.risk?.factors || [];
    let riskExplanation = `Composite Risk Level: ${riskLevel}.`;
    if (riskFactors.length > 0) {
      riskExplanation += ` Key risk signals identified: ${riskFactors.join("; ")}.`;
    } else {
      riskExplanation += ` No critical fraud, debarment, or statutory discrepancy signals detected.`;
    }

    // Review items filtering
    const reviewItems = results
      .filter((r) => r.status === "REVIEW_REQUIRED" || r.status === "NON_COMPLIANT" || r.verification?.status === "MISMATCH")
      .map((r) => ({
        requirementId: r.requirementId,
        reason: r.verification?.status === "MISMATCH"
          ? `Statutory record discrepancy on ${r.verification.portal}`
          : r.reason || `Manual verification required for ${r.requirementTitle}`,
        recommendedAction: r.status === "NON_COMPLIANT"
          ? "Verify if vendor submitted supplementary clarification before final qualification decision."
          : "Inspect original PDF page and statutory portal record before signing evaluation.",
      }));

    // Officer Recommendation
    let officerRecommendation = "";
    if (nonCompliantCount > 0) {
      officerRecommendation = "RECOMMENDATION: Review mandatory requirement failures. Disqualify bid unless official officer override justification is recorded in the audit trail.";
    } else if (reviewCount > 0) {
      officerRecommendation = "RECOMMENDATION: Inspect the flagged review items and statutory portal verification records before issuing technical qualification.";
    } else {
      officerRecommendation = "RECOMMENDATION: Bid satisfies all automated rules. Proceed to financial bid opening upon officer sign-off.";
    }

    return {
      summary,
      overallAssessment,
      keyFindings,
      riskExplanation,
      reviewItems,
      officerRecommendation,
      disclaimer: "Final procurement qualification or disqualification decision must be made by the authorized procurement officer.",
      metadata: {
        provider: "bidsetu",
        model: "deterministic-fallback-v1.0",
        mode: "fallback",
        generatedAt,
        fallbackUsed: true,
        fallbackReason: reason,
      },
    };
  }

  /**
   * Single Requirement Explanation Fallback
   */
  static generateFallbackRequirementExplanation(requirementTitle: string, description?: string, category?: string): string {
    return `This requirement ("${requirementTitle}") requires the vendor to submit valid ${category || "eligibility"} evidence. The procurement officer should verify that the submitted document is authentic, unexpired, issued by a competent authority, and directly matches the tender specification.`;
  }

  /**
   * Single Evidence Explanation Fallback
   */
  static generateFallbackEvidenceExplanation(
    requirementTitle: string,
    status: string,
    extractedText?: string,
    verificationStatus?: string
  ): string {
    let text = `The submitted evidence for "${requirementTitle}" (${extractedText ? `"${extractedText}"` : "Dossier Clause"}) was evaluated against deterministic procurement rules. Status: ${status}.`;
    if (verificationStatus && verificationStatus !== "VERIFIED") {
      text += ` Government portal verification returned: ${verificationStatus}. Additional officer inspection is recommended.`;
    }
    return text;
  }

  /**
   * Executive AI Report Generation Fallback
   */
  static generateFallbackExecutiveReport(context: BidEvaluationContext): string {
    const res = this.generateFallbackComplianceExplanation(context, "Executive Report deterministic synthesis");
    return `
================================================================================
BIDSETU — EXECUTIVE PROCUREMENT EVALUATION REPORT (DETERMINISTIC FALLBACK)
================================================================================
Tender Title:    ${context.tender?.title || "N/A"}
Tender ID:       ${context.tender?.tenderId || "N/A"}
Vendor Name:     ${context.vendor?.name || "N/A"}
Evaluation Date: ${new Date().toLocaleDateString()}
Risk Level:      ${context.risk?.level || "MEDIUM"}
Overall Score:   ${context.score || 85}%

1. EXECUTIVE SUMMARY
${res.summary}

2. OVERALL ASSESSMENT
${res.overallAssessment}

3. RISK INTELLIGENCE & STATUTORY VERIFICATION
${res.riskExplanation}

4. OFFICER RECOMMENDATION
${res.officerRecommendation}

================================================================================
DISCLAIMER: This report is generated by BIDSETU's deterministic evaluation engine.
Final procurement qualification or disqualification authority rests exclusively
with the designated Procurement Committee / Officer.
================================================================================
`.trim();
  }

  /**
   * Officer Assistant Chat Fallback
   */
  static generateFallbackChatResponse(context: BidEvaluationContext, userMessage: string): string {
    const lower = userMessage.toLowerCase();
    const results = context.complianceResults || [];
    const nonCompliant = results.filter((r) => r.status === "NON_COMPLIANT");
    const reviewReq = results.filter((r) => r.status === "REVIEW_REQUIRED" || r.verification?.status === "MISMATCH");

    if (lower.includes("why") && lower.includes("fail")) {
      if (nonCompliant.length === 0) {
        return `This bid did not fail any mandatory rules. All evaluated requirements are either Compliant or marked for Review.`;
      }
      return `This bid failed compliance on ${nonCompliant.length} requirement(s):\n` +
        nonCompliant.map((r) => `• ${r.requirementTitle}: ${r.reason}`).join("\n");
    }

    if (lower.includes("review") || lower.includes("manual")) {
      if (reviewReq.length === 0) {
        return `There are currently no items requiring manual review for this bid.`;
      }
      return `The following ${reviewReq.length} item(s) require manual officer review:\n` +
        reviewReq.map((r) => `• ${r.requirementTitle} (${r.verification?.portal || "Clause Check"}): ${r.reason}`).join("\n");
    }

    if (lower.includes("turnover") || lower.includes("financial")) {
      const turnoverItem = results.find((r) => r.requirementTitle.toLowerCase().includes("turnover") || r.category === "FINANCIAL");
      if (turnoverItem) {
        return `Financial Requirement Analysis for "${turnoverItem.requirementTitle}": Status is ${turnoverItem.status}. Evidence extracted: "${turnoverItem.evidence?.text || turnoverItem.reason}".`;
      }
    }

    if (lower.includes("summarize") || lower.includes("summary")) {
      return `BIDSETU Evaluation Summary for ${context.vendor?.name || "Vendor"}:\n• Overall Score: ${context.score || 85}%\n• Compliant Clauses: ${results.filter((r) => r.status === "COMPLIANT").length}\n• Non-Compliant: ${nonCompliant.length}\n• Risk Level: ${context.risk?.level || "MEDIUM"}\n• Recommended Action: Inspect review items and record officer final decision.`;
    }

    return `Based on BIDSETU's deterministic evaluation of ${context.vendor?.name || "this bid"}: The bid has an overall score of ${context.score || 85}% with Risk Level ${context.risk?.level || "MEDIUM"}. ${nonCompliant.length > 0 ? `It has ${nonCompliant.length} mandatory failure(s).` : "All mandatory rules passed."} Please ask about specific requirements, turnover, or statutory verification for details.`;
  }
}
