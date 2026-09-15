"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl border border-[#dce6f0] shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-[#edf1f4] pb-4">
            <Shield className="text-[#004e8a]" size={28} />
            <div>
              <h1 className="text-2xl font-extrabold text-[#002b4d]">Privacy Policy & Data Governance</h1>
              <p className="text-xs text-[#5c6b73]">Digital Personal Data Protection (DPDP) Act 2023 Compliant</p>
            </div>
          </div>

          <div className="text-xs text-[#4a5568] space-y-4 leading-relaxed">
            <h3 className="text-sm font-bold text-[#002b4d]">1. Data Collection & Purpose Limitation</h3>
            <p>
              BIDSETU collects official company credentials, GSTIN identifiers, PAN numbers, and uploaded procurement PDF documents strictly for verifying tender compliance and evaluating bidder eligibility under General Financial Rules (GFR 2017).
            </p>

            <h3 className="text-sm font-bold text-[#002b4d]">2. DATASETU API Verification & Government Integration</h3>
            <p>
              Statutory verification queries are routed securely to authenticated government gateways including the GST Portal, Income Tax Department, and MCA registry. No commercial data sharing or third-party monetization occurs.
            </p>

            <h3 className="text-sm font-bold text-[#002b4d]">3. Document Encryption & Retention</h3>
            <p>
              Uploaded PDFs are encrypted in transit via TLS 1.3 and stored in encrypted government database storage (MongoDB Atlas / NIC Cloud) with role-based access control (RBAC).
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
