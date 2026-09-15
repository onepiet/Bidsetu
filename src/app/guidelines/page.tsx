"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { BookOpen, ShieldCheck, Scale } from "lucide-react";

export default function GuidelinesPage() {
  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="bg-[#edf7ff] text-[#004e8a] border border-[#bcdbfc] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Statutory & Regulatory Framework
          </span>
          <h1 className="text-3xl font-extrabold text-[#002b4d] mt-3 mb-4">
            Procurement Guidelines & Compliance Manual
          </h1>
          <p className="text-sm text-[#4a5568]">
            Key regulations enforced by BIDSETU's AI Evaluation Engine for Indian Public Sector Procurements.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#dce6f0] shadow-xs">
            <h3 className="text-base font-bold text-[#004e8a] mb-2 flex items-center gap-2">
              <BookOpen size={18} /> 1. General Financial Rules (GFR 2017)
            </h3>
            <p className="text-xs text-[#5c6b73] leading-relaxed mb-3">
              Rule 144(xi) restricts procurement from countries sharing a land border with India unless the bidder is registered with the Competent Authority (DPIIT). Rule 170 governs Earnest Money Deposit (EMD) exemptions for registered Micro & Small Enterprises (MSEs).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#dce6f0] shadow-xs">
            <h3 className="text-base font-bold text-[#004e8a] mb-2 flex items-center gap-2">
              <Scale size={18} /> 2. Domestic Content Requirement (DCR) Policy
            </h3>
            <p className="text-xs text-[#5c6b73] leading-relaxed mb-3">
              Under MNRE & Ministry of Power guidelines, solar photovoltaic modules and cells must be manufactured domestically in India using ALMM (Approved List of Models & Manufacturers) compliant technology.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#dce6f0] shadow-xs">
            <h3 className="text-base font-bold text-[#004e8a] mb-2 flex items-center gap-2">
              <ShieldCheck size={18} /> 3. Central Vigilance Commission (CVC) Directives
            </h3>
            <p className="text-xs text-[#5c6b73] leading-relaxed mb-3">
              Mandates anti-collusion bidding safeguards, dual-signature evaluation committees, transparent bid opening protocols, and zero-tolerance policy against fake GSTIN or PAN declarations.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
