"use client";

import { useEffect, useState, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import { History, Shield, Lock, Search, Filter, RefreshCw, UserCheck, Building2, CheckCircle2, Clock } from "lucide-react";
import { AuditLog } from "@/types";

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const [filterMode, setFilterMode] = useState<"MY_LOGS" | "ORG_LOGS" | "SYSTEM">("MY_LOGS");

  const [activeUser, setActiveUser] = useState({
    userId: "usr-ven-001",
    name: "Ananya Deshmukh",
    role: "VENDOR",
    org: "Tata Power Renewable Energy Limited",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSession = localStorage.getItem("bidsetu_session");
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          setActiveUser({
            userId: parsed.userId || (parsed.role === "VENDOR" ? "usr-ven-001" : "usr-off-001"),
            name: parsed.name || (parsed.role === "VENDOR" ? "Ananya Deshmukh" : "Prayag Kaushik"),
            role: parsed.role || "VENDOR",
            org: parsed.org || (parsed.role === "VENDOR" ? "Tata Power Renewable Energy Limited" : "Ministry of New & Renewable Energy"),
          });
        } catch (e) {
          console.error(e);
        }
      } else if (window.location.pathname.includes("vendor")) {
        setActiveUser({
          userId: "usr-ven-001",
          name: "Ananya Deshmukh",
          role: "VENDOR",
          org: "Tata Power Renewable Energy Limited",
        });
      }
    }
  }, []);

  const fetchAuditLogsData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      
      const queryParams = new URLSearchParams({
        userId: activeUser.userId,
        role: activeUser.role,
        organizationId: activeUser.org,
        mode: filterMode,
      });

      const res = await fetch(`/api/audit-logs?${queryParams.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const logsData = Array.isArray(json) ? json : json.data || [];
        setAuditLogs(logsData);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  }, [activeUser, filterMode]);

  // Initial fetch and Real-Time 3s Polling Loop
  useEffect(() => {
    fetchAuditLogsData();
    const timer = setInterval(() => {
      fetchAuditLogsData(false);
    }, 3000); // Poll every 3 seconds for live real-time sync

    return () => clearInterval(timer);
  }, [fetchAuditLogsData]);

  const filteredLogs = auditLogs.filter((log) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      (log.action && log.action.toLowerCase().includes(term)) ||
      (log.actorName && log.actorName.toLowerCase().includes(term)) ||
      (log.resourceType && log.resourceType.toLowerCase().includes(term)) ||
      (log.resourceId && log.resourceId.toLowerCase().includes(term)) ||
      (log._id && log._id.toLowerCase().includes(term))
    );
  });

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case "USER_LOGIN":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "BID_SUBMITTED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
      case "DOCUMENT_UPLOADED":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "OCR_RESULT_VIEWED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "COMPLIANCE_EVALUATED":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "TENDER_PUBLISHED":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <AppShell pageTitle="System Audit & Security Logs">
      <div className="space-y-6">
        {/* HEADER BANNER WITH REAL-TIME LIVE PULSE INDICATOR */}
        <div className="bg-white p-5 rounded-xl border border-[#d7e1e9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Real-Time Live Sync (3s Auto-Poll)
              </span>
              {lastSyncTime && (
                <span className="text-[11px] text-slate-400 font-mono">
                  Synced at {lastSyncTime}
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-navy">Immutable Security & Activity Audit Log</h2>
            <p className="text-xs text-[#627a8f]">
              Tamper-evident record of your authentication events, document uploads, bid evaluations, and AI verifications
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => fetchAuditLogsData(true)}
              disabled={refreshing}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#004e8a] rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin text-[#004e8a]" : "text-[#004e8a]"} />
              <span>Refresh Feed</span>
            </button>
            <div className="flex items-center gap-1.5 bg-[#e6f6ee] text-[#16794c] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#bce0fd]">
              <Lock size={13} />
              <span>SHA-256 Tamper Proof</span>
            </div>
          </div>
        </div>

        {/* ACTIVE USER FILTER BADGE & FILTER MODES */}
        <div className="bg-white p-4 rounded-xl border border-[#d7e1e9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <UserCheck size={16} className="text-[#004e8a]" />
            <span className="text-slate-500">Filtered for:</span>
            <span className="font-extrabold text-navy bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              {activeUser.name} ({activeUser.userId} • {activeUser.role})
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterMode("MY_LOGS")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterMode === "MY_LOGS"
                  ? "bg-[#004e8a] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              My Activity Logs ({activeUser.name.split(" ")[0]})
            </button>
            <button
              onClick={() => setFilterMode("ORG_LOGS")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterMode === "ORG_LOGS"
                  ? "bg-[#004e8a] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Organization Audit Trail
            </button>
            {activeUser.role === "ADMIN" && (
              <button
                onClick={() => setFilterMode("SYSTEM")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  filterMode === "SYSTEM"
                    ? "bg-[#004e8a] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All System Logs
              </button>
            )}
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by action (e.g. BID_SUBMITTED), actor name, or resource ID..."
            className="w-full h-10 pl-9 pr-4 text-xs border border-[#cbd7e0] rounded-xl bg-white focus:outline-none focus:border-[#004e8a] focus:ring-2 focus:ring-[#004e8a]/20 shadow-2xs font-medium"
          />
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
        </div>

        {/* AUDIT TABLE */}
        <div className="bg-white rounded-xl border border-[#d7e1e9] shadow-xs overflow-hidden">
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                    Fetching real-time audit logs from MongoDB Atlas...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                    No activity logs found for {activeUser.name} under current filter ({filterMode}).
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const dateObj = new Date(log.createdAt || Date.now());
                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const formattedTime = dateObj.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  return (
                    <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                      <td>
                        <div className="font-mono text-[11px] text-[#004e8a] font-bold">
                          {log._id}
                        </div>
                        <div className="text-[10.5px] text-slate-500 font-medium mt-0.5 whitespace-nowrap flex items-center gap-1">
                          <Clock size={11} className="text-slate-400" />
                          <span>{formattedDate} at {formattedTime}</span>
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold text-navy text-xs">{log.actorName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.actorUserId}</div>
                      </td>
                      <td>
                        <span className="badge bg-[#edf7ff] text-[#004e8a] border border-[#bce0fd] text-[10px] font-bold">
                          {log.actorRole ? log.actorRole.replace("_", " ") : "USER"}
                        </span>
                      </td>
                      <td>
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${getActionBadgeClass(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-slate-100 text-slate-700 text-[10.5px] font-mono border border-slate-200">
                          {log.resourceType}: {log.resourceId}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-compliant text-[10.5px] font-bold">
                          {log.result}
                        </span>
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
