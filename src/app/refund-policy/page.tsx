"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { RefreshCw } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl border border-[#dce6f0] shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-[#edf1f4] pb-4">
            <RefreshCw className="text-[#004e8a]" size={28} />
            <div>
              <h1 className="text-2xl font-extrabold text-[#002b4d]">Cancellation & Refund Policy</h1>
              <p className="text-xs text-[#5c6b73]">Earnest Money Deposit (EMD) & Tender Processing Fee Guidelines</p>
            </div>
          </div>

          <div className="text-xs text-[#4a5568] space-y-4 leading-relaxed">
            <h3 className="text-sm font-bold text-[#002b4d]">1. Earnest Money Deposit (EMD) Refunds</h3>
            <p>
              EMD submitted by unsuccessful bidders will be refunded automatically within 15 days of contract award to the verified bank account linked via DATASETU statutory verification.
            </p>

            <h3 className="text-sm font-bold text-[#002b4d]">2. MSE & Startup Exemptions</h3>
            <p>
              Under GFR Rule 170, registered Micro & Small Enterprises (MSEs) and DPIIT-recognized Startups are 100% exempt from submitting EMD. BIDSETU automatically verifies Udyam registration certificates during document upload.
            </p>

            <h3 className="text-sm font-bold text-[#002b4d]">3. Tender Document Fee Non-Refundability</h3>
            <p>
              Tender processing fees paid directly to the procuring department on GeM or Central Public Procurement Portal (CPPP) are non-refundable, except in cases where a tender is cancelled prior to technical opening.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
