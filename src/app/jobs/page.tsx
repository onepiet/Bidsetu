"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { Briefcase, ArrowRight } from "lucide-react";

export default function JobsPage() {
  const jobs = [
    { title: "Senior AI / NLP Engineer (Procurement LLMs)", dept: "NeGD AI Lab", location: "New Delhi / Remote", type: "Full-Time" },
    { title: "Lead Full-Stack Developer (Next.js / Node.js)", dept: "Digital India Division", location: "New Delhi", type: "Full-Time" },
    { title: "Public Procurement & Statutory Audit Specialist", dept: "Policy & Compliance", location: "New Delhi", type: "Contract" },
  ];

  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-[#002b4d] mb-3">Careers at NeGD & BIDSETU</h1>
          <p className="text-sm text-[#4a5568]">Build the future of AI-powered public e-governance and transparent procurement in India.</p>
        </div>

        <div className="space-y-4">
          {jobs.map((j, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-[#dce6f0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge bg-[#edf7ff] text-[#004e8a] border border-[#bcdbfc] text-[10px] font-bold">{j.dept}</span>
                  <span className="badge bg-gray-100 text-gray-700 text-[10px] font-bold">{j.type}</span>
                </div>
                <h3 className="font-bold text-[#002b4d] text-base mb-1">{j.title}</h3>
                <div className="text-xs text-[#5c6b73]">{j.location}</div>
              </div>
              <button
                onClick={() => alert(`Applying for ${j.title}. Send resume to careers@negd.gov.in`)}
                className="btn py-2 px-4 bg-[#004e8a] hover:bg-[#003d70] text-white text-xs font-bold rounded inline-flex items-center justify-center gap-1.5 shrink-0"
              >
                Apply Now <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
