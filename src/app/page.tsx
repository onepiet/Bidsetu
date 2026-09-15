"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Scale,
  Users,
  Leaf,
  FileText,
  BarChart3,
  Lightbulb,
  Lock,
  ListChecks,
  TrendingUp,
  Settings,
  ClipboardCheck,
  Bell,
  FileCheck,
  ShieldAlert,
  Award,
  Calendar,
  Building2,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

import PublicLayout from "@/components/layout/PublicLayout";

export default function HomePage() {
  const [activeSector, setActiveSector] = useState<"statutory" | "central" | "state">("statutory");

  const [activeTenders] = useState([
    {
      id: "TND-2026-MNRE-0842",
      title: "Implementation of 500MW Grid-Connected Solar Photovoltaic & Energy Storage Infrastructure",
      dept: "Ministry of New & Renewable Energy",
      category: "Renewable Energy & Infrastructure",
      closingDate: "3/30/2026",
      status: "OPEN",
    },
    {
      id: "TND-2026-MEITY-0194",
      title: "Supply, Installation & Maintenance of Enterprise AI Cloud Computing Infrastructure",
      dept: "Ministry of Electronics & Information Technology",
      category: "IT & Cloud Services",
      closingDate: "4/15/2026",
      status: "OPEN",
    },
  ]);

  const categories = [
    {
      title: "Technical Compliance Matrix",
      desc: "Automated clause-by-clause parsing against GFR 2017 & tender mandates.",
      icon: FileCheck,
      bg: "bg-[#edf7ff]",
      text: "text-[#004e8a]",
      href: "/compliance",
    },
    {
      title: "DATASETU Statutory Audit",
      desc: "Real-time GSTIN active status, PAN validation, and Income Tax database verification.",
      icon: ShieldCheck,
      bg: "bg-[#e6f6ee]",
      text: "text-[#138808]",
      href: "/procurement",
    },
    {
      title: "Make in India & DCR Verification",
      desc: "Class-I/II local content percentage and Domestic Content Requirement (DCR) checks.",
      icon: Scale,
      bg: "bg-[#fff6e5]",
      text: "text-[#d97706]",
      href: "/guidelines",
    },
    {
      title: "Risk & Anomaly Intelligence",
      desc: "Detect bid-rigging collusion, blacklisting status, and financial red-flag alerts.",
      icon: ShieldAlert,
      bg: "bg-[#f3edf8]",
      text: "text-[#7c3aed]",
      href: "/risk",
    },
    {
      title: "MSE & Startup Exemptions",
      desc: "Udyam registration validation and automatic EMD fee waiver verification.",
      icon: Award,
      bg: "bg-[#e6f7ff]",
      text: "text-[#0284c7]",
      href: "/schemes",
    },
    {
      title: "Evidence Inspector & CVC Audit Trail",
      desc: "Immutable audit trail generation with exact page-level PDF snippet evidence.",
      icon: FileText,
      bg: "bg-[#fff0f2]",
      text: "text-[#e11d48]",
      href: "/audit-logs",
    },
  ];

  const sectorDetails = {
    statutory: {
      title: "Statutory Tax & Legal Entity Verification Network",
      subtitle: "Live DATASETU statutory API gateways for active GSTIN filing checks, PAN legal entity validation, and MCA corporate registration verification.",
      count: "18 Active Gateways",
      buttonText: "Explore Statutory Verification APIs →",
      href: "/procurement",
      barColor: "bg-[#f39a21]",
      bodies: [
        "GSTIN Active Filing API Gateway",
        "Income Tax PAN Legal Entity Lookup",
        "MCA Corporate CIN & Director Status",
        "Udyam MSE Registration Verification",
        "DPIIT Startup India Portal",
      ],
    },
    central: {
      title: "Central Government Ministries & Apex Bodies",
      subtitle: "Direct e-Procurement integration with central government buyer entities, GeM network, and CVC audit logging gateways.",
      count: "28 Union Ministries",
      buttonText: "Explore Central Ministry Networks →",
      href: "/partners",
      barColor: "bg-[#004e8a]",
      bodies: [
        "Ministry of Electronics & IT (MeitY)",
        "Ministry of New & Renewable Energy (MNRE)",
        "Central Public Procurement Portal (CPPP)",
        "Government e-Marketplace (GeM)",
        "Central Vigilance Commission (CVC)",
      ],
    },
    state: {
      title: "State & UT Procurement Nodes",
      subtitle: "Unified verification coverage across 28 State Procurement Boards, Public Works Departments (PWD), State DISCOMs, and Urban Local Bodies.",
      count: "2,423 State Nodes",
      buttonText: "Explore State Procurement Nodes →",
      href: "/procurement",
      barColor: "bg-[#229b68]",
      bodies: [
        "State PWD & Infrastructure Boards",
        "State Electricity Distribution Cos (DISCOMs)",
        "State Transport & Transit Authorities",
        "Commercial Tax & Revenue Departments",
        "State Public Service Commissions",
      ],
    },
  };

  return (
    <PublicLayout>
      {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-background"></div>

          <div className="hero-content page-container">
            <div className="hero-copy">
              <h1>
                Smarter Procurement
                <br />
                for a Stronger India
              </h1>

              <p>
                BIDSETU leverages AI to help procurement officials analyse
                tender and vendor documents, verify compliance requirements,
                identify discrepancies and assess risks with clear, explainable
                insights.
              </p>

              <div className="hero-actions">
                <Link className="btn btn-primary" href="/login">
                  Officer Login <ArrowRight size={16} />
                </Link>

                <Link className="btn btn-secondary" href="/vendor">
                  Vendor Login <ArrowRight size={16} />
                </Link>
              </div>

              <div className="trust-items">
                <div>
                  <ShieldCheck size={16} className="text-[#0b5f96]" /> Secure
                </div>
                <div>
                  <Scale size={16} className="text-[#0b5f96]" /> Transparent
                </div>
                <div>
                  <Users size={16} className="text-[#0b5f96]" /> Efficient
                </div>
                <div>
                  <Leaf size={16} className="text-[#0b5f96]" /> Citizen-Centric
                </div>
              </div>
            </div>

            <div className="hero-side-copy">
              <em>
                Digital Procurement
                <br />
                for a Developed India
              </em>
              <div className="tricolor-accent"></div>
            </div>
          </div>
        </section>

        {/* CATEGORIES & PROCUREMENT MODULES SECTION (UMANG & UDYAM STYLE GRID) */}
        <section className="py-14 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002b4d] tracking-tight">
                Categories & Intelligence Modules
              </h2>
              <p className="text-xs sm:text-sm text-[#5c6b73] mt-1.5 max-w-2xl leading-relaxed">
                BIDSETU provides automated AI-driven compliance, statutory verification, and risk auditing modules for government departments, procurement buyers, and registered bidders across India.
              </p>
            </div>
            <Link
              href="/procurement"
              className="btn btn-secondary text-xs py-2 px-4 bg-white border border-[#004e8a] text-[#004e8a] hover:bg-[#edf7ff] font-bold rounded-lg shrink-0 flex items-center gap-1.5 shadow-2xs"
            >
              Explore All 6 Modules <ArrowRight size={14} />
            </Link>
          </div>

          {/* 3-COLUMN x 2-ROW CATEGORY CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c, idx) => {
              const Icon = c.icon;
              return (
                <Link
                  key={idx}
                  href={c.href}
                  className="bg-white p-6 rounded-2xl border border-[#dce6f0] shadow-2xs hover:shadow-md hover:border-[#004e8a] transition-all flex items-start gap-4 group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#002b4d] text-base mb-1.5 group-hover:text-[#004e8a] transition-colors flex items-center gap-1">
                      <span>{c.title}</span>
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#004e8a]" />
                    </h3>
                    <p className="text-xs text-[#5c7287] leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* STATUTORY VERIFICATION NETWORK & GOVERNMENT API SECTION (TAILORED FOR BIDSETU) */}
        <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto bg-white rounded-3xl border border-[#dce6f0] shadow-2xs mb-14">
          <div className="space-y-2 mb-6">
            <span className="text-xs font-bold text-[#004e8a] uppercase tracking-wider">
              Connected Statutory Verification Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002b4d] tracking-tight">
              Government Ministries & Statutory Verification Network
            </h2>
            <p className="text-xs sm:text-sm text-[#5c7287] max-w-3xl leading-relaxed">
              Real-time DATASETU API verification gateways connecting central union ministries, state procurement portals, tax databases, and legal entity registries across India.
            </p>
          </div>

          {/* FILTER NAVIGATION TABS */}
          <div className="flex items-center gap-6 text-xs font-bold mb-8 border-b border-[#edf1f4] pb-3">
            <button
              onClick={() => setActiveSector("statutory")}
              className={`flex items-center gap-1 transition-colors ${activeSector === "statutory" ? "text-[#004e8a] font-black" : "text-[#5c7287] hover:text-[#004e8a]"}`}
            >
              <span>Statutory Tax & Legal APIs</span> <span className="text-[#004e8a]">→</span>
            </button>
            <button
              onClick={() => setActiveSector("central")}
              className={`flex items-center gap-1 transition-colors ${activeSector === "central" ? "text-[#004e8a] font-black" : "text-[#5c7287] hover:text-[#004e8a]"}`}
            >
              <span>Central Union Ministries</span> <span className="text-[#004e8a]">→</span>
            </button>
            <button
              onClick={() => setActiveSector("state")}
              className={`flex items-center gap-1 transition-colors ${activeSector === "state" ? "text-[#004e8a] font-black" : "text-[#5c7287] hover:text-[#004e8a]"}`}
            >
              <span>State & UT Networks</span> <span className="text-[#004e8a]">→</span>
            </button>
          </div>

          {/* 3 TOP SECTOR METRIC CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* STATUTORY TAX & LEGAL APIS CARD */}
            <div
              onClick={() => setActiveSector("statutory")}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                activeSector === "statutory"
                  ? "bg-[#edf7ff]/40 border-[#004e8a] shadow-md ring-1 ring-[#004e8a]/20"
                  : "bg-[#fafcfe] border-[#dce6f0] hover:bg-white"
              }`}
            >
              <div className="w-1.5 h-10 bg-[#f39a21] rounded-full shrink-0 mt-0.5"></div>
              <div>
                <h4 className="font-extrabold text-base text-[#002b4d]">Statutory & Tax Gateways</h4>
                <p className="text-xs font-semibold text-[#004e8a] mt-1">{sectorDetails.statutory.count}</p>
              </div>
            </div>

            {/* CENTRAL MINISTRIES CARD */}
            <div
              onClick={() => setActiveSector("central")}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                activeSector === "central"
                  ? "bg-[#edf7ff]/40 border-[#004e8a] shadow-md ring-1 ring-[#004e8a]/20"
                  : "bg-[#fafcfe] border-[#dce6f0] hover:bg-white"
              }`}
            >
              <div className="w-1.5 h-10 bg-[#004e8a] rounded-full shrink-0 mt-0.5"></div>
              <div>
                <h4 className="font-extrabold text-base text-[#002b4d]">Central Ministries</h4>
                <p className="text-xs font-semibold text-[#004e8a] mt-1">{sectorDetails.central.count}</p>
              </div>
            </div>

            {/* STATE & UT NODES CARD */}
            <div
              onClick={() => setActiveSector("state")}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                activeSector === "state"
                  ? "bg-[#edf7ff]/40 border-[#004e8a] shadow-md ring-1 ring-[#004e8a]/20"
                  : "bg-[#fafcfe] border-[#dce6f0] hover:bg-white"
              }`}
            >
              <div className="w-1.5 h-10 bg-[#229b68] rounded-full shrink-0 mt-0.5"></div>
              <div>
                <h4 className="font-extrabold text-base text-[#002b4d]">State & UT Nodes</h4>
                <p className="text-xs font-semibold text-[#004e8a] mt-1">{sectorDetails.state.count}</p>
              </div>
            </div>
          </div>

          {/* SELECTED SECTOR OVERVIEW CARD */}
          <div className="bg-[#fafcfe] p-7 rounded-2xl border border-[#dce6f0] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold text-[#004e8a] uppercase tracking-wider">
                  SELECTED VERIFICATION NETWORK
                </span>
                <h3 className="text-xl font-extrabold text-[#002b4d] mt-1">
                  {sectorDetails[activeSector].title}
                </h3>
                <p className="text-xs text-[#5c7287] mt-0.5">
                  {sectorDetails[activeSector].subtitle}
                </p>
              </div>

              <Link
                href={sectorDetails[activeSector].href}
                className="btn py-2.5 px-5 bg-[#004e8a] hover:bg-[#003866] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs shrink-0"
              >
                <span>{sectorDetails[activeSector].buttonText}</span>
              </Link>
            </div>

            {/* FEATURED PUBLISHING BODIES */}
            <div>
              <div className="text-[10px] font-extrabold text-[#7990a3] uppercase tracking-wider mb-3">
                INTEGRATED STATUTORY APIS & BODIES
              </div>
              <div className="flex flex-wrap gap-2.5">
                {sectorDetails[activeSector].bodies.map((body, i) => (
                  <span
                    key={i}
                    className="bg-white px-3.5 py-1.5 rounded-lg border border-[#dce6f0] text-xs font-bold text-[#002b4d] shadow-2xs hover:border-[#004e8a] hover:text-[#004e8a] transition-colors cursor-pointer"
                  >
                    {body}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LOWER GRID: HOW IT WORKS + LATEST TENDERS + ANNOUNCEMENTS */}
        <section className="pb-14 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
          {/* HOW IT WORKS PROCESS FLOW */}
          <div className="bg-white p-8 rounded-2xl border border-[#dce6f0] shadow-2xs">
            <div className="flex items-center justify-between mb-8 border-b border-[#edf1f4] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#002b4d]">How BIDSETU Works</h2>
                <p className="text-xs text-[#627a8f] mt-0.5">End-to-end automated bid submission & compliance verification pipeline</p>
              </div>
              <Link href="/how-it-works" className="text-xs font-bold text-[#004e8a] hover:underline flex items-center gap-1">
                Learn More <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
              <div className="space-y-2 p-3 rounded-xl bg-[#f8fafc] border border-[#e8f0f8]">
                <div className="w-10 h-10 rounded-full bg-[#004e8a] text-white font-black text-sm flex items-center justify-center mx-auto">1</div>
                <h4 className="font-bold text-xs text-[#002b4d]">Upload Dossier</h4>
                <p className="text-[11px] text-[#627a8f]">Tender mandate & multi-doc vendor filings</p>
              </div>

              <div className="space-y-2 p-3 rounded-xl bg-[#f8fafc] border border-[#e8f0f8]">
                <div className="w-10 h-10 rounded-full bg-[#004e8a] text-white font-black text-sm flex items-center justify-center mx-auto">2</div>
                <h4 className="font-bold text-xs text-[#002b4d]">AI OCR Parsing</h4>
                <p className="text-[11px] text-[#627a8f]">Extract text, numbers & certificates</p>
              </div>

              <div className="space-y-2 p-3 rounded-xl bg-[#f8fafc] border border-[#e8f0f8]">
                <div className="w-10 h-10 rounded-full bg-[#004e8a] text-white font-black text-sm flex items-center justify-center mx-auto">3</div>
                <h4 className="font-bold text-xs text-[#002b4d]">DATASETU API Audit</h4>
                <p className="text-[11px] text-[#627a8f]">Live GSTIN & PAN statutory checks</p>
              </div>

              <div className="space-y-2 p-3 rounded-xl bg-[#f8fafc] border border-[#e8f0f8]">
                <div className="w-10 h-10 rounded-full bg-[#004e8a] text-white font-black text-sm flex items-center justify-center mx-auto">4</div>
                <h4 className="font-bold text-xs text-[#002b4d]">Assess Risk Matrix</h4>
                <p className="text-[11px] text-[#627a8f]">Dynamic scoring & DCR violation flags</p>
              </div>

              <div className="space-y-2 p-3 rounded-xl bg-[#f8fafc] border border-[#e8f0f8]">
                <div className="w-10 h-10 rounded-full bg-[#004e8a] text-white font-black text-sm flex items-center justify-center mx-auto">5</div>
                <h4 className="font-bold text-xs text-[#002b4d]">CVC Audit Log</h4>
                <p className="text-[11px] text-[#627a8f]">Evidence snippets & final decision report</p>
              </div>
            </div>
          </div>

          {/* TWO-COLUMN PANEL: LATEST TENDERS & GAZETTE ANNOUNCEMENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LATEST ACTIVE TENDERS */}
            <div className="bg-white p-7 rounded-2xl border border-[#dce6f0] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#edf1f4] pb-3">
                <h3 className="text-lg font-bold text-[#002b4d] flex items-center gap-2">
                  <FileText className="text-[#004e8a]" size={20} /> Latest Procurement Tenders
                </h3>
                <Link href="/procurement" className="text-xs font-bold text-[#004e8a] hover:underline">
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                {activeTenders.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-[#e2eaf0] bg-[#fafcfe] hover:bg-white hover:border-[#bce0fd] transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="badge bg-[#edf7ff] text-[#004e8a] border border-[#bce0fd] text-[10.5px] font-bold">
                        {t.id}
                      </span>
                      <span className="badge bg-[#e6f6ee] text-[#138808] border border-[#c3f0b4] text-[10px] font-bold">
                        {t.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-[#002b4d] leading-snug">{t.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-[#627a8f]">
                      <span>{t.dept}</span>
                      <span className="flex items-center gap-1 font-medium"><Calendar size={12} /> Closes: {t.closingDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GAZETTE & ANNOUNCEMENTS */}
            <div className="bg-white p-7 rounded-2xl border border-[#dce6f0] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#edf1f4] pb-3">
                <h3 className="text-lg font-bold text-[#002b4d] flex items-center gap-2">
                  <Bell className="text-[#d97706]" size={20} /> Procurement Bulletins & Circulars
                </h3>
                <Link href="/guidelines" className="text-xs font-bold text-[#004e8a] hover:underline">
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-[#f5e6d3] bg-[#fffbf7] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#d97706] uppercase tracking-wider">GFR Rule 144(xi) Directive</span>
                    <span className="text-[10.5px] text-[#627a8f] font-medium">15 Sep 2026</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#002b4d]">DPIIT Land-Border Vendor Declaration Enforced</h4>
                  <p className="text-[11px] text-[#627a8f]">All bidders must attach verified DPIIT land-border certificate or self-declaration.</p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#dce6f0] bg-[#fafcfe] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#004e8a] uppercase tracking-wider">DATASETU Statutory Gateway</span>
                    <span className="text-[10.5px] text-[#627a8f] font-medium">14 Sep 2026</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#002b4d]">Real-Time GSTIN & PAN Verification Live</h4>
                  <p className="text-[11px] text-[#627a8f]">Pre-submission verification for GST filing status activated on Vendor Portal.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
    </PublicLayout>
  );
}
