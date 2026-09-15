"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { Building2, ShieldCheck, Globe } from "lucide-react";

export default function PartnersPage() {
  const partners = [
    { name: "National e-Governance Division (NeGD)", role: "Program Owner & Technical Oversight", desc: "Under Ministry of Electronics & IT (MeitY)" },
    { name: "Government e-Marketplace (GeM)", role: "Procurement Portal Gateway Partner", desc: "National Public Procurement Portal" },
    { name: "National Informatics Centre (NIC)", role: "Secure Data Hosting & Cloud Infrastructure", desc: "MeitY Enterprise Cloud" },
    { name: "Central Vigilance Commission (CVC)", role: "Audit Guidelines & Vigilance Compliance", desc: "Anti-corruption Oversight" },
  ];

  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-[#002b4d] mb-3">Institutional Partners</h1>
          <p className="text-sm text-[#4a5568]">Collaborating with core e-governance bodies across India.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {partners.map((p, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-[#dce6f0] shadow-xs">
              <Building2 className="text-[#004e8a] mb-3" size={28} />
              <h3 className="font-bold text-[#002b4d] text-base mb-1">{p.name}</h3>
              <div className="text-xs font-semibold text-[#138808] mb-2">{p.role}</div>
              <p className="text-xs text-[#5c6b73]">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
