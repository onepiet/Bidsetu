"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { Award, Zap, ShieldCheck } from "lucide-react";

export default function SchemesPage() {
  const schemes = [
    {
      title: "Make in India Policy (Public Procurement Order)",
      desc: "Mandates purchase preference for Class-I (Local Content ≥ 50%) and Class-II (Local Content ≥ 20%) local suppliers in government tenders.",
      icon: Award,
      tag: "DPIIT Order"
    },
    {
      title: "Public Procurement Policy for MSEs Order 2012",
      desc: "Requires 25% mandatory procurement from Micro & Small Enterprises (MSEs), with 4% reserved for SC/ST MSEs and 3% for Women MSE entrepreneurs.",
      icon: Zap,
      tag: "Ministry of MSME"
    },
    {
      title: "Startup India Public Procurement Relaxations",
      desc: "Exempts recognized startups from prior experience and prior turnover criteria subject to technical capability fulfillment.",
      icon: ShieldCheck,
      tag: "Startup India"
    }
  ];

  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="bg-[#edf7ff] text-[#004e8a] border border-[#bcdbfc] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Incentives & Policies
          </span>
          <h1 className="text-3xl font-extrabold text-[#002b4d] mt-3 mb-4">
            Government Procurement Schemes & Benefits
          </h1>
          <p className="text-sm text-[#4a5568]">
            Key public procurement policies integrated into BIDSETU's automated rule matrix.
          </p>
        </div>

        <div className="space-y-6">
          {schemes.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#dce6f0] shadow-xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#edf7ff] text-[#004e8a] flex items-center justify-center shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge bg-[#eefbe8] text-[#138808] border border-[#c3f0b4] text-[10px] font-bold">{s.tag}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#002b4d] mb-1.5">{s.title}</h3>
                  <p className="text-xs text-[#5c6b73] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PublicLayout>
  );
}
