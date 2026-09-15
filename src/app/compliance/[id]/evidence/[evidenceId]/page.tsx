"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { repository } from "@/lib/db/repository";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  HelpCircle,
} from "lucide-react";

export default function EvidenceViewerPage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params?.id as string;
  const evidenceId = params?.evidenceId as string;

  const analysis = repository.getComplianceAnalysisById(analysisId);
  const resultItem = analysis?.results.find((r) => r.evidence._id === evidenceId) || analysis?.results[0];
  const evidence = resultItem?.evidence;

  const [officerDecision, setOfficerDecision] = useState<string | null>(null);

  if (!analysis || !resultItem || !evidence) {
    return (
      <AppShell pageTitle="Evidence Record Not Found">
        <div className="bg-white p-8 rounded-lg border border-[#d7e1e9] text-center">
          <p className="text-gray-500 text-sm mb-4">The requested evidence record could not be found.</p>
          <Link href={`/compliance/${analysisId}`} className="btn btn-primary text-xs">
            Back to Analysis
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell pageTitle={`Evidence Viewer — Page ${evidence.pageNumber}`}>
      <div className="space-y-4 max-w-6xl mx-auto">
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-[#d7e1e9] shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href={`/compliance/${analysis._id}`}
              className="p-1.5 bg-white border border-[#cbd7e0] rounded-md text-gray-500 hover:text-navy"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="text-xs text-[#627a8f]">
                {analysis.vendorName} • {evidence.documentName}
              </div>
              <h2 className="text-sm font-bold text-navy">{resultItem.requirementTitle}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`badge ${
                resultItem.result === "COMPLIANT"
                  ? "badge-compliant"
                  : resultItem.result === "REVIEW_REQUIRED"
                  ? "badge-review"
                  : "badge-noncompliant"
              }`}
            >
              {resultItem.result.replace("_", " ")}
            </span>
            <span className="text-xs font-mono font-bold text-[#16794c] bg-[#e6f6ee] px-2 py-1 rounded">
              Confidence: {(resultItem.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* SPLIT VIEW (ORIGINAL DOCUMENT + AI ANALYSIS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          {/* LEFT PANE: ORIGINAL DOCUMENT VIEWER WITH CLAUSE HIGHLIGHT (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-[#d7e1e9] shadow-xs flex flex-col overflow-hidden">
            {/* DOCUMENT VIEWER TOOLBAR */}
            <div className="p-3 bg-[#f8fafc] border-b border-[#edf1f4] flex items-center justify-between text-xs text-[#4b6377]">
              <div className="flex items-center gap-2">
                <FileText size={15} />
                <span className="font-semibold text-navy truncate max-w-[240px]">
                  {evidence.documentName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <ChevronLeft size={14} />
                  </button>
                  <span className="font-mono text-xs">
                    Page {evidence.pageNumber} of 142
                  </span>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <ChevronRight size={14} />
                  </button>
                </div>
                <div className="h-4 w-[1px] bg-gray-300"></div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <ZoomIn size={14} />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <ZoomOut size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* DOCUMENT PAGE SIMULATION */}
            <div className="flex-1 p-8 bg-[#eaedf0] overflow-y-auto flex justify-center">
              <div className="w-full max-w-[560px] min-h-[580px] bg-white shadow-md p-8 border border-gray-300 rounded-xs font-serif text-xs text-gray-800 leading-relaxed relative">
                {/* DOCUMENT WATERMARK / HEADER */}
                <div className="border-b border-gray-200 pb-2 mb-4 text-[10px] text-gray-400 font-sans flex justify-between">
                  <span>CONFIDENTIAL — PROPRIETARY TENDER SUBMISSION</span>
                  <span>SECTION 4 — TECHNICAL COMPLIANCE</span>
                </div>

                <p className="mb-3 text-justify text-[11px] text-gray-500">
                  The equipment proposed herein is engineered in accordance with mandatory specifications
                  stipulated in the tender invitation documents, conforming to Bureau of Indian Standards
                  regulations and international electrotechnical safety directives.
                </p>

                <h4 className="font-bold font-sans text-xs text-navy mt-4 mb-2">
                  {evidence.clauseReference}
                </h4>

                {/* HIGHLIGHTED CLAUSE BOUNDING BOX */}
                <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded relative shadow-xs my-3">
                  <div className="absolute -top-2.5 right-2 bg-amber-400 text-navy font-sans font-bold text-[9px] px-1.5 py-0.5 rounded">
                    AI EXTRACTED CLAUSE (98% MATCH)
                  </div>
                  <p className="font-mono text-[11px] font-medium text-amber-950 leading-normal">
                    “{evidence.extractedText}”
                  </p>
                </div>

                <p className="mt-3 text-justify text-[11px] text-gray-500">
                  Furthermore, all factory acceptance testing procedures, raw material origin verifications,
                  and sub-assembly warranties are documented under Appendix G, affirming long-term reliability
                  metrics as verified by the certifying agency.
                </p>

                {/* SIGNATURE STAMP */}
                <div className="mt-12 pt-4 border-t border-gray-200 flex justify-between items-end font-sans text-[10px] text-gray-400">
                  <div>
                    <div>Digitally Signed by Authorized Signatory</div>
                    <div className="font-mono text-[9px] text-green-700 font-semibold">
                      [Valid PKI Signature Verified]
                    </div>
                  </div>
                  <div className="text-right">Page {evidence.pageNumber}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: AI REASONING & HUMAN-IN-THE-LOOP VERIFICATION (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#708aa0]">
                  Target Requirement
                </span>
                <h3 className="text-sm font-bold text-navy mt-0.5">
                  {resultItem.requirementTitle}
                </h3>
                <span className="badge bg-[#edf7ff] text-[#0b5f96] text-[10px] mt-1">
                  Category: {resultItem.category}
                </span>
              </div>

              <div className="p-3 bg-[#f8fafc] rounded border border-[#edf2f7]">
                <span className="text-[10.5px] font-bold text-[#55718a] uppercase block mb-1">
                  Extracted Evidence Text
                </span>
                <p className="text-xs text-navy font-mono bg-white p-2.5 rounded border border-gray-200">
                  {evidence.extractedText}
                </p>
              </div>

              <div>
                <span className="text-[10.5px] font-bold text-[#55718a] uppercase block mb-1">
                  AI Semantic Reasoning & Audit Rationale
                </span>
                <p className="text-xs text-[#425d75] leading-relaxed bg-[#f0f6fa] p-3 rounded border border-[#dce7f0]">
                  {resultItem.explanation}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">CLAUSE REFERENCE</span>
                  <span className="font-semibold text-navy text-[11.5px] truncate block">
                    {evidence.clauseReference}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">CONFIDENCE SCORE</span>
                  <span className="font-semibold text-[#16794c] text-[11.5px]">
                    {(resultItem.confidence * 100).toFixed(1)}% Match
                  </span>
                </div>
              </div>
            </div>

            {/* HUMAN PROCUREMENT OFFICER REVIEW DECISION */}
            <div className="bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
                Human Procurement Decision
              </h4>
              <p className="text-[11.5px] text-[#627a8f]">
                As authorized procurement personnel, verify or qualify this automated requirement result:
              </p>

              {officerDecision ? (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-md font-semibold flex items-center gap-2">
                  <Check size={16} />
                  <span>Decision Recorded: {officerDecision}</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOfficerDecision("Verified Compliant by Buyer")}
                    className="btn btn-primary flex-1 text-xs py-2 min-h-[38px] flex items-center justify-center gap-1"
                  >
                    <Check size={14} /> Confirm Compliance
                  </button>
                  <button
                    type="button"
                    onClick={() => setOfficerDecision("Flagged for Vendor Clarification")}
                    className="btn btn-secondary flex-1 text-xs py-2 min-h-[38px] flex items-center justify-center gap-1"
                  >
                    <HelpCircle size={14} /> Request Clarification
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
