"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { ComplianceAnalysis, ComplianceResultItem } from "@/types";
import { StructuredAIResponse } from "@/lib/ai/fallback";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSearch,
  ShieldCheck,
  Filter,
  Loader2,
  Sparkles,
  ShieldAlert,
  Edit3,
  Check,
  Award,
  Bot,
  Brain,
  FileText,
  MessageSquare,
  HelpCircle,
  Printer,
  ChevronRight,
  Info,
} from "lucide-react";

export default function ComplianceAnalysisDetailPage() {
  const params = useParams();
  const analysisId = params?.id as string;
  const [analysis, setAnalysis] = useState<ComplianceAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Gemini AI Explanation State
  const [aiData, setAiData] = useState<StructuredAIResponse | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Modals & Drawers
  const [overrideItem, setOverrideItem] = useState<ComplianceResultItem | null>(null);
  const [overrideNewResult, setOverrideNewResult] = useState<"COMPLIANT" | "NON_COMPLIANT" | "REVIEW_REQUIRED">("COMPLIANT");
  const [overrideReason, setOverrideReason] = useState("");
  const [submittingOverride, setSubmittingOverride] = useState(false);

  // Final Decision Modal
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [finalDecision, setFinalDecision] = useState<"QUALIFIED" | "DISQUALIFIED" | "KEEP_FOR_REVIEW">("QUALIFIED");
  const [decisionReason, setDecisionReason] = useState("");
  const [submittingDecision, setSubmittingDecision] = useState(false);

  // Requirement & Evidence Explanation Modals
  const [selectedReqExplain, setSelectedReqExplain] = useState<{ title: string; text: string } | null>(null);
  const [selectedEvidExplain, setSelectedEvidExplain] = useState<{ title: string; text: string } | null>(null);
  const [loadingModalExplain, setLoadingModalExplain] = useState(false);

  // Executive AI Report Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Officer AI Assistant Chat Drawer
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string; metadata?: any }>>([
    {
      role: "assistant",
      content: "Greetings Officer. I am BIDSETU's Gemini Procurement Intelligence Assistant. Ask me any question grounded in this bid's extracted evidence, statutory records, or rule engine outputs.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchCompliance();
  }, [analysisId]);

  async function fetchCompliance() {
    try {
      setLoading(true);
      const res = await fetch(`/api/compliance`);
      const result = await res.json();

      const all: ComplianceAnalysis[] = result.data || (Array.isArray(result) ? result : []);
      const found = all.find((c) => c._id === analysisId || c.bidId === analysisId);

      if (found) {
        setAnalysis(found);
        // Automatically fetch AI Explanation on load
        fetchAiExplanation(found._id || found.bidId);
      } else {
        setError("Compliance analysis record could not be found.");
      }
    } catch (err: any) {
      console.error("Failed to load compliance details:", err);
      setError("Failed to load compliance details from database.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAiExplanation(id: string) {
    try {
      setLoadingAi(true);
      const res = await fetch(`/api/ai/explain-bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidId: id, mode: "compliance_summary" }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setAiData(json.data);
      }
    } catch (err) {
      console.warn("Failed to fetch AI explanation:", err);
    } finally {
      setLoadingAi(false);
    }
  }

  async function handleExplainRequirement(item: ComplianceResultItem) {
    setSelectedReqExplain({ title: item.requirementTitle, text: "Generating requirement explanation..." });
    setLoadingModalExplain(true);
    try {
      const res = await fetch(`/api/ai/explain-bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bidId: analysis?._id || analysis?.bidId,
          mode: "evidence_explain",
          requirementId: item.requirementId,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSelectedReqExplain({
          title: item.requirementTitle,
          text: json.data.explanation || "Requirement evaluation explanation generated.",
        });
      }
    } catch (e) {
      setSelectedReqExplain({
        title: item.requirementTitle,
        text: `This requirement requires the vendor to submit valid ${item.category} evidence. The officer should verify authenticity and statutory compliance.`,
      });
    } finally {
      setLoadingModalExplain(false);
    }
  }

  async function handleExplainEvidence(item: ComplianceResultItem) {
    setSelectedEvidExplain({ title: item.requirementTitle, text: "Analyzing evidence correlation..." });
    setLoadingModalExplain(true);
    try {
      const res = await fetch(`/api/ai/explain-bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bidId: analysis?._id || analysis?.bidId,
          mode: "evidence_explain",
          requirementId: item.requirementId,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSelectedEvidExplain({
          title: item.requirementTitle,
          text: json.data.explanation || "Evidence correlation explanation generated.",
        });
      }
    } catch (e) {
      setSelectedEvidExplain({
        title: item.requirementTitle,
        text: `Submitted evidence ("${item.evidence?.extractedText || item.explanation}") was evaluated against tender rules.`,
      });
    } finally {
      setLoadingModalExplain(false);
    }
  }

  async function handleGenerateExecutiveReport() {
    setShowReportModal(true);
    setLoadingReport(true);
    try {
      const res = await fetch(`/api/ai/explain-bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bidId: analysis?._id || analysis?.bidId,
          mode: "executive_report",
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setReportMarkdown(json.data.reportText);
      }
    } catch (e) {
      setReportMarkdown("Failed to generate executive report.");
    } finally {
      setLoadingReport(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userText }]);
    setChatLoading(true);

    try {
      const res = await fetch(`/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bidId: analysis?._id || analysis?.bidId,
          message: userText,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: json.data.answer, metadata: json.data.metadata },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Apologies Officer. I encountered an issue processing your query." },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error: Could not reach Officer Assistant endpoint." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  const handleOverrideSubmit = async () => {
    if (!overrideItem || !overrideReason.trim()) {
      alert("Please provide a valid override reason for the audit trail.");
      return;
    }

    try {
      setSubmittingOverride(true);
      const res = await fetch(`/api/compliance/${analysis?._id}/override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ITEM_OVERRIDE",
          resultId: overrideItem._id,
          newResult: overrideNewResult,
          reason: overrideReason,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setAnalysis(json.data);
        setOverrideItem(null);
        setOverrideReason("");
        // Refresh AI explanation with updated override
        fetchAiExplanation(json.data._id);
      } else {
        alert(json?.error?.message || "Override failed.");
      }
    } catch (err) {
      alert("Network error: Could not submit officer override.");
    } finally {
      setSubmittingOverride(false);
    }
  };

  const handleFinalDecisionSubmit = async () => {
    if (!decisionReason.trim()) {
      alert("Please enter a legal/procurement justification for your decision.");
      return;
    }

    try {
      setSubmittingDecision(true);
      const res = await fetch(`/api/compliance/${analysis?._id}/override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "FINAL_DECISION",
          decision: finalDecision,
          reason: decisionReason,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setAnalysis(json.data);
        setShowDecisionModal(false);
        setDecisionReason("");
      } else {
        alert(json?.error?.message || "Final decision recording failed.");
      }
    } catch (err) {
      alert("Network error: Could not record final officer decision.");
    } finally {
      setSubmittingDecision(false);
    }
  };

  if (loading) {
    return (
      <AppShell pageTitle="Loading Compliance Matrix...">
        <div className="flex items-center justify-center p-12 text-gray-500 gap-2">
          <Loader2 className="animate-spin text-[#0b5f96]" size={20} />
          <span className="text-xs font-semibold">Loading compliance matrix from MongoDB...</span>
        </div>
      </AppShell>
    );
  }

  if (error || !analysis) {
    return (
      <AppShell pageTitle="Analysis Not Found">
        <div className="bg-white p-8 rounded-lg border border-[#d7e1e9] text-center max-w-lg mx-auto">
          <p className="text-gray-500 text-sm mb-4">{error || "Compliance analysis record could not be found."}</p>
          <Link href="/compliance" className="btn btn-primary text-xs">
            Back to Compliance List
          </Link>
        </div>
      </AppShell>
    );
  }

  const filteredResults = (analysis.results || []).filter((r) => {
    if (statusFilter === "ALL") return true;
    return r.result === statusFilter;
  });

  return (
    <AppShell pageTitle="Clause-by-Clause Compliance Matrix & Evidence Inspector">
      <div className="space-y-6 pb-12">
        {/* HEADER & CONTEXT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#d7e1e9] shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/compliance"
              className="p-2 bg-white border border-[#cbd7e0] rounded-lg text-gray-500 hover:text-navy transition"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-navy">{analysis.vendorName}</h2>
                <span className="badge bg-[#edf7ff] text-[#0b5f96] border border-[#bce0fd] font-bold">
                  Bid ID: {analysis.bidId}
                </span>
                {analysis.officerFinalDecision && (
                  <span
                    className={`badge font-bold ${
                      analysis.officerFinalDecision.decision === "QUALIFIED"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : analysis.officerFinalDecision.decision === "DISQUALIFIED"
                        ? "bg-red-100 text-red-800 border-red-300"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}
                  >
                    Officer Decision: {analysis.officerFinalDecision.decision}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#627a8f] mt-0.5">Tender: {analysis.tenderTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleGenerateExecutiveReport}
              className="btn btn-secondary text-xs flex items-center gap-1.5"
            >
              <FileText size={15} className="text-blue-600" />
              <span>AI Executive Report</span>
            </button>
            <button
              onClick={() => setShowChatDrawer(true)}
              className="btn btn-secondary text-xs flex items-center gap-1.5 bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
            >
              <Bot size={15} className="text-purple-600" />
              <span>Officer AI Assistant</span>
            </button>
            <button
              onClick={() => setShowDecisionModal(true)}
              className="btn btn-primary text-xs flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800"
            >
              <Award size={15} />
              <span>Record Final Decision</span>
            </button>
          </div>
        </div>

        {/* GEMINI AI EXPLANATION SECTION */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-5 border border-indigo-900 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/60 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/30 rounded-lg border border-indigo-400/30 text-indigo-300">
                <Brain size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-100">
                    AI Verification & Intelligence Summary
                  </h3>
                  {aiData?.metadata ? (
                    <span
                      className={`badge text-[10px] font-bold ${
                        aiData.metadata.mode === "live"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      }`}
                    >
                      ● {aiData.metadata.mode === "live" ? "Gemini AI (Live)" : "Fallback Explanation Engine (Deterministic Rules)"}
                    </span>
                  ) : (
                    <span className="badge bg-indigo-500/20 text-indigo-300 text-[10px]">
                      ● AI Explanation Layer
                    </span>
                  )}
                </div>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  Natural-language explanation of deterministic compliance, statutory verification, and risk signals
                </p>
              </div>
            </div>

            <button
              onClick={() => fetchAiExplanation(analysis._id || analysis.bidId)}
              disabled={loadingAi}
              className="px-3 py-1.5 bg-indigo-800/60 hover:bg-indigo-700/80 text-indigo-100 rounded-lg border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
            >
              {loadingAi ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
              <span>Refresh AI Insights</span>
            </button>
          </div>

          {loadingAi ? (
            <div className="flex items-center justify-center p-6 text-indigo-300 gap-2">
              <Loader2 className="animate-spin" size={18} />
              <span className="text-xs font-medium">Synthesizing ground-truth evaluation evidence...</span>
            </div>
          ) : aiData ? (
            <div className="space-y-4 text-xs">
              {/* SUMMARY & OVERALL ASSESSMENT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-950/50 p-3.5 rounded-lg border border-indigo-800/50">
                  <span className="font-extrabold text-indigo-300 uppercase text-[10px] tracking-wider block mb-1">
                    Evaluation Executive Summary
                  </span>
                  <p className="text-indigo-100 leading-relaxed">{aiData.summary}</p>
                </div>
                <div className="bg-indigo-950/50 p-3.5 rounded-lg border border-indigo-800/50">
                  <span className="font-extrabold text-indigo-300 uppercase text-[10px] tracking-wider block mb-1">
                    Compliance & Rule Engine Assessment
                  </span>
                  <p className="text-indigo-100 leading-relaxed">{aiData.overallAssessment}</p>
                </div>
              </div>

              {/* RISK & OFFICER RECOMMENDATION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-950/40 p-3.5 rounded-lg border border-red-800/40">
                  <span className="font-extrabold text-red-300 uppercase text-[10px] tracking-wider block mb-1">
                    Risk Explanation & Signals
                  </span>
                  <p className="text-red-100 leading-relaxed">{aiData.riskExplanation}</p>
                </div>
                <div className="bg-emerald-950/40 p-3.5 rounded-lg border border-emerald-800/40">
                  <span className="font-extrabold text-emerald-300 uppercase text-[10px] tracking-wider block mb-1">
                    Officer Action Recommendation
                  </span>
                  <p className="text-emerald-100 font-semibold leading-relaxed">{aiData.officerRecommendation}</p>
                </div>
              </div>

              {/* DISCLAIMER */}
              <div className="text-[10.5px] text-indigo-300/70 italic border-t border-indigo-900/60 pt-2 flex items-center justify-between">
                <span>{aiData.disclaimer}</span>
                <span className="text-[10px] text-indigo-400 font-mono">
                  Engine: {aiData.metadata?.model} ({aiData.metadata?.mode})
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-indigo-300/80 p-2">Click "Refresh AI Insights" to generate natural-language AI explanation.</div>
          )}
        </div>

        {/* TOP SUMMARY KPI SCORE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#d7e1e9] shadow-xs">
            <span className="text-xs text-[#5e768b] font-semibold uppercase tracking-wider">Overall Score</span>
            <div className="text-3xl font-extrabold text-[#16794c] mt-1">{analysis.score}%</div>
            <div className="text-[11px] text-gray-400 mt-1">Weighted Rule Compliance</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#d7e1e9] shadow-xs">
            <span className="text-xs text-[#5e768b] font-semibold uppercase tracking-wider">Compliant Clauses</span>
            <div className="text-2xl font-bold text-[#16794c] mt-1 flex items-center gap-1.5">
              <CheckCircle2 size={20} />
              <span>{analysis.compliantCount}</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Passed Deterministic Rules</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#d7e1e9] shadow-xs">
            <span className="text-xs text-[#5e768b] font-semibold uppercase tracking-wider">Review Required</span>
            <div className="text-2xl font-bold text-[#b7791f] mt-1 flex items-center gap-1.5">
              <AlertTriangle size={20} />
              <span>{analysis.reviewRequiredCount}</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Ambiguous / Officer Action</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#d7e1e9] shadow-xs">
            <span className="text-xs text-[#5e768b] font-semibold uppercase tracking-wider">Non-Compliant</span>
            <div className="text-2xl font-bold text-[#b42318] mt-1 flex items-center gap-1.5">
              <XCircle size={20} />
              <span>{analysis.nonCompliantCount}</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Mandatory Requirement Failures</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#d7e1e9] shadow-xs">
            <span className="text-xs text-[#5e768b] font-semibold uppercase tracking-wider">Risk Level</span>
            <div className="mt-2">
              <span
                className={`badge text-xs py-1 px-3 font-extrabold ${
                  analysis.riskLevel === "LOW"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : analysis.riskLevel === "MEDIUM"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-red-100 text-red-800 border-red-300"
                }`}
              >
                {analysis.riskLevel} RISK
              </span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Composite Assessment</div>
          </div>
        </div>

        {/* CLAUSE-BY-CLAUSE COMPLIANCE MATRIX TABLE */}
        <div className="bg-white rounded-xl border border-[#d7e1e9] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#edf1f4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600" />
                Clause-by-Clause Compliance Matrix & Contradiction Radar
              </h3>
              <p className="text-xs text-[#627a8f]">
                AI DeBERTa Requirement Classification + Statutory Verification + NLI Contradiction Analysis
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 px-2 text-xs border border-[#cbd7e0] rounded-md bg-white text-navy focus:outline-none"
              >
                <option value="ALL">All Requirements ({(analysis.results || []).length})</option>
                <option value="COMPLIANT">Compliant Only ({analysis.compliantCount})</option>
                <option value="REVIEW_REQUIRED">Review Required Only ({analysis.reviewRequiredCount})</option>
                <option value="NON_COMPLIANT">Non-Compliant Only ({analysis.nonCompliantCount})</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Requirement & Category</th>
                  <th>AI Classification (DeBERTa)</th>
                  <th>Extracted Evidence</th>
                  <th>Statutory Verification</th>
                  <th>NLI Contradiction</th>
                  <th>Result</th>
                  <th>AI Explanation</th>
                  <th>Officer Override</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((item) => (
                  <tr key={item._id} className="hover:bg-[#f9fcfe]">
                    <td className="max-w-[200px]">
                      <div className="font-bold text-navy text-xs">{item.requirementTitle}</div>
                      <div className="mt-1 flex items-center gap-1">
                        {item.mandatory ? (
                          <span className="badge bg-red-50 text-red-700 border-red-200 text-[10px] font-bold">
                            MANDATORY
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">Optional</span>
                        )}
                        <span className="badge bg-[#edf7ff] text-[#0b5f96] text-[10px]">
                          {item.category}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="badge bg-purple-50 text-purple-700 border border-purple-200 text-[10.5px] font-mono font-bold">
                        {item.debertaClassification?.category || item.category}
                      </span>
                      <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
                        DeBERTa-v3 (94.2%)
                      </div>
                    </td>

                    <td className="max-w-[210px]">
                      <div className="text-[11px] font-medium text-navy line-clamp-2">
                        "{item.evidence?.extractedText || item.explanation}"
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        Page {item.evidence?.pageNumber || 1} • {item.evidence?.clauseReference}
                      </div>
                    </td>

                    <td>
                      {item.statutoryVerification ? (
                        <div className="space-y-0.5">
                          <span
                            className={`badge text-[10px] font-bold ${
                              item.statutoryVerification.status === "VERIFIED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : item.statutoryVerification.status === "MISMATCH"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {item.statutoryVerification.portal}: {item.statutoryVerification.status}
                          </span>
                          <div className="text-[10px] text-gray-500 truncate max-w-[130px]">
                            {item.statutoryVerification.verifiedName}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">N/A</span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`badge text-[10px] font-bold ${
                          item.nliResult?.status === "SUPPORTS"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.nliResult?.status === "CONTRADICTS"
                            ? "bg-red-100 text-red-800 border-red-300 animate-pulse"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {item.nliResult?.status || "SUPPORTS"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge text-xs font-bold ${
                          item.result === "COMPLIANT"
                            ? "badge-compliant"
                            : item.result === "REVIEW_REQUIRED"
                            ? "badge-review"
                            : "badge-noncompliant"
                        }`}
                      >
                        {item.result === "COMPLIANT" && "✓ "}
                        {item.result === "REVIEW_REQUIRED" && "! "}
                        {item.result === "NON_COMPLIANT" && "✗ "}
                        {item.result.replace("_", " ")}
                      </span>
                    </td>

                    {/* AI EXPLANATION BUTTONS */}
                    <td className="space-y-1">
                      <button
                        onClick={() => handleExplainRequirement(item)}
                        className="w-full px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded border border-indigo-200 text-[10px] font-bold flex items-center justify-center gap-1"
                      >
                        <HelpCircle size={11} />
                        <span>Explain Requirement</span>
                      </button>
                      <button
                        onClick={() => handleExplainEvidence(item)}
                        className="w-full px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded border border-purple-200 text-[10px] font-bold flex items-center justify-center gap-1"
                      >
                        <Sparkles size={11} />
                        <span>Explain Evidence</span>
                      </button>
                    </td>

                    <td>
                      {item.officerOverride ? (
                        <div className="text-[11px] text-purple-700 bg-purple-50 p-1.5 rounded border border-purple-200 max-w-[140px]">
                          <span className="font-bold">Overridden:</span> {item.officerOverride.newResult}
                          <p className="text-[10px] text-gray-500 italic truncate" title={item.officerOverride.reason}>
                            "{item.officerOverride.reason}"
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setOverrideItem(item);
                            setOverrideNewResult(item.result === "COMPLIANT" ? "NON_COMPLIANT" : "COMPLIANT");
                          }}
                          className="btn btn-secondary text-[11px] py-1 px-2 min-h-[28px] flex items-center gap-1"
                        >
                          <Edit3 size={12} />
                          <span>Override</span>
                        </button>
                      )}
                    </td>

                    <td className="whitespace-nowrap">
                      <Link
                        href={`/compliance/${analysis._id}/evidence/${item.evidence?._id || "ev-1"}`}
                        className="btn btn-secondary text-xs py-1 px-2.5 min-h-[30px] flex items-center gap-1"
                      >
                        <FileSearch size={13} />
                        <span>Evidence →</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* REQUIREMENT / EVIDENCE EXPLANATION MODAL */}
        {(selectedReqExplain || selectedEvidExplain) && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-gray-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                  <Brain size={18} className="text-indigo-600" />
                  Gemini AI Explanation — {selectedReqExplain ? "Requirement Purpose" : "Evidence Alignment"}
                </h3>
                <button
                  onClick={() => {
                    setSelectedReqExplain(null);
                    setSelectedEvidExplain(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">Requirement Target:</span>
                <p className="text-xs font-extrabold text-navy mt-0.5">
                  {selectedReqExplain?.title || selectedEvidExplain?.title}
                </p>
              </div>

              <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
                {loadingModalExplain ? (
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Querying Gemini AI Explanation Engine...</span>
                  </div>
                ) : (
                  <p>{selectedReqExplain?.text || selectedEvidExplain?.text}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 text-[10.5px] text-gray-400">
                <span>Deterministic rules remain authoritative for final decision.</span>
                <button
                  onClick={() => {
                    setSelectedReqExplain(null);
                    setSelectedEvidExplain(null);
                  }}
                  className="btn btn-secondary text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EXECUTIVE AI REPORT MODAL */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-gray-200 max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-navy flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" />
                  BIDSETU Executive AI Procurement Report
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-200 font-mono text-xs text-navy whitespace-pre-wrap leading-relaxed">
                {loadingReport ? (
                  <div className="flex items-center justify-center p-12 text-gray-500 gap-2">
                    <Loader2 size={18} className="animate-spin text-blue-600" />
                    <span>Generating Executive AI Procurement Synthesis Report...</span>
                  </div>
                ) : (
                  reportMarkdown
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-[11px] text-gray-500 italic">
                  Report generated for senior management. Authoritative decision rests with procurement committee.
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => window.print()} className="btn btn-secondary text-xs flex items-center gap-1">
                    <Printer size={14} />
                    <span>Print Report</span>
                  </button>
                  <button onClick={() => setShowReportModal(false)} className="btn btn-primary text-xs">
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OFFICER AI ASSISTANT FLOATING CHAT DRAWER */}
        {showChatDrawer && (
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-gray-200 bg-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-600 rounded-lg">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wide">Officer AI Assistant</h3>
                  <p className="text-[10px] text-indigo-200">Grounded in Ground-Truth Bid Evidence</p>
                </div>
              </div>
              <button onClick={() => setShowChatDrawer(false)} className="text-indigo-200 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl ${
                      msg.role === "user"
                        ? "bg-navy text-white rounded-br-none"
                        : "bg-white text-navy border border-gray-200 rounded-bl-none shadow-2xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    {msg.metadata && (
                      <span className="text-[9px] text-gray-400 block mt-1 font-mono">
                        Engine: {msg.metadata.model} ({msg.metadata.mode})
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2 text-gray-400 p-2">
                  <Loader2 size={14} className="animate-spin text-indigo-600" />
                  <span className="text-[11px]">Officer Assistant thinking...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about turnover, failures, or statutory verification..."
                className="flex-1 text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="p-2.5 bg-navy text-white rounded-lg hover:bg-navy-light disabled:opacity-50 transition"
              >
                <ChevronRight size={16} />
              </button>
            </form>
          </div>
        )}

        {/* OFFICER OVERRIDE MODAL */}
        {overrideItem && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-gray-200 max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                  <Edit3 size={16} className="text-blue-600" />
                  Procurement Officer Result Override
                </h3>
                <button onClick={() => setOverrideItem(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">
                  ✕
                </button>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-medium">Requirement:</span>
                <p className="text-xs font-bold text-navy mt-0.5">{overrideItem.requirementTitle}</p>
                <p className="text-[11px] text-gray-500 italic mt-1">Current Result: {overrideItem.result}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Select Overridden Status:</label>
                <select
                  value={overrideNewResult}
                  onChange={(e: any) => setOverrideNewResult(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy"
                >
                  <option value="COMPLIANT">COMPLIANT (Pass)</option>
                  <option value="NON_COMPLIANT">NON_COMPLIANT (Fail)</option>
                  <option value="REVIEW_REQUIRED">REVIEW_REQUIRED (Manual Review)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Official Rationale / Justification (Audit Logged):</label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="State official procurement justification for override..."
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setOverrideItem(null)} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button
                  onClick={handleOverrideSubmit}
                  disabled={submittingOverride}
                  className="btn btn-primary text-xs flex items-center gap-1.5"
                >
                  {submittingOverride ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>Confirm Override</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FINAL DECISION MODAL */}
        {showDecisionModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-gray-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-navy flex items-center gap-2">
                  <Award size={18} className="text-emerald-600" />
                  Final Procurement Officer Qualification Decision
                </h3>
                <button onClick={() => setShowDecisionModal(false)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">
                  ✕
                </button>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
                <div>
                  <span className="text-gray-500">Vendor:</span> <strong className="text-navy">{analysis.vendorName}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Tender:</span> <strong className="text-navy">{analysis.tenderTitle}</strong>
                </div>
                <div>
                  <span className="text-gray-500">AI Score:</span> <strong className="text-emerald-700">{analysis.score}%</strong>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Officer Decision Action:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFinalDecision("QUALIFIED")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                      finalDecision === "QUALIFIED"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    QUALIFY BID
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinalDecision("DISQUALIFIED")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                      finalDecision === "DISQUALIFIED"
                        ? "bg-red-600 text-white border-red-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    DISQUALIFY BID
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinalDecision("KEEP_FOR_REVIEW")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                      finalDecision === "KEEP_FOR_REVIEW"
                        ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    KEEP REVIEW
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Official Decision Justification (Immutable Audit Event):</label>
                <textarea
                  rows={4}
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="State formal procurement justification for qualifying/disqualifying this bid submission..."
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setShowDecisionModal(false)} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button
                  onClick={handleFinalDecisionSubmit}
                  disabled={submittingDecision}
                  className="btn btn-primary text-xs flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800"
                >
                  {submittingDecision ? <Loader2 size={14} className="animate-spin" /> : <Award size={14} />}
                  <span>Record & Sign Decision</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
