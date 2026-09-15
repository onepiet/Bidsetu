"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { PhoneCall, ShieldCheck } from "lucide-react";

export default function ConsumerHelplinePage() {
  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl border border-[#dce6f0] shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-[#edf1f4] pb-4">
            <PhoneCall className="text-[#138808]" size={32} />
            <div>
              <h1 className="text-2xl font-extrabold text-[#002b4d]">National Consumer Helpline (NCH)</h1>
              <p className="text-xs text-[#5c6b73]">Department of Consumer Affairs • Ministry of Consumer Affairs, Food & Public Distribution</p>
            </div>
          </div>

          <p className="text-xs text-[#4a5568] leading-relaxed">
            The National Consumer Helpline (NCH) provides guidance and mechanisms to address consumer grievances, vendor trade disputes, and procurement contract defaults.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#f0f9ff] p-4 rounded-xl border border-[#bce0fd]">
              <strong className="block text-[#004e8a] font-bold mb-1">Toll-Free Helpline Number</strong>
              <div className="text-lg font-black text-[#002b4d] font-mono">1915 / 1800-11-4000</div>
            </div>
            <div className="bg-[#f0f9ff] p-4 rounded-xl border border-[#bce0fd]">
              <strong className="block text-[#004e8a] font-bold mb-1">SMS Assistance</strong>
              <div className="text-lg font-black text-[#002b4d] font-mono">SMS 'NCH' to 8800001915</div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
