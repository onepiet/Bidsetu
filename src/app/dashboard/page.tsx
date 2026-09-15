"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  FileSpreadsheet,
  FileCheck,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
  Play,
  FileText,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Tender, Bid, ComplianceAnalysis } from "@/types";

export default function DashboardPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [analyses, setAnalyses] = useState<ComplianceAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [tendersRes, bidsRes, complianceRes] = await Promise.all([
          fetch("/api/tenders"),
          fetch("/api/bids"),
          fetch("/api/compliance"),
        ]);

        if (tendersRes.ok) {
          const tJson = await tendersRes.json();
          setTenders(Array.isArray(tJson) ? tJson : tJson.data || []);
        }

        if (bidsRes.ok) {
          const bJson = await bidsRes.json();
          setBids(Array.isArray(bJson) ? bJson : bJson.data || []);
        }

        if (complianceRes.ok) {
          const cJson = await complianceRes.json();
          setAnalyses(Array.isArray(cJson) ? cJson : cJson.data || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard statistics", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const activeTendersCount = tenders.filter((t) => t.status === "PUBLISHED" || t.status === "UNDER_EVALUATION").length;
  const totalBidsCount = bids.length || analyses.length;
  const bidsAwaitingReview = analyses.filter((a) => a.reviewRequiredCount > 0 || a.status === "REQUIRES_REVIEW");
  const compliantBidsCount = analyses.filter((a) => a.nonCompliantCount === 0 && a.reviewRequiredCount === 0).length;
  const nonCompliantBidsCount = analyses.filter((a) => a.nonCompliantCount > 0).length;
  const highRiskBidsCount = analyses.filter((a) => a.riskLevel === "HIGH").length;

  return (
    <AppShell pageTitle="Procurement Officer Dashboard">
      <div className="space-y-6">
        {/* KPI METRIC CARDS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-[#dce5ed] shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Active Tenders</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-navy">{activeTendersCount}</span>
              <FileSpreadsheet size={18} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#dce5ed] shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Bids</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-navy">{totalBidsCount}</span>
              <Layers size={18} className="text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#dce5ed] shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Awaiting Review</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600">{bidsAwaitingReview.length}</span>
              <AlertTriangle size={18} className="text-amber-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#dce5ed] shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Compliant Bids</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-600">{compliantBidsCount}</span>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#dce5ed] shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Non-Compliant</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-red-600">{nonCompliantBidsCount}</span>
              <XCircle size={18} className="text-red-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#dce5ed] shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">High Risk Bids</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-red-700">{highRiskBidsCount}</span>
              <ShieldAlert size={18} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* PROMINENT ACTION REQUIRED SECTION */}
        <div className="card p-5 bg-gradient-to-r from-amber-50/50 to-orange-50/30 border border-amber-200/80 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-600" />
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider">
                Action Required — Officer Evaluation Queue ({bidsAwaitingReview.length})
              </h3>
            </div>
            <span className="text-xs text-amber-700 font-medium">
              Human Officer Sign-off Required Before Awarding
            </span>
          </div>

          {bidsAwaitingReview.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500 bg-white rounded-lg border border-amber-100">
              No bids currently awaiting officer review. All submissions evaluated!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bidsAwaitingReview.slice(0, 3).map((analysis) => (
                <div
                  key={analysis._id}
                  className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge bg-amber-100 text-amber-800 text-[10.5px] font-bold">
                        ID: {analysis.bidId}
                      </span>
                      <span
                        className={`badge text-[10.5px] font-bold ${
                          analysis.riskLevel === "HIGH"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-amber-100 text-amber-700 border-amber-200"
                        }`}
                      >
                        Risk: {analysis.riskLevel}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-navy line-clamp-1">{analysis.vendorName}</h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{analysis.tenderTitle}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <div>
                        <span className="text-gray-400">Score:</span>{" "}
                        <span className="font-bold text-navy">{analysis.score}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Review Items:</span>{" "}
                        <span className="font-bold text-amber-700">{analysis.reviewRequiredCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Failures:</span>{" "}
                        <span className="font-bold text-red-600">{analysis.nonCompliantCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Stat Verification:</span>{" "}
                        <span className="font-bold text-blue-600">Pending</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/compliance/${analysis._id}`}
                    className="btn btn-primary text-xs w-full justify-center py-2 flex items-center gap-1.5"
                  >
                    <span>Review Bid & Evaluate</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK ACTIONS BAR */}
        <div className="bg-white p-4 rounded-xl border border-[#dce5ed] flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-xs font-bold text-navy uppercase tracking-wider">
              Procurement Officer Actions:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/tenders/new"
              className="btn btn-primary text-xs py-1.5 px-3 min-h-[36px] flex items-center gap-1.5"
            >
              <PlusCircle size={14} />
              <span>Create Tender</span>
            </Link>
            <Link
              href="/compliance"
              className="btn btn-secondary text-xs py-1.5 px-3 min-h-[36px] flex items-center gap-1.5"
            >
              <Play size={14} />
              <span>Compliance Matrix</span>
            </Link>
            <Link
              href="/reports"
              className="btn btn-secondary text-xs py-1.5 px-3 min-h-[36px] flex items-center gap-1.5"
            >
              <FileText size={14} />
              <span>Audit Reports</span>
            </Link>
          </div>
        </div>

        {/* 2-COLUMN OPERATIONAL DATA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RECENT TENDERS TABLE (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#dce5ed] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#edf1f4] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-navy">Active GeM Procurement Tenders</h3>
                <p className="text-xs text-[#627a8f]">Persisted records from MongoDB repository</p>
              </div>
              <Link href="/tenders" className="text-xs text-[#0b5f96] font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight size={13} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Tender ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tenders.map((t) => (
                    <tr key={t._id}>
                      <td className="font-semibold text-[#0b5f96] whitespace-nowrap">
                        {t.tenderId}
                      </td>
                      <td className="max-w-[280px] truncate" title={t.title}>
                        {t.title}
                      </td>
                      <td>
                        <span className="badge bg-[#edf7ff] text-[#0b5f96] border border-[#bce0fd]">
                          {t.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="text-xs text-[#526a80] whitespace-nowrap">
                        {t.publication?.submissionDeadline ? new Date(t.publication.submissionDeadline).toLocaleDateString() : "N/A"}
                      </td>
                      <td>
                        <Link
                          href={`/tenders/${t._id}`}
                          className="text-xs text-[#0b5f96] font-semibold hover:underline"
                        >
                          Inspect →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT SIDE: RECENT ANALYSES & RISK */}
          <div className="bg-white rounded-xl border border-[#dce5ed] shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#edf1f4] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-navy">Recent Compliance Analyses</h3>
                <p className="text-xs text-[#627a8f]">AI & Rule-based verification runs</p>
              </div>
              <Link href="/compliance" className="text-xs text-[#0b5f96] font-semibold hover:underline">
                Details →
              </Link>
            </div>

            <div className="p-4 space-y-3 flex-1">
              {analyses.map((a) => (
                <div key={a._id} className="p-3 rounded-lg border border-[#e2eaf0] bg-[#fcfdfe]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-navy truncate max-w-[180px]">
                      {a.vendorName}
                    </span>
                    <span
                      className={`badge text-[10.5px] font-bold ${
                        a.riskLevel === "HIGH"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      Risk: {a.riskLevel}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#55718a] truncate mb-2">
                    {a.tenderTitle}
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#edf2f7]">
                    <div>
                      <span className="text-[#64798c]">Score: </span>
                      <strong className="text-[#16794c] font-bold">{a.score}%</strong>
                    </div>
                    <div className="flex gap-2 text-[11px]">
                      <span className="text-[#16794c]">✓ {a.compliantCount}</span>
                      <span className="text-[#b7791f]">! {a.reviewRequiredCount}</span>
                    </div>
                    <Link
                      href={`/compliance/${a._id}`}
                      className="text-[#0b5f96] font-semibold text-[11px] hover:underline"
                    >
                      View Matrix →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#f8fafc] border-t border-[#edf1f4] text-center">
              <span className="text-xs text-[#63778b]">
                Powered by BIDSETU Multilayer AI Verification Engine
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
