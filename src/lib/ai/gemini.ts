/**
 * BIDSETU — Centralized Gemini AI Explanation & Intelligence Service
 * 
 * IMPORTANT ARCHITECTURE RULES:
 * 1. Gemini is an EXPLANATION & SUMMARY layer ONLY.
 * 2. Gemini MUST NOT independently determine final procurement eligibility.
 * 3. The deterministic compliance engine and verified evidence are authoritative.
 * 4. Never expose GEMINI_API_KEY to frontend/client-side code.
 * 5. Automatic graceful fallback to DeterministicFallbackEngine on any API issue.
 */

import {
  BidEvaluationContext,
  StructuredAIResponse,
  DeterministicFallbackEngine,
} from "./fallback";

const SYSTEM_INSTRUCTION = `
You are BIDSETU's procurement intelligence explanation assistant.

Your role is to explain procurement verification results using only the structured evidence provided to you.

You must not invent facts, documents, verification results, government records, financial values, or compliance findings.

The deterministic compliance engine and verified evidence are authoritative.

Do not override deterministic rules.

If evidence is missing or contradictory, explicitly state that the item requires human review.

Never make the final qualification or disqualification decision.

Clearly distinguish:
- AI classification
- extracted evidence
- government/data verification
- deterministic rule result
- risk assessment
- human decision

When information is insufficient, say so.

Provide concise, professional explanations suitable for procurement officers.
Return strictly valid JSON matching the requested JSON schema without markdown block code fences.
`;

export interface GeminiChatResponse {
  answer: string;
  metadata: {
    provider: "gemini" | "bidsetu";
    model: string;
    mode: "live" | "fallback";
    generatedAt: string;
    fallbackUsed: boolean;
  };
}

export class GeminiService {
  private static cache = new Map<string, { data: any; expiresAt: number }>();
  private static CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

