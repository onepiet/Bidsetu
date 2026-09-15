"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { ComplianceAnalysis } from "@/types";

export default function ComplianceListPage() {
  const [analyses, setAnalyses] = useState<ComplianceAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComplianceData() {
      try {
        const res = await fetch("/api/compliance");
        if (res.ok) {
          const data = await res.json();
          setAnalyses(Array.isArray(data) ? data : data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch compliance analyses", err);
      } finally {
        setLoading(false);
      }
    }
    fetchComplianceData();
  }, []);

  return (
    <AppShell pageTitle="Compliance Intelligence Matrix">
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs">
          <h2 className="text-base font-bold text-navy">AI-Assisted Compliance Verifications</h2>
          <p className="text-xs text-[#627a8f]">
            Multilayer requirement-level verification linking vendor evidence directly to mandatory tender specifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analyses.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-lg border border-[#d7e1e9] shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="badge bg-[#edf7ff] text-[#0b5f96] text-[10px] mb-1 font-mono">
                      {a._id}
                    </span>
                    <h3 className="text-sm font-bold text-navy">{a.vendorName}</h3>
                    <p className="text-xs text-[#64798c] mt-0.5 line-clamp-1">{a.tenderTitle}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-extrabold text-[#16794c]">{a.score}%</div>
                    <span
                      className={`badge text-[10px] ${
                        a.riskLevel === "LOW"
                          ? "badge-risk-low"
                          : a.riskLevel === "MEDIUM"
                          ? "badge-risk-medium"
                          : "badge-risk-high"
                      }`}
                    >
                      {a.riskLevel} Risk
                    </span>
                  </div>
                </div>

                {/* STATUS BAR */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#edf2f7] text-center">
                  <div className="p-2 bg-[#e6f6ee]/50 rounded">
                    <div className="text-xs font-bold text-[#16794c]">{a.compliantCount}</div>
                    <div className="text-[10px] text-gray-500">Compliant</div>
                  </div>
                  <div className="p-2 bg-[#fef8e7]/50 rounded">
                    <div className="text-xs font-bold text-[#b7791f]">{a.reviewRequiredCount}</div>
                    <div className="text-[10px] text-gray-500">Review Required</div>
                  </div>
                  <div className="p-2 bg-[#fde8e8]/50 rounded">
                    <div className="text-xs font-bold text-[#b42318]">{a.nonCompliantCount}</div>
                    <div className="text-[10px] text-gray-500">Non-Compliant</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#f8fafc] border-t border-[#edf1f4] flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {a.results.length} Requirements Evaluated
                </span>
                <Link
                  href={`/compliance/${a._id}`}
                  className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <span>Open Verification Matrix</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
