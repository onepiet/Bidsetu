"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { History, Shield, Lock, Search, Filter } from "lucide-react";
import { AuditLog } from "@/types";

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuditLogsData() {
      try {
        const res = await fetch("/api/audit-logs");
        if (res.ok) {
          const data = await res.json();
          setAuditLogs(Array.isArray(data) ? data : data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch audit logs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAuditLogsData();
  }, []);

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell pageTitle="System Audit & Security Logs">
      <div className="space-y-6">
        {/* HEADER */}
        <div className="bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-navy">Immutable Security & Activity Audit Log</h2>
            <p className="text-xs text-[#627a8f]">
              Tamper-evident record of all authentication events, tender actions, bid evaluations, and AI verifications
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#e6f6ee] text-[#16794c] px-3 py-1.5 rounded text-xs font-semibold">
            <Lock size={13} />
            <span>Cryptographically Verified</span>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by actor, action or resource..."
            className="w-full h-10 pl-9 pr-4 text-xs border border-[#cbd7e0] rounded-md bg-white focus:outline-none focus:border-blue"
          />
          <Search size={15} className="absolute left-3 top-3 text-gray-400" />
        </div>

        {/* AUDIT TABLE */}
        <div className="bg-white rounded-lg border border-[#d7e1e9] shadow-xs overflow-hidden">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Log ID & Timestamp</th>
                <th>Actor User</th>
                <th>Role</th>
                <th>Action & Operation</th>
                <th>Resource Target</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log._id}>
                  <td>
                    <div className="font-mono text-[11px] text-[#0b5f96] font-semibold">
                      {log._id}
                    </div>
                    <div className="text-[10.5px] text-gray-400 mt-0.5 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div className="font-medium text-navy text-xs">{log.actorName}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{log.actorUserId}</div>
                  </td>
                  <td>
                    <span className="badge bg-[#edf7ff] text-[#0b5f96] text-[10px]">
                      {log.actorRole.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-xs font-semibold text-navy">
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-gray-100 text-gray-700 text-[10.5px] font-mono">
                      {log.resourceType}: {log.resourceId}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-compliant text-[10.5px]">
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
