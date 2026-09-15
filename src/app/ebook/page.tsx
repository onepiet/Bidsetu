"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { BookOpen, Download } from "lucide-react";

export default function EbookPage() {
  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl border border-[#dce6f0] shadow-xs flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 h-64 bg-gradient-to-br from-[#004e8a] to-[#002b4d] rounded-xl p-6 text-white flex flex-col justify-between shadow-lg shrink-0 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#b3d7ff]">NeGD Publication</div>
              <div className="text-base font-black mt-4 leading-tight">BIDSETU Operating SOP Handbook</div>
            </div>
            <div className="text-[10px] text-[#80bfff]">2026 Edition • GFR & GeM Framework</div>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-extrabold text-[#002b4d]">Public Procurement AI Operating Handbook</h1>
            <p className="text-xs text-[#4a5568] leading-relaxed">
              Comprehensive reference guide covering automated technical evaluation rules, CVC anti-collusion guidelines, DATASETU statutory API specifications, and Make in India local content verification procedures.
            </p>
            <button
              onClick={() => alert("Downloading BIDSETU Operating SOP Handbook PDF...")}
              className="btn py-2.5 px-5 bg-[#004e8a] hover:bg-[#003d70] text-white font-bold text-xs rounded inline-flex items-center gap-2"
            >
              <Download size={14} /> Download PDF eBook (3.4 MB)
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
