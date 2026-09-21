"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { Search, FileCheck, Calendar, ArrowRight } from "lucide-react";
import { Bid, Tender } from "@/types";

export default function BidsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bids, setBids] = useState<Bid[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBidsData() {
      try {
        const [bidsRes, tendersRes] = await Promise.all([
          fetch("/api/bids"),
          fetch("/api/tenders"),
        ]);
        if (bidsRes.ok) {
          const bJson = await bidsRes.json();
          setBids(Array.isArray(bJson) ? bJson : bJson.data || []);
        }
        if (tendersRes.ok) {
          const tJson = await tendersRes.json();
          setTenders(Array.isArray(tJson) ? tJson : tJson.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch bids", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBidsData();
  }, []);

  const filteredBids = bids.filter((b) => {
    const tender = tenders.find((t) => t._id === b.tenderId);
    return (
      b.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tender && tender.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <AppShell pageTitle="Submitted Bids Management">
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs">
          <div>
            <h2 className="text-base font-bold text-navy">Bid Evaluation Submissions</h2>
            <p className="text-xs text-[#627a8f]">
              Review vendor bids, examine submitted documentation, and initiate compliance verification
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by vendor name or tender title..."
            className="w-full h-10 pl-9 pr-4 text-xs border border-[#cbd7e0] rounded-md bg-white focus:outline-none focus:border-blue"
          />
          <Search size={15} className="absolute left-3 top-3 text-gray-400" />
        </div>

        {/* BIDS TABLE */}
        <div className="bg-white rounded-lg border border-[#d7e1e9] shadow-xs overflow-hidden">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Vendor Organization</th>
                <th>Target Tender</th>
                <th>Submission Date</th>
                <th>Bid Status</th>
                <th>Compliance Score</th>
                <th>Risk Profile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBids.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400 text-xs">
                    No vendor bids match your search.
                  </td>
                </tr>
              ) : (
                filteredBids.map((b) => {
                  const tender = tenders.find((t) => t._id === b.tenderId);
                  return (
                    <tr key={b._id}>
                      <td className="font-semibold text-navy">
                        <div>{b.vendorName}</div>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold">
                          BID ID: {b._id}
                        </span>
                      </td>
                      <td>
                        <div className="text-xs font-medium text-navy max-w-[280px] truncate">
                          {tender?.title || "Target Tender"}
                        </div>
                        <div className="text-[11px] text-[#0b5f96] font-mono font-semibold mt-0.5">
                          {tender?.tenderId}
                        </div>
                      </td>
                      <td className="text-xs text-gray-500 whitespace-nowrap">
                        <div className="flex flex-col text-[11.5px]">
                          <span className="font-medium text-slate-700">{new Date(b.submittedAt).toLocaleDateString()}</span>
                          <span className="text-[10.5px] text-slate-400 font-mono">{new Date(b.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-[#edf7ff] text-[#0b5f96] border border-[#bce0fd]">
                          {b.status.replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        {b.complianceScore !== undefined ? (
                          <span className="font-bold text-[#16794c]">{b.complianceScore}%</span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Pending Run</span>
                        )}
                      </td>
                      <td>
                        {b.riskLevel ? (
                          <span
                            className={`badge ${
                              b.riskLevel === "LOW"
                                ? "badge-risk-low"
                                : b.riskLevel === "MEDIUM"
                                ? "badge-risk-medium"
                                : "badge-risk-high"
                            }`}
                          >
                            {b.riskLevel}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td>
                        <Link
                          href={`/bids/${b._id}`}
                          className="text-xs text-[#0b5f96] font-semibold hover:underline flex items-center gap-1"
                        >
                          Review <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
