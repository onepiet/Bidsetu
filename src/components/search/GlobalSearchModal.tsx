"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  FileSpreadsheet,
  FileCheck,
  FolderOpen,
  ShieldAlert,
  Scale,
  Award,
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  FileText,
  Building2,
} from "lucide-react";

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: "Tenders" | "Guidelines" | "Documents" | "Workspace" | "Statutory";
  href: string;
  icon: any;
  badge?: string;
}

const SEARCH_DATABASE: SearchItem[] = [
  // Tenders
  {
    id: "tnd-1",
    title: "Implementation of 500MW Grid-Connected Solar Photovoltaic Infrastructure",
    description: "Ministry of New & Renewable Energy • EMD: ₹2.5 Cr • Deadline: Mar 30, 2026",
    category: "Tenders",
    href: "/tenders",
    icon: FileSpreadsheet,
    badge: "OPEN TENDER",
  },
  {
    id: "tnd-2",
    title: "Supply & Maintenance of Enterprise AI Cloud Infrastructure",
    description: "MeitY • High Security Compute • Deadline: Apr 15, 2026",
    category: "Tenders",
    href: "/tenders",
    icon: FileSpreadsheet,
    badge: "OPEN TENDER",
  },
  {
    id: "tnd-3",
    title: "Smart Grid Advanced Metering Infrastructure (AMI) & IoT Sensors",
    description: "Ministry of Power • Value: ₹120 Cr • Deadline: Apr 02, 2026",
    category: "Tenders",
    href: "/tenders",
    icon: FileSpreadsheet,
    badge: "OPEN TENDER",
  },
  {
    id: "tnd-4",
    title: "Medical Diagnostic Equipment & AI Imaging Systems",
    description: "Ministry of Health & Family Welfare • Pan-India AIIMS Supply",
    category: "Tenders",
    href: "/tenders",
    icon: FileSpreadsheet,
    badge: "OPEN TENDER",
  },

  // Guidelines & Statutory Compliance
  {
    id: "gfr-1",
    title: "GFR 2017 Rule 144(xi) Land Border Sharing Compliance Mandate",
    description: "Mandatory security clearance & competent authority registration for border sharing bidders",
    category: "Guidelines",
    href: "/guidelines",
    icon: Scale,
    badge: "GFR RULE",
  },
  {
    id: "mii-1",
    title: "Make in India Class-I & Class-II Local Content Verification",
    description: "Minimum 50% Class-I or 20% Class-II local content certificate requirements & DCR rules",
    category: "Guidelines",
    href: "/guidelines",
    icon: Scale,
    badge: "POLICY",
  },
  {
    id: "mse-1",
    title: "MSE & Startup Exemption Rules (Udyam Registration)",
    description: "Automatic Earnest Money Deposit (EMD) fee waiver & prior turnover criteria relaxation",
    category: "Statutory",
    href: "/schemes",
    icon: Award,
    badge: "EXEMPTION",
  },
  {
    id: "gst-1",
    title: "DATASETU Real-Time GSTIN & PAN Verification Engine",
    description: "Automated Goods & Services Tax Network (GSTN) active filing check & Income Tax PAN audit",
    category: "Statutory",
    href: "/procurement",
    icon: Building2,
    badge: "DATASETU API",
  },

  // Workspace & Platform Tools
  {
    id: "ws-1",
    title: "Procurement Dashboard & Analytics",
    description: "Overview of active bid evaluations, statutory verifications, and compliance metrics",
    category: "Workspace",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: "WORKSPACE",
  },
  {
    id: "ws-2",
    title: "Clause-by-Clause Compliance Matrix Evaluator",
    description: "AI-driven automated evaluation of technical proposals against GFR mandates",
    category: "Workspace",
    href: "/compliance",
    icon: FileCheck,
    badge: "AI ENGINE",
  },
  {
    id: "ws-3",
    title: "Optical Document Intelligence & OCR Bounding Box Inspector",
    description: "Interactive word-level confidence viewer & PaddleOCR bounding box evidence extractor",
    category: "Documents",
    href: "/documents",
    icon: FolderOpen,
    badge: "PADDLEOCR",
  },
  {
    id: "ws-4",
    title: "Enterprise Risk & Bid Collusion Anomaly Intelligence",
    description: "Detect bid-rigging patterns, shell company linkages, and CVC debarment red-flags",
    category: "Workspace",
    href: "/risk",
    icon: ShieldAlert,
    badge: "FRAUD RADAR",
  },
  {
    id: "ws-5",
    title: "CVC Audit Trail & Immutable Verification Logs",
    description: "SHA-256 integrity logs and Central Vigilance Commission compliant audit records",
    category: "Workspace",
    href: "/audit-logs",
    icon: FileText,
    badge: "AUDIT LOGS",
  },
];

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = SEARCH_DATABASE.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesQuery =
      query.trim() === "" ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleSelect = (href: string) => {
    onClose();
    if (query.trim() && href === "/tenders") {
      router.push(`/tenders?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(href);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex].href);
      } else if (query.trim()) {
        onClose();
        router.push(`/tenders?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const categories = ["All", "Tenders", "Guidelines", "Documents", "Workspace", "Statutory"];

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4 pb-6 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* INPUT HEADER */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search size={20} className="text-[#004e8a] shrink-0 mr-3" strokeWidth={2.2} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tenders, bids, GFR guidelines, GSTIN checks, or documents..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full mr-2"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-white overflow-x-auto scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full font-medium transition shrink-0 ${
                activeCategory === cat
                  ? "bg-[#004e8a] text-white shadow-xs font-semibold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SEARCH RESULTS LIST */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-slate-50">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition ${
                    isSelected
                      ? "bg-[#edf7ff] border border-[#bce0fd]"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 transition ${
                      isSelected
                        ? "bg-[#004e8a] text-white"
                        : "bg-slate-100 text-[#004e8a] group-hover:bg-[#004e8a] group-hover:text-white"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#004e8a] truncate">
                        {item.title}
                      </h4>
                      {item.badge && (
                        <span className="shrink-0 px-2 py-0.5 text-[9.5px] font-bold tracking-wider uppercase rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11.5px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <ArrowRight
                    size={15}
                    className={`shrink-0 self-center transition ${
                      isSelected
                        ? "text-[#004e8a] translate-x-0.5"
                        : "text-slate-300 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <BookOpen size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">
                No exact match found for &quot;{query}&quot;
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600">Enter</kbd> to search active tenders repository
              </p>
              {query.trim() && (
                <button
                  onClick={() => handleSelect("/tenders")}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#004e8a] text-white text-xs font-semibold rounded-lg hover:bg-[#003b6d] transition shadow-xs"
                >
                  <Search size={14} />
                  <span>Search All Tenders for &quot;{query}&quot;</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER HELPERS */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-mono">↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-mono">↵</kbd> Select
            </span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-[#004e8a]">
            <span>BIDSETU Intelligence Search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
