"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { FileCode2, CheckSquare } from "lucide-react";

export default function UserManualPage() {
  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl border border-[#dce6f0] shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-[#edf1f4] pb-4">
            <FileCode2 className="text-[#004e8a]" size={32} />
            <div>
              <h1 className="text-2xl font-extrabold text-[#002b4d]">BIDSETU Platform User Manual</h1>
              <p className="text-xs text-[#5c6b73]">Operational Guide for Buyers, Bidders & System Administrators</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-[#4a5568]">
            <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
              <h3 className="font-bold text-[#002b4d] text-sm mb-1">Section 1: Vendor Registration & Single PDF Upload</h3>
              <p className="leading-relaxed">
                Log into the Vendor Portal, select an open tender, and upload your technical proposal. BIDSETU parses multi-page PDFs to detect PAN numbers, GSTIN, ITR statements, Net Worth certificates, and DCR declarations automatically.
              </p>
            </div>

            <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
              <h3 className="font-bold text-[#002b4d] text-sm mb-1">Section 2: Procurement Officer Review & Evidence Inspector</h3>
              <p className="leading-relaxed">
                Access the Bids Review dashboard to inspect clause-by-clause compliance scores (0-100%), verified DATASETU statutory status, and view exact PDF page snippets for non-compliant items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
