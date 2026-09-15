"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import {
  FileText,
  Search,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Building2,
  DollarSign,
  Calendar,
  Briefcase,
  Wrench,
  ShieldCheck,
  ExternalLink,
  Layers,
  Sparkles,
  Award,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { OCRResult, StructuredOCRField, ExtractedCategory } from "@/types";

export default function DocumentOCRPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params?.id as string;

  const [ocrData, setOcrData] = useState<OCRResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [reprocessing, setReprocessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // View state
  const [activeTab, setActiveTab] = useState<"extracted" | "raw" | "metadata">("extracted");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [rawSearchQuery, setRawSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (documentId) {
      fetchOCRData();
    }
  }, [documentId]);

  const fetchOCRData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/documents/${documentId}/ocr`);
      const json = await res.json();
      if (res.ok && json.success) {
        setOcrData(json.data);
      } else {
        setError(json?.error?.message || "Failed to load OCR data.");
      }
    } catch (err: any) {
      setError("Network error: Could not fetch document OCR data.");
    } finally {
      setLoading(false);
    }
  };

  const handleReprocess = async () => {
    setReprocessing(true);
    try {
      const res = await fetch(`/api/documents/${documentId}/ocr`, { method: "POST" });
      const json = await res.json();
      if (res.ok && json.success) {
        setOcrData(json.data);
      } else {
        alert(json?.error?.message || "Reprocessing failed.");
      }
    } catch (err) {
      alert("Network error: Could not reprocess OCR.");
    } finally {
      setReprocessing(false);
    }
  };

  const handleViewSource = (pageNumber: number) => {
    setSelectedPage(pageNumber);
    setActiveTab("raw");
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (category: ExtractedCategory) => {
    switch (category) {
      case "IDENTITY":
        return <Building2 size={16} className="text-blue-600" />;
      case "FINANCIAL":
        return <DollarSign size={16} className="text-emerald-600" />;
      case "DATES":
        return <Calendar size={16} className="text-purple-600" />;
      case "EXPERIENCE":
        return <Briefcase size={16} className="text-amber-600" />;
      case "TECHNICAL":
        return <Wrench size={16} className="text-indigo-600" />;
      case "REGISTRATION":
        return <ShieldCheck size={16} className="text-teal-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  const categories = [
    { id: "ALL", label: "All Categories" },
    { id: "IDENTITY", label: "Identity" },
    { id: "FINANCIAL", label: "Financial" },
    { id: "DATES", label: "Dates" },
    { id: "EXPERIENCE", label: "Experience" },
    { id: "TECHNICAL", label: "Technical" },
    { id: "REGISTRATION", label: "Statutory & Registration" },
  ];

  const filteredFields = (ocrData?.structuredFields || []).filter((field) => {
    if (categoryFilter === "ALL") return true;
    return field.category === categoryFilter;
  });

  const currentPageObj = ocrData?.pages?.find((p) => p.pageNumber === selectedPage) || ocrData?.pages?.[0];

  return (
    <AppShell pageTitle="OCR Extracted Intelligence">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BREADCRUMB & ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-500 hover:text-navy hover:bg-gray-100 rounded-lg transition"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                <FileText size={22} className="text-blue-600" />
                {ocrData?.documentName || "Document Intelligence"}
              </h2>
              <p className="text-xs text-[#5e778d]">
                Persisted OCR & Structured Feature Extraction • ID: {documentId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReprocess}
              disabled={reprocessing}
              className="btn btn-secondary text-xs flex items-center gap-2"
            >
              <RefreshCw size={14} className={reprocessing ? "animate-spin" : ""} />
              {reprocessing ? "Reprocessing..." : "Re-run Extraction"}
            </button>

            {ocrData?.bidId && (
              <Link
                href={`/bids/${ocrData.bidId}`}
                className="btn btn-primary text-xs flex items-center gap-1.5"
              >
                <Sparkles size={14} />
                <span>Run AI Verification</span>
              </Link>
            )}
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <div className="card p-12 text-center space-y-3">
            <RefreshCw size={32} className="animate-spin text-blue-600 mx-auto" />
            <h3 className="text-base font-semibold text-navy">Extracting Document Data...</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Please wait while BIDSETU retrieves structured features and optical text recognition details.
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="card p-8 bg-red-50 border border-red-200 text-center space-y-4">
            <AlertTriangle size={36} className="text-red-500 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-red-800">Unable to Display OCR Data</h3>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
            <button onClick={fetchOCRData} className="btn btn-secondary text-xs inline-flex items-center gap-2">
              <RefreshCw size={14} /> Retry Fetching
            </button>
          </div>
        )}

        {!loading && !error && ocrData && (
          <>
            {/* DOCUMENT OVERVIEW METRICS CARD */}
            <div className="card p-5 bg-white border border-[#dce5ed] rounded-xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-gray-100">
                <div className="pr-3">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        ocrData.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : ocrData.status === "FAILED"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      <CheckCircle2 size={13} />
                      {ocrData.status}
                    </span>
                  </div>
                </div>

                <div className="px-3">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">OCR Confidence</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-navy">
                      {Math.round((ocrData.overallConfidence || 0.95) * 100)}%
                    </span>
                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.round((ocrData.overallConfidence || 0.95) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="px-3">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Pages Processed</span>
                  <div className="text-lg font-bold text-navy mt-1 flex items-center gap-1.5">
                    <Layers size={18} className="text-blue-500" />
                    {ocrData.pagesProcessed || ocrData.pages?.length || 1} Pages
                  </div>
                </div>

                <div className="pl-3">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Extracted Fields</span>
                  <div className="text-lg font-bold text-navy mt-1 flex items-center gap-1.5">
                    <Award size={18} className="text-amber-500" />
                    {ocrData.structuredFields?.length || 0} Fields
                  </div>
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("extracted")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 ${
                    activeTab === "extracted"
                      ? "bg-navy text-white shadow-sm"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <Sparkles size={14} /> Extracted Data ({ocrData.structuredFields?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("raw")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 ${
                    activeTab === "raw"
                      ? "bg-navy text-white shadow-sm"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <FileText size={14} /> Raw OCR Text ({ocrData.pages?.length || 1} Pages)
                </button>
                <button
                  onClick={() => setActiveTab("metadata")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 ${
                    activeTab === "metadata"
                      ? "bg-navy text-white shadow-sm"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <Hash size={14} /> Metadata & Engine
                </button>
              </div>
            </div>

            {/* TAB 1: EXTRACTED STRUCTURED DATA */}
            {activeTab === "extracted" && (
              <div className="space-y-4">
                {/* CATEGORY FILTER PILLS */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                        categoryFilter === cat.id
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* FIELDS GRID */}
                {filteredFields.length === 0 ? (
                  <div className="card p-10 text-center text-gray-500 text-xs">
                    No structured fields extracted under category '{categoryFilter}'.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFields.map((field, idx) => (
                      <div
                        key={`${field.key}-${idx}`}
                        className="card p-4 bg-white border border-[#e2eaf0] rounded-xl hover:border-blue-300 transition shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                              {getCategoryIcon(field.category)}
                              {field.category}
                            </span>
                            <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {Math.round((field.confidence || 0.9) * 100)}% Conf
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-gray-700">{field.label}</h4>
                          <div className="text-sm font-extrabold text-navy mt-1 break-words">
                            {String(field.value)} {field.unit ? <span className="text-xs font-normal text-gray-500">{field.unit}</span> : ""}
                          </div>

                          {field.source?.textReference && (
                            <p className="text-[11px] text-gray-500 italic mt-2 line-clamp-2 bg-gray-50 p-2 rounded border border-gray-100">
                              "{field.source.textReference}"
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-gray-400 font-medium">
                            Source: Page {field.source?.page || 1}
                          </span>
                          <button
                            onClick={() => handleViewSource(field.source?.page || 1)}
                            className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            <span>View Source</span>
                            <ExternalLink size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: RAW OCR TEXT */}
            {activeTab === "raw" && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* PAGE SELECTOR SIDEBAR */}
                <div className="card p-4 bg-white border border-[#dce5ed] rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Page Navigator</h3>
                  <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                    {(ocrData.pages || []).map((page) => (
                      <button
                        key={page.pageNumber}
                        onClick={() => setSelectedPage(page.pageNumber)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                          selectedPage === page.pageNumber
                            ? "bg-navy text-white font-bold"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span>Page {page.pageNumber}</span>
                        <span className="text-[10px] opacity-80">{Math.round((page.confidence || 0.9) * 100)}%</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PAGE TEXT DISPLAY */}
                <div className="lg:col-span-3 card p-6 bg-white border border-[#dce5ed] rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="badge bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                        Page {selectedPage} of {ocrData.pages?.length || 1}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        Confidence: {Math.round((currentPageObj?.confidence || 0.9) * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search on page..."
                          value={rawSearchQuery}
                          onChange={(e) => setRawSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy w-48"
                        />
                      </div>

                      <button
                        onClick={() => handleCopyText(currentPageObj?.text || "")}
                        className="btn btn-secondary text-xs flex items-center gap-1.5"
                      >
                        {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        <span>{copied ? "Copied" : "Copy Page"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] border border-gray-200 rounded-lg p-5 font-mono text-xs text-gray-800 leading-relaxed whitespace-pre-wrap max-h-[550px] overflow-y-auto">
                    {currentPageObj?.text ? (
                      currentPageObj.text
                    ) : (
                      <span className="text-gray-400 italic">No text extracted on page {selectedPage}.</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: EXTRACTION METADATA & ENGINE AUDIT */}
            {activeTab === "metadata" && (
              <div className="card p-6 bg-white border border-[#dce5ed] rounded-xl space-y-6">
                <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                  <Hash size={16} className="text-blue-600" />
                  Engine Specifications & Technical Provenance
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Document ID:</span>
                      <span className="font-mono text-gray-900 font-bold">{ocrData.documentId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Tender ID:</span>
                      <span className="font-mono text-gray-900 font-bold">{ocrData.tenderId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Organization ID:</span>
                      <span className="font-mono text-gray-900 font-bold">{ocrData.organizationId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">MIME Type:</span>
                      <span className="font-mono text-gray-900 font-bold">{ocrData.mimeType || "application/pdf"}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">OCR Engine Version:</span>
                      <span className="badge bg-blue-50 text-blue-700 font-mono font-bold">
                        {ocrData.ocrVersion || "v2.1-pdfparse"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">AI Feature Extraction Model:</span>
                      <span className="badge bg-purple-50 text-purple-700 font-mono font-bold">
                        {ocrData.extractionModel || "gemini-flash-1.5"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Processing Completed At:</span>
                      <span className="text-gray-900 font-medium">{ocrData.processedAt || "Just now"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
