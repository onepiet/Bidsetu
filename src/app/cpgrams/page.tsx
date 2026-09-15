"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { AlertCircle, ExternalLink, ShieldCheck } from "lucide-react";

export default function CpgramsPage() {
  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl border border-[#dce6f0] shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-[#edf1f4] pb-4">
            <AlertCircle className="text-[#004e8a]" size={32} />
            <div>
              <h1 className="text-2xl font-extrabold text-[#002b4d]">CPGRAMS Grievance Redressal Portal</h1>
              <p className="text-xs text-[#5c6b73]">Centralized Public Grievance Redress and Monitoring System (Government of India)</p>
            </div>
          </div>

          <p className="text-xs text-[#4a5568] leading-relaxed">
            CPGRAMS is an online platform available 24/7 for citizens and registered vendors to lodge grievances to public authorities on any subject related to service delivery or procurement irregularities.
          </p>

          <div className="bg-[#edf7ff] p-5 rounded-xl border border-[#bcdbfc] text-xs text-[#003866] space-y-2">
            <strong className="font-bold block">How CPGRAMS Integrates with BIDSETU:</strong>
            <p>
              Vendor complaints regarding tender disqualifications or delayed EMD refunds are tracked via unique CPGRAMS grievance IDs, providing transparent audit visibility to the Ministry of Electronics & IT.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="https://pgportal.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn py-2.5 px-5 bg-[#004e8a] hover:bg-[#003d70] text-white font-bold text-xs rounded inline-flex items-center gap-2"
            >
              Lodge Grievance on Official CPGRAMS Portal <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
