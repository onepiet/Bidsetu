"use client";

import PublicLayout from "@/components/layout/PublicLayout";

export default function FAQPage() {
  const faqs = [
    {
      q: "What is BIDSETU?",
      a: "BIDSETU is an AI-powered procurement compliance and risk intelligence platform built for public sector procurement, verifying tender filings against GFR 2017, MNRE DCR norms, and live statutory databases."
    },
    {
      q: "How does the AI Compliance Matrix work?",
      a: "BIDSETU extracts text from uploaded PDF bid dossiers using OCR, parses technical clauses, and evaluates mandatory requirements line-by-line, providing dynamic compliance scores and risk indicators."
    },
    {
      q: "Is static score fallback used?",
      a: "No! All compliance scores are dynamically evaluated based on document contents and live DATASETU API statutory responses."
    },
    {
      q: "How can vendors submit single consolidated PDF dossiers?",
      a: "In the Vendor Portal, bidders can select a tender, attach a single PDF containing all 10 required company documents (PAN, GST, ITR, ISO, Net Worth, etc.), and receive immediate evaluation."
    }
  ];

  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#002b4d] mb-8 text-center">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-[#dce6f0] shadow-xs">
              <h3 className="text-base font-bold text-[#004e8a] mb-2">{f.q}</h3>
              <p className="text-xs text-[#5c6b73] leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
