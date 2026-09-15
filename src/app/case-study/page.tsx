"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { Award, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default function CaseStudyPage() {
  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-[#edf7ff] text-[#004e8a] border border-[#bcdbfc] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Impact & Case Study
          </span>
          <h1 className="text-3xl font-extrabold text-[#002b4d] mt-3 mb-4">
            Transforming Public Procurement Audit Cycles: BIDSETU Case Study
          </h1>
          <p className="text-sm text-[#4a5568] leading-relaxed">
            How automated OCR parsing, DATASETU statutory verification, and AI compliance matrix generation reduced technical tender evaluation times from 14 days to under 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-[#dce6f0] text-center shadow-xs">
            <Clock className="text-[#004e8a] mx-auto mb-2" size={32} />
            <div className="text-3xl font-black text-[#002b4d] font-mono mb-1">99.8%</div>
            <div className="text-xs text-[#5c6b73]">Reduction in Document Verification Time</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#dce6f0] text-center shadow-xs">
            <TrendingUp className="text-[#138808] mx-auto mb-2" size={32} />
            <div className="text-3xl font-black text-[#002b4d] font-mono mb-1">100%</div>
            <div className="text-xs text-[#5c6b73]">DATASETU Statutory GSTIN Accuracy</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#dce6f0] text-center shadow-xs">
            <Award className="text-[#d97706] mx-auto mb-2" size={32} />
            <div className="text-3xl font-black text-[#002b4d] font-mono mb-1">Zero</div>
            <div className="text-xs text-[#5c6b73]">Unflagged DCR Solar Cell Violations</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#dce6f0] shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-[#002b4d]">Implementation Summary</h3>
          <p className="text-xs text-[#4a5568] leading-relaxed">
            Prior to BIDSETU, evaluation committees manually inspected hundreds of pages per bidder across 10 mandatory document categories (PAN, GST, ITR, Audit Statements, ISO 9001, Net Worth, DCR compliance). BIDSETU automates this end-to-end pipeline, producing immutable CVC audit logs and real-time risk indicators.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