  /**
   * Helper to execute Gemini REST API with timeout, retry, and fallback
   */
  private static async callGeminiApi(prompt: string, timeoutMs = 15000): Promise<string | null> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key-here" || apiKey === "YOUR_NEW_ROTATED_KEY") {
      console.warn("[GeminiService] GEMINI_API_KEY not configured or placeholder used. Routing to fallback.");
      return null;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
        apiKey.trim()
      )}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            maxOutputTokens: 2048,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[GeminiService] Gemini API returned HTTP ${response.status}: ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return rawText || null;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        console.warn(`[GeminiService] Request timed out after ${timeoutMs}ms.`);
      } else {
        console.warn("[GeminiService] API call error:", err.message);
      }
      return null;
    }
  }

  /**
   * Parse structured JSON output from Gemini with 1 retry
   */
  private static parseJson<T>(rawText: string): T | null {
    try {
      const clean = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      return JSON.parse(clean);
    } catch (e) {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e2) {}
      }
      return null;
    }
  }

  /**
   * Cache key generator
   */
  private static getCacheKey(context: BidEvaluationContext, mode: string): string {
    const bidId = context.vendor?.name || "bid";
    const tenderId = context.tender?.tenderId || "tender";
    const score = context.score || 0;
    const count = (context.complianceResults || []).length;
    return `${mode}:${bidId}:${tenderId}:${score}:${count}`;
  }

  /**
   * 1. Generate Full Compliance Explanation & Assessment
   */
  static async generateComplianceExplanation(context: BidEvaluationContext): Promise<StructuredAIResponse> {
    const cacheKey = this.getCacheKey(context, "compliance");
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const prompt = `
Given the following structured procurement compliance evaluation data:
${JSON.stringify(context, null, 2)}

Provide a structured AI verification summary explaining the deterministic compliance findings.
Return ONLY valid JSON matching this exact structure:
{
  "summary": "Executive summary of the compliance results",
  "overallAssessment": "Assessment of compliance status and mandatory requirements",
  "keyFindings": [
    {
      "requirementId": "req-id",
      "status": "PASS" | "FAIL" | "REVIEW_REQUIRED",
      "explanation": "Natural language explanation grounded strictly in evidence",
      "evidenceReference": "Document and page reference",
      "needsHumanReview": boolean
    }
  ],
  "riskExplanation": "Explanation of identified risk factors",
  "reviewItems": [
    {
      "requirementId": "req-id",
      "reason": "Why officer review is required",
      "recommendedAction": "Recommended procurement action"
    }
  ],
  "officerRecommendation": "Recommendation for the procurement committee",
  "disclaimer": "Final procurement decision must be made by the authorized procurement officer."
}
`;

    const rawText = await this.callGeminiApi(prompt, 15000);

    if (rawText) {
      const parsed = this.parseJson<StructuredAIResponse>(rawText);
      if (parsed && parsed.summary && Array.isArray(parsed.keyFindings)) {
        const response: StructuredAIResponse = {
          ...parsed,
          disclaimer: "Final procurement decision must be made by the authorized procurement officer.",
          metadata: {
            provider: "gemini",
            model: "gemini-1.5-flash",
            mode: "live",
            generatedAt: new Date().toISOString(),
            fallbackUsed: false,
          },
        };
        this.cache.set(cacheKey, { data: response, expiresAt: Date.now() + this.CACHE_TTL_MS });
        return response;
      }
    }

    // Fallback if Gemini unavailable or JSON invalid
    const fallbackResponse = DeterministicFallbackEngine.generateFallbackComplianceExplanation(context);
    this.cache.set(cacheKey, { data: fallbackResponse, expiresAt: Date.now() + this.CACHE_TTL_MS });
    return fallbackResponse;
  }

  /**
   * 2. Generate Bid Summary
   */
  static async generateBidSummary(context: BidEvaluationContext): Promise<StructuredAIResponse> {
    return this.generateComplianceExplanation(context);
  }

  /**
   * 3. Generate Risk Explanation
   */
  static async generateRiskExplanation(context: BidEvaluationContext): Promise<{
    riskExplanation: string;
    riskLevel: string;
    factors: string[];
    metadata: StructuredAIResponse["metadata"];
  }> {
    const prompt = `
Explain the risk evaluation for the following procurement submission:
Vendor: ${context.vendor?.name || "Vendor"}
Risk Level: ${context.risk?.level || "MEDIUM"}
Risk Signals: ${JSON.stringify(context.risk?.factors || [])}
Compliance Results: ${JSON.stringify(context.complianceResults || [])}

Explain WHY this bid received a risk level of ${context.risk?.level || "MEDIUM"}.
Return JSON:
{
  "riskExplanation": "Clear, objective explanation of the risk assessment for procurement officers."
}
`;

    const rawText = await this.callGeminiApi(prompt, 10000);
    if (rawText) {
      const parsed = this.parseJson<{ riskExplanation: string }>(rawText);
      if (parsed?.riskExplanation) {
        return {
          riskExplanation: parsed.riskExplanation,
          riskLevel: context.risk?.level || "MEDIUM",
          factors: context.risk?.factors || [],
          metadata: {
            provider: "gemini",
            model: "gemini-1.5-flash",
            mode: "live",
            generatedAt: new Date().toISOString(),
            fallbackUsed: false,
          },
        };
      }
    }

    const fallback = DeterministicFallbackEngine.generateFallbackComplianceExplanation(context);
    return {
      riskExplanation: fallback.riskExplanation,
      riskLevel: context.risk?.level || "MEDIUM",
      factors: context.risk?.factors || [],
      metadata: fallback.metadata,
    };
  }

  /**
   * 4. Generate Single Requirement & Evidence Explanation
   */
  static async generateEvidenceExplanation(
    context: BidEvaluationContext,
    requirementId?: string
  ): Promise<{ explanation: string; metadata: StructuredAIResponse["metadata"] }> {
    const item = (context.complianceResults || []).find(
      (r) => r.requirementId === requirementId
    ) || context.complianceResults?.[0];

    if (!item) {
      return {
        explanation: "No evidence item specified for explanation.",
        metadata: {
          provider: "bidsetu",
          model: "deterministic-fallback",
          mode: "fallback",
          generatedAt: new Date().toISOString(),
          fallbackUsed: true,
        },
      };
    }

    const prompt = `
Explain the relationship between the requirement and the submitted evidence for a procurement officer:
Requirement: "${item.requirementTitle}" (${item.category})
Status: ${item.status}
Extracted Document Text: "${item.evidence?.text || item.reason}"
Document Reference: "${item.evidence?.document || "Submitted PDF"}" Page ${item.evidence?.page || 1}
Statutory Portal Verification: "${item.verification?.portal || "N/A"}: ${item.verification?.status || "N/A"}"

Explain clearly how this evidence supports, fails, or necessitates manual review for this requirement.
Return JSON: { "explanation": "string" }
`;

    const rawText = await this.callGeminiApi(prompt, 10000);
    if (rawText) {
      const parsed = this.parseJson<{ explanation: string }>(rawText);
      if (parsed?.explanation) {
        return {
          explanation: parsed.explanation,
          metadata: {
            provider: "gemini",
            model: "gemini-1.5-flash",
            mode: "live",
            generatedAt: new Date().toISOString(),
            fallbackUsed: false,
          },
        };
      }
    }

    return {
      explanation: DeterministicFallbackEngine.generateFallbackEvidenceExplanation(
        item.requirementTitle,
        item.status,
        item.evidence?.text,
        item.verification?.status
      ),
      metadata: {
        provider: "bidsetu",
        model: "deterministic-fallback",
        mode: "fallback",
        generatedAt: new Date().toISOString(),
        fallbackUsed: true,
      },
    };
  }

  /**
   * 5. Generate Executive AI Report
   */
  static async generateExecutiveReport(context: BidEvaluationContext): Promise<{
    reportText: string;
    metadata: StructuredAIResponse["metadata"];
  }> {
    const prompt = `
Generate a formal Executive AI Verification Report for the Procurement Committee for the following submission:
${JSON.stringify(context, null, 2)}

Format as clean markdown suitable for printing or PDF export:
# BIDSETU EXECUTIVE AI VERIFICATION REPORT
## 1. Executive Summary
## 2. Mandatory Eligibility & Technical Analysis
## 3. Statutory & Government Portal Verification
## 4. Risk Signals & Governance Review
## 5. Procurement Officer Action & Recommendations

Add formal disclaimer at the end. Return JSON: { "reportText": "markdown text" }
`;

    const rawText = await this.callGeminiApi(prompt, 20000);
    if (rawText) {
      const parsed = this.parseJson<{ reportText: string }>(rawText);
      if (parsed?.reportText) {
        return {
          reportText: parsed.reportText,
          metadata: {
            provider: "gemini",
            model: "gemini-1.5-flash",
            mode: "live",
            generatedAt: new Date().toISOString(),
            fallbackUsed: false,
          },
        };
      }
    }

    return {
      reportText: DeterministicFallbackEngine.generateFallbackExecutiveReport(context),
      metadata: {
        provider: "bidsetu",
        model: "deterministic-fallback",
        mode: "fallback",
        generatedAt: new Date().toISOString(),
        fallbackUsed: true,
      },
    };
  }

  /**
   * 6. Interactive Officer Assistant Q&A
   */
  static async chatWithOfficerAssistant(
    context: BidEvaluationContext,
    userMessage: string,
    history: Array<{ role: string; content: string }> = []
  ): Promise<GeminiChatResponse> {
    const prompt = `
CONTEXT GROUNDING DATA (Authoritative Ground-Truth Bid Record):
${JSON.stringify(context, null, 2)}

OFFICER QUESTION: "${userMessage}"

Answer the officer's question using ONLY the provided bid evaluation context above.
If the question asks about data not present in the context, state that it is not available in the evaluation record.
Never override deterministic rules or make final qualification decisions.
Return JSON: { "answer": "Clear, concise response for the procurement officer." }
`;

    const rawText = await this.callGeminiApi(prompt, 12000);
    if (rawText) {
      const parsed = this.parseJson<{ answer: string }>(rawText);
      if (parsed?.answer) {
        return {
          answer: parsed.answer,
          metadata: {
            provider: "gemini",
            model: "gemini-1.5-flash",
            mode: "live",
            generatedAt: new Date().toISOString(),
            fallbackUsed: false,
          },
        };
      }
    }

    return {
      answer: DeterministicFallbackEngine.generateFallbackChatResponse(context, userMessage),
      metadata: {
        provider: "bidsetu",
        model: "deterministic-fallback",
        mode: "fallback",
        generatedAt: new Date().toISOString(),
        fallbackUsed: true,
      },
    };
  }
}
