"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import Link from "next/link";
import { FileText, ShieldAlert, CheckCircle, ArrowRight } from "lucide-react";

export default function ProcurementPage() {
  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-[#edf7ff] text-[#004e8a] border border-[#bcdbfc] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Public Procurement Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#002b4d] tracking-tight mt-3 mb-4">
            Government Procurement Portal & Standards
          </h1>
          <p className="text-base text-[#4a5568] leading-relaxed">
            Discover active tenders, statutory compliance frameworks, and automated bid evaluation workflows integrated with Government e-Marketplace (GeM) standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-[#dce6f0] shadow-xs">
            <h3 className="text-lg font-bold text-[#002b4d] mb-3 flex items-center gap-2">
              <FileText className="text-[#004e8a]" size={20} /> Buyer / Procurement Officer Workflow
            </h3>
            <ul className="space-y-2.5 text-xs text-[#4a5568]">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#138808] mt-0.5 shrink-0" />
                <span>Publish RFP technical mandates with explicit clause criteria.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#138808] mt-0.5 shrink-0" />
                <span>Automated matrix generation for non-compliant & DCR-violating bids.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#138808] mt-0.5 shrink-0" />
                <span>Audit trail generation compliant with Central Vigilance Commission (CVC).</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/tenders" className="btn py-2 px-4 bg-[#004e8a] text-white text-xs font-semibold rounded inline-flex items-center gap-1.5">
                Browse Active Tenders <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#dce6f0] shadow-xs">
            <h3 className="text-lg font-bold text-[#002b4d] mb-3 flex items-center gap-2">
              <ShieldAlert className="text-[#d97706]" size={20} /> Vendor & Bidder Experience
            </h3>
            <ul className="space-y-2.5 text-xs text-[#4a5568]">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#138808] mt-0.5 shrink-0" />
                <span>Upload consolidated 10-document PDF dossiers or single filings.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#138808] mt-0.5 shrink-0" />
                <span>Real-time pre-submission verification for GSTIN, PAN, and EMD status.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#138808] mt-0.5 shrink-0" />
                <span>Instant feedback on missing technical specs or expired certificates.</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/vendor" className="btn py-2 px-4 bg-[#edf7ff] text-[#004e8a] border border-[#bce0fd] text-xs font-semibold rounded inline-flex items-center gap-1.5">
                Access Vendor Workspace <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
