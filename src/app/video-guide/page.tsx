"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { PlayCircle, Video } from "lucide-react";

export default function VideoGuidePage() {
  const guides = [
    { title: "Uploading 10-Document Consolidated PDF Bids", duration: "04:15", topic: "Vendor Filing" },
    { title: "Understanding Real-Time DATASETU GSTIN & PAN Verification", duration: "06:30", topic: "Statutory Audit" },
    { title: "Inspecting Evidence Matrix & DCR Solar Cell Violations", duration: "08:45", topic: "Buyer Workflow" },
  ];

  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-[#002b4d] mb-3">Video Tutorials & Walkthroughs</h1>
          <p className="text-sm text-[#4a5568]">Visual guides to help bidders and buyers navigate BIDSETU.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((g, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-[#dce6f0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-full h-36 bg-[#002b4d] rounded-xl flex items-center justify-center text-white mb-4 relative overflow-hidden group cursor-pointer">
                  <PlayCircle size={44} className="group-hover:scale-110 transition-transform text-[#f39a21]" />
                  <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono">{g.duration}</span>
                </div>
                <span className="badge bg-[#edf7ff] text-[#004e8a] border border-[#bcdbfc] text-[10px] font-bold mb-2 inline-block">{g.topic}</span>
                <h3 className="font-bold text-[#002b4d] text-xs leading-snug">{g.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
