"use client";

import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Search, HelpCircle, FileText, PhoneCall, ChevronRight } from "lucide-react";

export default function HelpPage() {
  const [query, setQuery] = useState("");

  const faqs = [
    {
      q: "How does BIDSETU verify GSTIN and PAN numbers?",
      a: "BIDSETU connects directly to official DATASETU statutory verification APIs to query live GST portal and Income Tax databases, validating legal entity name, filing status, and active registration.",
    },
    {
      q: "What documents can be uploaded for tender evaluation?",
      a: "You can upload technical proposals, financial bids, GST registration certificates, PAN cards, ISO certificates, net worth declarations, and consolidated 10-document PDF dossiers.",
    },
    {
      q: "What happens if a DCR violation is detected?",
      a: "The compliance engine automatically flags the bid as HIGH RISK, highlights non-compliant solar cell origin clauses, and alerts the procurement officer before final award.",
    },
    {
      q: "Are EMD exemptions supported for MSEs and Startups?",
      a: "Yes! Bidders with valid Udyam Registration or DPIIT Startup certificates automatically receive verified EMD exemption scoring.",
    },
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()));

  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-[#002b4d] mb-3">
            BIDSETU Help Center & Knowledge Base
          </h1>
          <p className="text-sm text-[#4a5568] mb-6">
            Search support articles, user manuals, and procurement compliance guides.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help topics (e.g. GST verification, DCR, PDF upload)..."
              className="w-full pl-11 pr-4 py-3 border border-[#cbd7e0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004e8a] shadow-xs"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#002b4d] mb-4 flex items-center gap-2">
            <HelpCircle size={20} className="text-[#004e8a]" /> Frequently Asked Questions
          </h3>

          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-[#dce6f0] shadow-xs">
              <h4 className="font-bold text-[#003866] text-sm mb-2">{faq.q}</h4>
              <p className="text-xs text-[#5c6b73] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
