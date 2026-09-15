"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { Search, Plus, Filter, Calendar, FileText } from "lucide-react";
import { Tender } from "@/types";

export default function TendersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTenders() {
      try {
        const res = await fetch("/api/tenders");
        if (res.ok) {
          const data = await res.json();
          setTenders(Array.isArray(data) ? data : data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch tenders", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTenders();
  }, []);

  const filteredTenders = tenders.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tenderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppShell pageTitle="Tender Management">
      <div className="space-y-6">
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs">
          <div>
            <h2 className="text-base font-bold text-navy">Procurement Tenders</h2>
            <p className="text-xs text-[#627a8f]">
              Manage tenders, define requirements, and evaluate submitted vendor bids
            </p>
          </div>
          <Link
            href="/tenders/new"
            className="btn btn-primary text-xs flex items-center gap-1.5 py-2 px-4 whitespace-nowrap"
          >
            <Plus size={16} />
            <span>Create New Tender</span>
          </Link>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by tender title, ID or category..."
              className="w-full h-10 pl-9 pr-4 text-xs border border-[#cbd7e0] rounded-md bg-white focus:outline-none focus:border-[#0b5f96]"
            />
            <Search size={15} className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 text-xs border border-[#cbd7e0] rounded-md bg-white text-[#344d64] focus:outline-none focus:border-[#0b5f96]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="UNDER_EVALUATION">Under Evaluation</option>
              <option value="AWARDED">Awarded</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* TENDERS TABLE */}
        <div className="bg-white rounded-lg border border-[#d7e1e9] shadow-xs overflow-hidden">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Tender ID</th>
                <th>Title & Category</th>
                <th>Status</th>
                <th>Submission Deadline</th>
                <th>Requirements</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 text-xs">
                    No tenders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTenders.map((t) => (
                  <tr key={t._id}>
                    <td className="font-semibold text-[#0b5f96] whitespace-nowrap">
                      {t.tenderId}
                    </td>
                    <td>
                      <div className="font-medium text-navy text-xs">{t.title}</div>
                      <div className="text-[11px] text-[#647c91] mt-0.5">{t.category}</div>
                    </td>
                    <td>
                      <span className="badge bg-[#edf7ff] text-[#0b5f96] border border-[#bce0fd]">
                        {t.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="text-xs text-[#526a80] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        <span>{t.publication?.submissionDeadline ? new Date(t.publication.submissionDeadline).toLocaleDateString() : "N/A"}</span>
                      </div>
                    </td>
                    <td className="text-xs text-[#355069] font-medium">
                      {t.technicalRequirements.length} Defined
                    </td>
                    <td>
                      <Link
                        href={`/tenders/${t._id}`}
                        className="text-xs text-[#0b5f96] font-semibold hover:underline"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
