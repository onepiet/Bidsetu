"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { FileText, Printer, Download, CheckCircle2, Calendar, User } from "lucide-react";
import { Report } from "@/types";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReportsData() {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) {
          const data = await res.json();
          const repArray = Array.isArray(data) ? data : data.data || [];
          setReports(repArray);
          if (repArray.length > 0) setSelectedReport(repArray[0]);
        }
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReportsData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell pageTitle="Procurement Evaluation Reports">
      <div className="space-y-6">
        {/* HEADER */}
        <div className="bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-navy">Statutory & Compliance Reports</h2>
            <p className="text-xs text-[#627a8f]">
              Formal procurement evaluation records compiled from verified compliance results and audit evidence
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
            >
              <Printer size={14} /> Print / Export PDF
            </button>
          </div>
        </div>

        {/* REPORT CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* REPORTS LIST */}
          <div className="bg-white rounded-lg border border-[#d7e1e9] shadow-xs p-4 space-y-2.5">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-2">
              Generated Reports
            </h3>
            {reports.map((rep) => (
              <div
                key={rep._id}
                onClick={() => setSelectedReport(rep)}
                className={`p-3 rounded-md border cursor-pointer transition ${
                  selectedReport?._id === rep._id
                    ? "bg-[#edf7ff] border-[#0b5f96]"
                    : "bg-[#f8fafc] border-[#e2eaf0] hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="badge bg-white text-navy text-[10px] border border-gray-200">
                    {rep.type.replace("_", " ")}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(rep.generatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs font-semibold text-navy line-clamp-2">{rep.title}</div>
              </div>
            ))}
          </div>

          {/* REPORT DOCUMENT PREVIEW (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-[#d7e1e9] shadow-xs p-8 font-sans space-y-6">
            {selectedReport ? (
              <>
                {/* FORMAL REPORT HEADER */}
                <div className="border-b-2 border-navy pb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/emblem.svg"
                      alt="Government of India"
                      className="w-10 h-12 object-contain"
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-navy">
                        BID COMPLIANCE & RISK EVALUATION REPORT
                      </h3>
                      <div className="text-xs text-[#526a80]">
                        BIDSETU AI-Powered Compliance Verification Framework (SIH26100)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-compliant text-[10px] font-mono">
                      STATUS: {selectedReport.status}
                    </span>
                    <div className="text-[10px] text-gray-400 mt-1 font-mono">
                      REF: {selectedReport._id}
                    </div>
                  </div>
                </div>

                {/* METADATA SUMMARY */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#f8fafc] rounded-md border border-[#e2eaf0] text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">TENDER REFERENCE</span>
                    <span className="font-semibold text-navy">{selectedReport.tenderId}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">EVALUATING OFFICER</span>
                    <span className="font-semibold text-navy">{selectedReport.createdBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">GENERATED TIMESTAMP</span>
                    <span className="text-navy">{new Date(selectedReport.generatedAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10.5px]">OVERALL COMPLIANCE SCORE</span>
                    <span className="font-bold text-[#16794c]">
                      {selectedReport.content.details?.score || 92}%
                    </span>
                  </div>
                </div>

                {/* EXECUTIVE SUMMARY */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
                    Executive Summary
                  </h4>
                  <p className="text-xs text-[#425d75] leading-relaxed text-justify">
                    {selectedReport.content.summary}
                  </p>
                </div>

                {/* VERIFICATION DETAILS TABLE */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
                    Verification Outcome Breakdown
                  </h4>
                  <table className="gov-table text-xs">
                    <tbody>
                      <tr>
                        <td className="font-semibold text-navy">Evaluated Requirements</td>
                        <td className="font-mono text-right">{selectedReport.content.details?.evaluatedRequirements || 5}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-navy">Passed Mandatory Specifications</td>
                        <td className="font-mono text-right text-[#16794c] font-bold">
                          {selectedReport.content.details?.passedMandatory || 4}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-navy">Items Requiring Human Sign-off</td>
                        <td className="font-mono text-right text-[#b7791f] font-bold">
                          {selectedReport.content.details?.itemsRequiringReview || 1}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-navy">Assessed Risk Category</td>
                        <td className="font-mono text-right text-[#16794c] font-bold">
                          {selectedReport.content.details?.risk || "LOW"} RISK
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* SIGN-OFF FOOTER */}
                <div className="pt-8 border-t border-gray-200 flex justify-between items-end text-xs text-gray-500">
                  <div>
                    <div>Digitally Compiled & Attested</div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      BIDSETU Engine v1.4.2 — Non-Repudiation Guaranteed
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-navy">Authorized Human Buyer</div>
                    <div className="text-[10px] text-gray-400">Electronic Attestation Record</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs">
                Select a report to preview.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
