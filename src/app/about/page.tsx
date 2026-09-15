"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import Link from "next/link";
import { ShieldCheck, Scale, Cpu, Building2, CheckCircle2, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-6xl mx-auto">
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#edf7ff] text-[#004e8a] border border-[#bcdbfc] px-3.5 py-1 rounded-full text-xs font-semibold mb-4">
            <Building2 size={14} /> Ministry of Electronics & IT • GeM Procurement Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#002b4d] tracking-tight mb-4">
            About BIDSETU Platform
          </h1>
          <p className="text-base text-[#4a5568] leading-relaxed">
            BIDSETU (Procurement Bridge) is India’s premier AI-powered compliance and risk intelligence platform built for public sector procurement transparency, statutory GST/PAN verification, and General Financial Rules (GFR 2017) compliance.
          </p>
        </div>

        {/* THREE CORE PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white p-6 rounded-xl border border-[#dce6f0] shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-[#edf7ff] text-[#004e8a] flex items-center justify-center mb-4">
              <Cpu size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#002b4d] mb-2">Automated AI Auditing</h3>
            <p className="text-xs text-[#5c6b73] leading-relaxed">
              Extracts text from complex multi-page PDF tenders and vendor bid submissions using advanced OCR and Large Language Models, eliminating manual document checking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#dce6f0] shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-[#eefbe8] text-[#138808] flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#002b4d] mb-2">DATASETU Statutory API</h3>
            <p className="text-xs text-[#5c6b73] leading-relaxed">
              Integrates directly with GSTIN portals, Income Tax PAN databases, and MCA registry to verify vendor legitimacy and flag non-compliant filers in real time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#dce6f0] shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-[#fff6e5] text-[#d97706] flex items-center justify-center mb-4">
              <Scale size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#002b4d] mb-2">Make in India & DCR Checks</h3>
            <p className="text-xs text-[#5c6b73] leading-relaxed">
              Automatically verifies Domestic Content Requirement (DCR), Class-I/II Local Supplier thresholds, and CVC anti-collusion bidding safeguards.
            </p>
          </div>
        </div>

        {/* MISSION & IMPACT */}
        <div className="bg-white p-8 rounded-2xl border border-[#dce6f0] shadow-sm mb-14">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-[#002b4d] mb-4">
              Designed for Smart, Transparent Public Procurement
            </h2>
            <p className="text-sm text-[#4a5568] leading-relaxed mb-6">
              Government procurement accounts for over 20% of India's GDP. BIDSETU bridges the gap between complex procurement guidelines and real-time vendor verification, ensuring that public money is spent efficiently, legally, and transparently.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-[#2d3748]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#138808]" /> 100% GFR 2017 & GeM Terms Alignment
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#138808]" /> Sub-second DATASETU API Verification
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#138808]" /> Immutable CVC Audit Trails & Logs
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#138808]" /> Zero Static Score Fallbacks
              </div>
            </div>
          </div>
        </div>

        {/* CALL TO ACTION */}
        <div className="bg-gradient-to-r from-[#004e8a] to-[#003866] text-white p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="text-xl font-bold mb-1">Ready to Explore BIDSETU Workspace?</h3>
            <p className="text-xs text-[#b3d7ff]">
              Experience real-time AI compliance evaluations and statutory vendor audits.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/vendor"
              className="btn py-2.5 px-5 bg-white text-[#004e8a] font-bold text-xs rounded hover:bg-[#edf7ff] transition-colors flex items-center gap-2"
            >
              Vendor Portal <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
