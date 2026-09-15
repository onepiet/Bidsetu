"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { Accessibility } from "lucide-react";

export default function AccessibilityPage() {
  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl border border-[#dce6f0] shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-[#edf1f4] pb-4">
            <Accessibility className="text-[#004e8a]" size={32} />
            <div>
              <h1 className="text-2xl font-extrabold text-[#002b4d]">Accessibility Statement</h1>
              <p className="text-xs text-[#5c6b73]">Guidelines for Indian Government Websites (GIGW) & WCAG 2.1 Level AA Compliance</p>
            </div>
          </div>

          <div className="text-xs text-[#4a5568] space-y-3 leading-relaxed">
            <p>
              BIDSETU is committed to ensuring digital accessibility for persons with disabilities. We continuously improve user experience for everyone, applying relevant accessibility standards (GIGW 3.0 & WCAG 2.1 AA).
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>High-contrast mode and font size adjustment tools available in top bar.</li>
              <li>Screen reader compatible ARIA labels on all form inputs and interactive buttons.</li>
              <li>Full keyboard accessibility navigation across all workspace components.</li>
            </ul>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
