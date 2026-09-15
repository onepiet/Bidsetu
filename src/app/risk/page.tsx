"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  TrendingDown,
  Info,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { RiskAssessment } from "@/types";

export default function RiskPage() {
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRiskData() {
      try {
        const res = await fetch("/api/risk");
        if (res.ok) {
          const data = await res.json();
          setRiskAssessments(Array.isArray(data) ? data : data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch risk assessments", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRiskData();
  }, []);

  return (
    <AppShell pageTitle="Risk Intelligence & Anomaly Detection">
      <div className="space-y-6">
        {/* HEADER */}
        <div className="bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs">
          <h2 className="text-base font-bold text-navy">Procurement Risk Intelligence</h2>
          <p className="text-xs text-[#627a8f]">
            Continuous discrepancy detection, missing evidence identification, and automated compliance risk indexing
          </p>
        </div>

        {/* RISK CARDS */}
        <div className="space-y-4">
          {riskAssessments.map((ra) => (
            <div
              key={ra._id}
              className="bg-white rounded-lg border border-[#d7e1e9] shadow-xs overflow-hidden"
            >
              <div className="p-5 border-b border-[#edf1f4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">{ra._id}</span>
                    <span
                      className={`badge ${
                        ra.level === "LOW"
                          ? "badge-risk-low"
                          : ra.level === "MEDIUM"
                          ? "badge-risk-medium"
                          : "badge-risk-high"
                      }`}
                    >
                      {ra.level} Risk Profile
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-navy mt-1">{ra.vendorName}</h3>
                  <p className="text-xs text-[#627a8f]">{ra.tenderTitle}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-[#627a8f]">Risk Score Index</div>
                  <div className="text-2xl font-bold text-navy">{ra.score} / 100</div>
                  <div className="text-[10px] text-gray-400 font-mono">Engine: {ra.engineVersion}</div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1">
                    Risk Assessment Rationale
                  </h4>
                  <p className="text-xs text-[#4b6479] leading-relaxed bg-[#f8fafc] p-3 rounded border border-[#edf2f7]">
                    {ra.explanation}
                  </p>
                </div>

                {/* SIGNALS LIST */}
                <div>
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-2">
                    Identified Anomaly & Discrepancy Signals ({ra.signals.length})
                  </h4>
                  {ra.signals.length === 0 ? (
                    <div className="text-xs text-gray-400 italic p-3 bg-[#f8fafc] rounded">
                      Zero high-severity discrepancies detected in submission.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {ra.signals.map((sig) => (
                        <div
                          key={sig.id}
                          className="flex items-start gap-3 p-3 bg-amber-50/60 border border-amber-200 rounded-md text-xs"
                        >
                          <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-amber-900">{sig.type.replace("_", " ")}</span>
                              <span className="badge bg-white text-amber-800 text-[10px] border border-amber-300">
                                Severity: {sig.severity}
                              </span>
                            </div>
                            <p className="text-[#526577] mt-0.5">{sig.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href={`/compliance/${ra.complianceAnalysisId}`}
                    className="btn btn-secondary text-xs flex items-center gap-1.5"
                  >
                    <span>View Underlying Verification Matrix</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
