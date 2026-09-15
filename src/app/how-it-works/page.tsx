"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import Link from "next/link";
import { Upload, FileSearch, ShieldCheck, BarChart3, CheckCircle, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Document Ingestion & OCR Extraction",
      desc: "Vendors upload single consolidated PDF dossiers or multi-document technical bids. BIDSETU's optical engine extracts raw clause text, table matrices, and statutory certificates.",
      icon: Upload,
      bg: "bg-[#edf7ff]",
      text: "text-[#004e8a]",
    },
    {
      step: "02",
      title: "AI Compliance Rule Matching",
      desc: "Our NLP compliance engine parses tender mandates against extracted bid clauses. It checks for DCR solar cell origin, minimum turnover, ISO certifications, and EMD exemptions.",
      icon: FileSearch,
      bg: "bg-[#fff6e5]",
      text: "text-[#d97706]",
    },
    {
      step: "03",
      title: "DATASETU Statutory Live API Audit",
      desc: "Real-time calls query external government databases via DATASETU APIs to verify GSTIN status (Active/Suspended), PAN legal entity names, and blacklisting status.",
      icon: ShieldCheck,
      bg: "bg-[#eefbe8]",
      text: "text-[#138808]",
    },
    {
      step: "04",
      title: "Dynamic Risk Scoring & Evidence Matrix",
      desc: "A composite compliance score (0-100%) and risk tier (LOW/MEDIUM/HIGH) is dynamically computed with precise page-level evidence snippets for procurement officers.",
      icon: BarChart3,
      bg: "bg-[#f3edf8]",
      text: "text-[#7c3aed]",
    },
  ];

  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="bg-[#edf7ff] text-[#004e8a] border border-[#bcdbfc] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Step-by-Step Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#002b4d] tracking-tight mt-3 mb-4">
            How BIDSETU Evaluates Compliance
          </h1>
          <p className="text-base text-[#4a5568] leading-relaxed">
            From PDF upload to real-time statutory verification, explore how BIDSETU automates complex government procurement compliance in seconds.
          </p>
        </div>

        {/* WORKFLOW STEPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white p-7 rounded-2xl border border-[#dce6f0] shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.text} flex items-center justify-center font-bold`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-3xl font-black text-[#cbd7e0] font-mono">{s.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#002b4d] mb-2">{s.title}</h3>
                  <p className="text-xs text-[#5c6b73] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* LIVE DEMO CTA */}
        <div className="bg-white border border-[#dce6f0] p-8 rounded-2xl text-center max-w-2xl mx-auto shadow-sm">
          <h3 className="text-xl font-bold text-[#002b4d] mb-2">Test the Pipeline in Vendor Portal</h3>
          <p className="text-xs text-[#5c6b73] mb-6">
            Upload sample bid PDFs (e.g. DCR violations or compliant tenders) and inspect real-time AI scoring.
          </p>
          <Link
            href="/vendor"
            className="btn py-2.5 px-6 bg-[#004e8a] hover:bg-[#003d70] text-white font-bold text-xs rounded inline-flex items-center gap-2 shadow-xs"
          >
            Go to Vendor Submission Workspace <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
