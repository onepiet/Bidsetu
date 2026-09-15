"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

import { DocumentRecord, ProcessingStage } from "@/types";
import {
  FolderOpen,
  Upload,
  CheckCircle2,
  Clock,
  FileText,
  FileCheck,
  AlertCircle,
  FileUp,
} from "lucide-react";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeStage, setActiveStage] = useState<ProcessingStage | null>(null);
  const [uploadStatusMsg, setUploadStatusMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stages: { stage: ProcessingStage; label: string; desc: string }[] = [
    { stage: "VALIDATING", label: "File Validation", desc: "MIME type, size & SHA-256 integrity" },
    { stage: "PARSING_OCR", label: "PDF/DOCX + OCR", desc: "Native layout parse & Optical Character Recognition" },
    { stage: "CLEANING", label: "Text Cleaning", desc: "Normalizing clauses & typography" },
    { stage: "STRUCTURED_DATA", label: "Structured Data", desc: "Machine-readable AST extraction" },
    { stage: "AI_ANALYSIS", label: "AI/NLP Matching", desc: "Semantic compliance embedding" },
  ];

  // Fetch documents from MongoDB Atlas via API
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch documents from MongoDB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setUploadStatusMsg(`Uploading ${file.name} to MongoDB Atlas...`);
    setActiveStage("VALIDATING");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tenderId", "tnd-001");
      formData.append("uploadedBy", "usr-ven-001");
      formData.append("organizationId", "org-ven-001");

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed on server");
      }

      const result = await response.json();
      const newDoc: DocumentRecord = result.document;

      // Animate stages smoothly for visual feedback
      const stageSequence: ProcessingStage[] = [
        "PARSING_OCR",
        "CLEANING",
        "STRUCTURED_DATA",
        "AI_ANALYSIS",
        "COMPLETED",
      ];

      for (let i = 0; i < stageSequence.length; i++) {
        const st = stageSequence[i];
        await new Promise((r) => setTimeout(r, 600));
        setActiveStage(st);
      }

      setUploadStatusMsg(`File "${file.name}" processed and stored in MongoDB Atlas!`);
      fetchDocuments();
    } catch (error: any) {
      console.error("Error uploading document:", error);
      setUploadStatusMsg(`Upload failed: ${error?.message || "Server error"}`);
    } finally {
      setUploading(false);
      setActiveStage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <AppShell pageTitle="Document Processing Pipeline">
      <div className="space-y-6">
        {/* PIPELINE HEADER & FILE UPLOAD ZONE */}
        <div className="bg-white p-6 rounded-lg border border-[#d7e1e9] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-navy flex items-center gap-2">
                <FileUp className="text-[#0b5f96]" size={20} />
                <span>Document Ingestion & Analysis Engine</span>
              </h2>
              <p className="text-xs text-[#627a8f] mt-1">
                Upload technical bids, compliance certificates, or tender PDFs. Documents are hashed (SHA-256), text-parsed, and saved directly into your MongoDB database.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-document-upload"
              />
              <label
                htmlFor="pdf-document-upload"
                className={`btn btn-primary text-xs flex items-center gap-2 py-2.5 px-5 cursor-pointer whitespace-nowrap ${
                  uploading ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                <Upload size={15} />
                <span>{uploading ? "Uploading to MongoDB..." : "Choose & Upload PDF Document"}</span>
              </label>
            </div>
          </div>

          {/* DRAG & DROP PROMPT BOX */}
          <label
            htmlFor="pdf-document-upload"
            className="block border-2 border-dashed border-[#b0c4de] hover:border-[#0b5f96] bg-[#f8fafc] hover:bg-[#edf7ff] p-6 rounded-lg text-center cursor-pointer transition-colors"
          >
            <Upload size={28} className="mx-auto text-[#0b5f96] mb-2" />
            <div className="text-xs font-bold text-navy">
              Click to browse or drag & drop PDF, DOCX, or TXT files here
            </div>
            <div className="text-[11px] text-[#627a8f] mt-1">
              Supports PDF documents up to 50MB. Text & metadata automatically extracted to MongoDB Atlas.
            </div>
          </label>

          {uploadStatusMsg && (
            <div className="p-3 bg-[#edf7ff] border border-[#0b5f96] text-[#0b5f96] rounded text-xs flex items-center gap-2 font-medium">
              <FileCheck size={16} />
              <span>{uploadStatusMsg}</span>
            </div>
          )}
        </div>

        {/* 5-STAGE VISUAL LIFECYCLE TRACKER */}
        <div className="bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs">
          <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-4">
            Active Processing Pipeline Architecture
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {stages.map((s, idx) => (
              <div
                key={s.stage}
                className={`p-3 rounded-lg border transition-all ${
                  activeStage === s.stage
                    ? "bg-[#edf7ff] border-[#0b5f96] shadow-sm"
                    : "bg-[#f8fafc] border-[#e2eaf0]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#0b5f96]">STEP 0{idx + 1}</span>
                  {activeStage === s.stage ? (
                    <Clock size={12} className="text-[#0b5f96] animate-spin" />
                  ) : (
                    <CheckCircle2 size={12} className="text-[#16794c]" />
                  )}
                </div>
                <div className="text-xs font-bold text-navy">{s.label}</div>
                <div className="text-[10.5px] text-[#55718a] mt-1 leading-tight">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DOCUMENTS TABLE FROM MONGODB */}
        <div className="bg-white rounded-lg border border-[#d7e1e9] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#edf1f4] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-navy">Processed Document Records (MongoDB Database)</h3>
              <p className="text-xs text-[#627a8f]">
                Live technical, legal, and compliance filings stored in your connected MongoDB cluster
              </p>
            </div>
            <span className="badge bg-[#edf7ff] text-[#0b5f96] text-xs font-mono font-bold">
              {documents.length} Records
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
              <Clock size={16} className="animate-spin text-[#0b5f96]" />
              <span>Loading documents from MongoDB Atlas...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              No documents found in database. Upload your first PDF above!
            </div>
          ) : (
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>MIME / Size</th>
                  <th>Pipeline Stage</th>
                  <th>Status</th>
                  <th>Uploaded At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-[#edf7ff] text-[#0b5f96] flex items-center justify-center flex-shrink-0">
                          <FileText size={15} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-navy">{doc.fileName}</div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            SHA256: {doc.sha256 ? `${doc.sha256.substring(0, 24)}...` : "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-gray-500">
                      <div>{doc.mimeType}</div>
                      <div className="text-[10px] text-gray-400">
                        {(doc.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-[#edf7ff] text-[#0b5f96] font-mono text-[10.5px]">
                        {doc.processing?.stage || "COMPLETED"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          doc.status === "PROCESSED"
                            ? "badge-compliant"
                            : doc.status === "PROCESSING"
                            ? "badge-review"
                            : "badge-noncompliant"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(doc.createdAt).toLocaleDateString()} {new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <Link
                        href={`/documents/${doc._id}/ocr`}
                        className="btn btn-secondary text-xs inline-flex items-center gap-1 py-1 px-2.5"
                      >
                        <FileCheck size={13} className="text-blue-600" />
                        <span>View Extracted Data</span>
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
