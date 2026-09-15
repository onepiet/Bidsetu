"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { Tender, Bid } from "@/types";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function TenderDetailPage() {
  const params = useParams();
  const tenderId = params?.id as string;
  const [tender, setTender] = useState<Tender | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [tenderRes, bidsRes] = await Promise.all([
          fetch(`/api/tenders/${tenderId}`),
          fetch(`/api/bids`),
        ]);

        const tenderData = await tenderRes.json();
        const bidsData = await bidsRes.json();

        if (tenderData.success && tenderData.data) {
          setTender(tenderData.data);
        } else if (tenderData._id) {
          setTender(tenderData);
        } else {
          setError("Tender record could not be found.");
        }

        const allBids: Bid[] = bidsData.data || (Array.isArray(bidsData) ? bidsData : []);
        const targetTenderId = tenderData.data?._id || tenderData._id || tenderId;
        setBids(allBids.filter((b) => b.tenderId === targetTenderId || b.tenderId === tenderId));
      } catch (err: any) {
        console.error("Failed to fetch tender details:", err);
        setError("Failed to load tender details from database.");
      } finally {
        setLoading(false);
      }
    }

    if (tenderId) {
      fetchData();
    }
  }, [tenderId]);

  if (loading) {
    return (
      <AppShell pageTitle="Loading Tender...">
        <div className="flex items-center justify-center p-12 text-gray-500 gap-2">
          <Loader2 className="animate-spin text-[#0b5f96]" size={20} />
          <span className="text-xs font-semibold">Loading tender details from MongoDB...</span>
        </div>
      </AppShell>
    );
  }

  if (error || !tender) {
    return (
      <AppShell pageTitle="Tender Not Found">
        <div className="bg-white p-8 rounded-lg border border-[#d7e1e9] text-center max-w-lg mx-auto">
          <p className="text-gray-500 text-sm mb-4">{error || "Tender record could not be found."}</p>
          <Link href="/tenders" className="btn btn-primary text-xs">
            Return to Tenders List
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell pageTitle={`Tender Details — ${tender.tenderId}`}>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/tenders"
              className="p-1.5 bg-white border border-[#cbd7e0] rounded-md text-gray-500 hover:text-navy"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#0b5f96]">
                  {tender.tenderId}
                </span>
                <span className="badge bg-[#edf7ff] text-[#0b5f96] border border-[#bce0fd]">
                  {tender.status ? tender.status.replace("_", " ") : "PUBLISHED"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-navy mt-0.5">{tender.title}</h2>
            </div>
          </div>
        </div>

        {/* METADATA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-[#d7e1e9] shadow-xs">
            <span className="text-xs text-[#5e768b]">Category</span>
            <div className="text-sm font-semibold text-navy mt-1">{tender.category}</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#d7e1e9] shadow-xs">
            <span className="text-xs text-[#5e768b]">Published Date</span>
            <div className="text-sm font-semibold text-navy mt-1 flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>{tender.publication?.publishedAt ? new Date(tender.publication.publishedAt).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#d7e1e9] shadow-xs">
            <span className="text-xs text-[#5e768b]">Submission Deadline</span>
            <div className="text-sm font-semibold text-[#b42318] mt-1 flex items-center gap-1.5">
              <Calendar size={14} className="text-red-400" />
              <span>{tender.publication?.submissionDeadline ? new Date(tender.publication.submissionDeadline).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs">
          <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-2">
            Scope of Work & Specification
          </h3>
          <p className="text-xs text-[#4b6479] leading-relaxed">{tender.description}</p>
        </div>

        {/* ELIGIBILITY & REQUIREMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Eligibility */}
          <div className="bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-3">
              Eligibility Criteria
            </h3>
            <ul className="space-y-2 text-xs text-[#344e64]">
              {(tender.eligibilityCriteria || []).map((c, i) => (
                <li key={i} className="flex items-start gap-2 p-2 bg-[#f8fafc] rounded">
                  <CheckCircle size={14} className="text-[#16794c] mt-0.5 flex-shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Rules */}
          <div className="bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-3">
              Technical & Mandatory Rules ({(tender.technicalRequirements || []).length})
            </h3>
            <div className="space-y-2.5">
              {(tender.technicalRequirements || []).map((r) => (
                <div key={r._id} className="p-2.5 bg-[#f8fafc] rounded border border-[#edf2f7] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-navy">{r.title}</span>
                    <span className="badge bg-[#edf7ff] text-[#0b5f96] text-[10px]">
                      {r.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#55718a]">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUBMITTED VENDOR BIDS TABLE */}
        <div className="bg-white rounded-lg border border-[#d7e1e9] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#edf1f4] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-navy">Submitted Vendor Bids</h3>
              <p className="text-xs text-[#627a8f]">
                Submissions received from registered bidders for automated compliance review
              </p>
            </div>
            <span className="badge bg-[#edf7ff] text-[#0b5f96] text-xs font-semibold">
              {bids.length} Received
            </span>
          </div>

          {bids.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">
              No bids have been submitted for this tender yet.
            </div>
          ) : (
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Vendor Organization</th>
                  <th>Submission Date</th>
                  <th>Bid Status</th>
                  <th>Compliance Score</th>
                  <th>Risk Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((b) => (
                  <tr key={b._id}>
                    <td className="font-semibold text-navy">{b.vendorName}</td>
                    <td className="text-xs text-gray-500">
                      {new Date(b.submittedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="badge bg-[#edf7ff] text-[#0b5f96]">
                        {b.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      {b.complianceScore !== undefined ? (
                        <span className="font-bold text-[#16794c]">{b.complianceScore}%</span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Not Run</span>
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
                        className="text-xs text-[#0b5f96] font-semibold hover:underline"
                      >
                        Inspect Bid →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppShell>
  );
}

