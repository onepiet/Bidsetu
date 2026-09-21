"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  Bell,
  FileCheck,
  ShieldAlert,
  Award,
  Calendar,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  Phone,
  Headphones,
  Zap,
  Globe2,
  Database,
  GitMerge,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Animated counter hook
───────────────────────────────────────────── */
function useCountUp(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

import PublicLayout from "@/components/layout/PublicLayout";

export default function HomePage() {
  const router = useRouter();
  const [activeSector, setActiveSector] = useState<"statutory" | "central" | "state">("statutory");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Intersection observer to trigger counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const verifications = useCountUp(487293, 1800, statsVisible);
  const tenders      = useCountUp(12847,  1800, statsVisible);
  const vendors      = useCountUp(34512,  1800, statsVisible);
  const departments  = useCountUp(1243,   1800, statsVisible);

  const benefitCards = [
    {
      icon: Database,
      title: "All Verifications at one place",
      tags: ["GSTIN Status", "PAN Lookup", "MCA / CIN", "Udyam MSE"],
    },
    {
      icon: FileCheck,
      title: "All Compliance Checks at one place",
      tags: ["GFR 2017", "DCR / Make-in-India", "Land Border", "EMD Waiver"],
    },
    {
      icon: GitMerge,
      title: "All Integrations at one place",
      tags: ["DATASETU APIs", "GeM Network", "CVC Audit", "CPPP Portal"],
    },
    {
      icon: BarChart3,
      title: "All Reports at one place",
      tags: ["Risk Score", "Audit Trail", "CVC Log", "Evidence PDF"],
    },
  ];

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

      {/* HERO SECTION WITH REALISTIC GOVERNMENT BUILDING BACKGROUND IMAGE */}
      <section className="hero">
        <div className="hero-background"></div>

        <div className="hero-content page-container">
          <div className="hero-copy">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00599f]/10 border border-[#00599f]/20 text-[#00599f] text-xs font-extrabold mb-3 backdrop-blur-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D96C24] animate-pulse"></span>
              Unified Public Procurement & AI Compliance Portal
            </div>

            <h1>
              Smarter Procurement
              <br />
              for a Developed India
            </h1>

            <p>
              BIDSETU leverages AI to help procurement officials analyze tender & vendor documents, verify compliance requirements, parse GFR 2017 mandates, and assess statutory risks with clear, explainable insights.
            </p>

            {/* PROMINENT SEARCH BAR (UMANG PILL SEARCH BOX) */}
            <div className="bg-white p-2 rounded-2xl border-2 border-[#00599f] shadow-lg flex items-center gap-2 max-w-xl my-4">
              <Search className="text-[#00599f] ml-3 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search Tenders, Statutory Gateways, GFR Rules..."
                className="w-full text-xs sm:text-sm text-[#1a1a1a] focus:outline-none placeholder-[#5f6368]"
              />
              <Link
                href="/procurement"
                className="bg-[#00599f] hover:bg-[#003c6c] text-white px-5 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Search</span>
                <ArrowRight size={14} />
              </Link>
            </div>

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
                <ShieldCheck size={16} className="text-[#00599f]" /> Secure
              </div>
              <div>
                <Scale size={16} className="text-[#00599f]" /> Transparent
              </div>
              <div>
                <Users size={16} className="text-[#00599f]" /> Efficient
              </div>
              <div>
                <Leaf size={16} className="text-[#00599f]" /> Citizen-Centric
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

      {/* ═══════════════════════════════════════════════════════════
          LIVE METRICS STATS BAR (UMANG KEY STATS STRIP ADAPTED)
          Clean white strip, 4 columns, vertical dividers, animated counters
      ════════════════════════════════════════════════════════════ */}
      <div ref={statsRef} className="bg-white border-b border-[#e8eef4]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#e8eef4]">
          {[
            {
              icon: ShieldCheck,
              label: "Verifications Completed",
              value: verifications.toLocaleString("en-IN"),
              sub: "Live statutory checks across GSTIN, PAN & MCA",
              color: "text-[#00599f]",
              bg: "bg-[#edf7ff]",
            },
            {
              icon: FileText,
              label: "Active Tenders Tracked",
              value: tenders.toLocaleString("en-IN"),
              sub: "Central & State procurement tenders monitored",
              color: "text-[#138808]",
              bg: "bg-[#e6f6ee]",
            },
            {
              icon: Building2,
              label: "Registered Vendors",
              value: vendors.toLocaleString("en-IN"),
              sub: "Vendors onboarded with verified statutory status",
              color: "text-[#d97706]",
              bg: "bg-[#fff6e5]",
            },
            {
              icon: Globe2,
              label: "Govt. Departments",
              value: departments.toLocaleString("en-IN"),
              sub: "Union Ministries & State bodies integrated",
              color: "text-[#7c3aed]",
              bg: "bg-[#f3edf8]",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex items-center gap-4 px-6 py-5 group">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className={`text-xl font-extrabold ${stat.color} tracking-tight leading-none`}>
                    {stat.value}
                  </div>
                  <div className="text-[13px] font-semibold text-[#1a1a1a] mt-0.5">{stat.label}</div>
                  <div className="text-[11px] text-[#5f6368] mt-0.5 leading-tight hidden lg:block">{stat.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

        {/* CATEGORIES — EXACT UMANG STYLE */}
        <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                Categories
              </h2>
              <p className="text-sm text-[#5c6b73] leading-relaxed">
                <span className="text-[#d96c24] font-medium">BIDSETU</span> has innumerable compliance modules and statutory verifications for government procurement. To ease the job of finding the right module relevant to your procurement process, we have categorised these into different groups.
              </p>
            </div>
            <Link
              href="/procurement"
              className="shrink-0 mt-1 inline-flex items-center border border-[#004e8a] text-[#004e8a] hover:bg-[#edf7ff] text-sm font-medium px-5 py-2 rounded-md transition-colors"
            >
              Explore 6 more categories
            </Link>
          </div>

          {/* 3×2 grid — UMANG card style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c, idx) => {
              const Icon = c.icon;
              return (
                <Link
                  key={idx}
                  href={c.href}
                  className="flex items-start gap-4 p-5 bg-white border border-[#e2e8f0] rounded-xl hover:bg-[#0057a8] hover:border-[#0057a8] transition-all duration-200 group cursor-pointer text-left w-full"
                >
                  {/* Large circular icon — turns white bg on hover */}
                  <div className={`w-14 h-14 rounded-full ${c.bg} ${c.text} group-hover:bg-white/20 group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200`}>
                    <Icon size={26} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#1a1a1a] group-hover:text-white text-sm mb-1.5 leading-snug transition-colors duration-200 flex items-center justify-between gap-2">
                      <span>{c.title}</span>
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 shrink-0 transition-opacity duration-200 text-white" />
                    </h3>
                    <p className="text-xs text-[#64748b] group-hover:text-white/80 leading-relaxed line-clamp-3 transition-colors duration-200">
                      {c.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* EXACT UMANG "SERVICES BY STATES" SECTION FROM SOURCE */}
        <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#edf2f7]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* LEFT GRAPHIC: EXACT UMANG FLOATING CARDS & ASYMMETRIC SHIELD */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-[400px] max-w-full h-[340px]">
                {/* BACKGROUND LIGHT BLUE SHIELD (UMANG EXACT ASPECT) */}
                <div className="absolute inset-y-4 left-6 right-6 bg-[#ebf4fa] rounded-[28px] -z-0"></div>

                {/* OVERLAID 2-COLUMN STAGGERED CARDS */}
                <div className="relative z-10 grid grid-cols-2 gap-5 h-full items-center px-2">
                  {/* LEFT COLUMN: DELHI & HARYANA */}
                  <div className="space-y-5 -translate-y-4">
                    {/* DELHI CARD */}
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                      <div className="w-14 h-14 rounded-full bg-[#e8f2fa] flex items-center justify-center mb-3 text-[#00599f]">
                        <svg className="w-9 h-9" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 42h24M15 42V18l9-5 9 5v24M18 42V26c0-3.3 2.7-6 6-6s6 2.7 6 6v16M15 18h18M18 14h12M20 10h8M22 6h4" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="24" cy="14" r="1.5" fill="currentColor"/>
                        </svg>
                      </div>
                      <span className="font-semibold text-sm text-[#1a1a1a]">Delhi</span>
                    </div>

                    {/* HARYANA CARD */}
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                      <div className="w-14 h-14 rounded-full bg-[#e8f2fa] flex items-center justify-center mb-3 text-[#00599f]">
                        <svg className="w-9 h-9" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M10 42h28M14 42V16M34 42V16M14 16l10-8 10 8M18 42V24c0-3.3 2.7-6 6-6s6 2.7 6 6v18M10 38h28M10 20h28" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="24" cy="12" r="2" fill="currentColor"/>
                        </svg>
                      </div>
                      <span className="font-semibold text-sm text-[#1a1a1a]">Haryana</span>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: GUJARAT & MAHARASHTRA (OFFSET DOWNWARDS) */}
                  <div className="space-y-5 translate-y-4">
                    {/* GUJARAT CARD */}
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                      <div className="w-14 h-14 rounded-full bg-[#e8f2fa] flex items-center justify-center mb-3 text-[#00599f]">
                        <svg className="w-9 h-9" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M8 42h32M11 42V22l13-8 13 8v20M17 42V28c0-3.9 3.1-7 7-7s7 3.1 7 7v14M11 22h26M14 17h20M17 12l7-4 7 4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="font-semibold text-sm text-[#1a1a1a]">Gujarat</span>
                    </div>

                    {/* MAHARASHTRA CARD */}
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                      <div className="w-14 h-14 rounded-full bg-[#e8f2fa] flex items-center justify-center mb-3 text-[#00599f]">
                        <svg className="w-9 h-9" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M6 42h36M9 42V16l15-6 15 6v26M16 42V24c0-4.4 3.6-8 8-8s8 3.6 8 8v18M9 20h30M9 16h30M13 12h22" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="font-semibold text-sm text-[#1a1a1a]">Maharashtra</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: EXACT UMANG TEXT & BUTTON */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] tracking-tight">
                Services by States
              </h2>

              <p className="text-[#5f6368] text-sm sm:text-base leading-relaxed max-w-md">
                Explore services offered by different States and Union Territories of India!
              </p>

              <div className="pt-2">
                <Link
                  href="/procurement"
                  className="inline-flex items-center justify-center bg-[#00599f] hover:bg-[#004278] text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Explore 30+ States
                </Link>
              </div>
            </div>
          </div>
        </section>

      {/* ═══════════════════════════════════════════════════════════
          BENEFITS OF BIDSETU — FULL-WIDTH UMANG STYLE BAND
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0057a8] w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0">

          {/* LEFT: TITLE + 2x2 WHITE CARDS */}
          <div className="lg:col-span-8 px-8 sm:px-12 py-10">
            <h2 className="text-2xl font-bold text-white mb-1">
              Benefits of BIDSETU
            </h2>
            <p className="text-[#c9ddec] text-sm mb-7 max-w-2xl leading-relaxed">
              An initiative by the Ministry of Finance &amp; NeGD, BIDSETU strives to be the single unified gateway for all Government Procurement verification, compliance checks, and statutory audit — across Central and State Government Departments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefitCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className="bg-white rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-9 h-9 rounded-lg bg-[#e8f3fd] flex items-center justify-center text-[#0057a8] mb-3">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-[#0057a8] font-semibold text-sm mb-3 leading-snug">
                      {card.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] text-[#444] px-2.5 py-0.5 rounded-full border border-[#d8d8d8] bg-white"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: OFFICER — transparent PNG, renders cleanly on blue bg */}
          <div className="lg:col-span-4 relative flex items-end justify-center overflow-hidden min-h-[420px]">
            <img
              src="/assets/bidsetu-officer-transparent.png"
              alt="BIDSETU procurement officer"
              className="absolute bottom-0 h-full w-auto max-w-none object-contain object-bottom"
            />
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

      {/* ═══════════════════════════════════════════════════════════
          "NEED HELP?" SUPPORT CALLOUT BANNER (UMANG helpline adapted)
      ════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════
          EXACT UMANG "NEED HELP WITH A SERVICE?" SUPPORT BANNER
      ════════════════════════════════════════════════════════════ */}
      <section className="pb-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-[#e2e8f0] rounded-[32px] p-8 sm:p-10 md:p-12 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* LEFT COLUMN: TEXT & HELPLINE BUTTON */}
              <div className="md:col-span-6 space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#0057a8] tracking-tight">
                  Need help with a service?
                </h2>
                <div className="text-[#475569] text-base sm:text-lg md:text-xl leading-relaxed space-y-1">
                  <p>We are available all days of the week from</p>
                  <p>10 am to 6 pm</p>
                </div>
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href="/support"
                    className="inline-flex items-center gap-2 bg-[#0057a8] hover:bg-[#004278] text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl transition-colors shadow-xs"
                  >
                    <Headphones size={18} />
                    <span>Contact Support</span>
                  </Link>
                  <a
                    href="tel:1800115252"
                    className="inline-flex items-center gap-2 border border-[#0057a8] text-[#0057a8] hover:bg-[#edf7ff] font-semibold text-sm sm:text-base px-5 py-3 rounded-xl transition-colors"
                  >
                    <Phone size={16} />
                    <span>Toll Free: 1800-11-5252</span>
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN: LARGER UMANG ILLUSTRATION */}
              <div className="md:col-span-6 flex justify-center md:justify-end">
                <svg
                  viewBox="0 0 460 250"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto max-w-[480px] md:max-w-[540px]"
                >
                  {/* Background circle & oval shapes */}
                  <circle cx="265" cy="130" r="100" fill="#eaf3fa" />
                  <circle cx="215" cy="85" r="50" fill="#eaf3fa" />

                  {/* Plant foliage drawings */}
                  <path d="M140 195 Q130 150 150 120" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  <path d="M138 165 Q118 160 123 150 Q135 155 138 165 Z" fill="#cbd5e1" opacity="0.6" />
                  <path d="M145 142 Q160 130 162 142 Q150 148 145 142 Z" fill="#cbd5e1" opacity="0.6" />

                  <path d="M365 195 Q375 150 355 120" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  <path d="M357 165 Q377 160 372 150 Q360 155 357 165 Z" fill="#cbd5e1" opacity="0.6" />

                  {/* Desk platform */}
                  <rect x="170" y="175" fill="#d9eafd" rx="6" width="170" height="20" />
                  <rect x="150" y="193" fill="#cbe2f9" rx="8" width="200" height="12" />

                  {/* Customer support agent */}
                  {/* Shirt & Cardigan */}
                  <path d="M232 130 L272 130 L276 175 L228 175 Z" fill="#c084fc" />
                  <path d="M224 135 C224 130 235 130 242 130 L240 175 L218 175 C218 160 218 142 224 135 Z" fill="#ea580c" />
                  <path d="M280 135 C280 130 269 130 262 130 L264 175 L286 175 C286 160 286 142 280 135 Z" fill="#ea580c" />

                  {/* Neck */}
                  <rect x="247" y="115" width="10" height="17" fill="#fca5a5" rx="3" />

                  {/* Head & Face */}
                  <circle cx="252" cy="100" r="17" fill="#fca5a5" />
                  {/* Hair */}
                  <path d="M234 96 C234 83 270 83 270 96 C270 91 265 83 252 83 C239 83 234 91 234 96 Z" fill="#1e293b" />
                  <path d="M234 94 C230 105 232 118 236 126 C238 123 236 105 236 96 Z" fill="#1e293b" />
                  <path d="M270 94 C274 105 272 118 268 126 C266 123 268 105 268 96 Z" fill="#1e293b" />

                  {/* Facial features */}
                  <circle cx="246" cy="98" r="1.6" fill="#1e293b" />
                  <circle cx="258" cy="98" r="1.6" fill="#1e293b" />
                  <path d="M248 105 Q252 109 256 105" stroke="#e11d48" strokeWidth="1.6" strokeLinecap="round" fill="none" />

                  {/* Yellow Headset */}
                  <path d="M233 96 C233 79 271 79 271 96" stroke="#f59e0b" strokeWidth="3.2" fill="none" />
                  <rect x="230" y="91" width="5" height="11" rx="2" fill="#f59e0b" />
                  <rect x="269" y="91" width="5" height="11" rx="2" fill="#f59e0b" />
                  <path d="M233 100 Q238 108 245 107" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  <circle cx="246" cy="107" r="2.2" fill="#f59e0b" />

                  {/* Laptop */}
                  <path d="M205 142 L259 142 L264 175 L200 175 Z" fill="#0057a8" />
                  <rect x="192" y="173" width="80" height="4" rx="2" fill="#003c6c" />
                  <circle cx="232" cy="157" r="3.2" fill="#ffffff" opacity="0.85" />

                  {/* TOP LEFT SPEECH BUBBLE (HELP!) */}
                  <g transform="translate(130, 18)">
                    <rect x="0" y="0" width="112" height="54" rx="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.2" />
                    {/* User Avatar */}
                    <circle cx="23" cy="27" r="11" fill="#93c5fd" />
                    <circle cx="23" cy="24" r="4.5" fill="#1e293b" />
                    <path d="M17 35 C17 31 29 31 29 35 Z" fill="#1e293b" />
                    {/* HELP Text */}
                    <text x="44" y="24" fill="#0057a8" fontSize="11" fontWeight="bold" fontFamily="sans-serif">HELP!</text>
                    {/* Skeleton lines */}
                    <line x1="44" y1="31" x2="94" y2="31" stroke="#cbd5e1" strokeWidth="2.8" strokeLinecap="round" />
                    <line x1="44" y1="38" x2="78" y2="38" stroke="#cbd5e1" strokeWidth="2.8" strokeLinecap="round" />
                    {/* Tail */}
                    <path d="M38 54 L48 63 L48 54 Z" fill="#ffffff" />
                  </g>

                  {/* TOP RIGHT RATING PILL */}
                  <g transform="translate(265, 30)">
                    <rect x="0" y="0" width="90" height="26" rx="13" fill="#bfdbfe" />
                    <text x="11" y="17" fill="#ffffff" fontSize="12.5" letterSpacing="2">★★★★★</text>
                  </g>

                  {/* MID-LEFT 8 HRS / 7 DAYS BADGE */}
                  <g transform="translate(115, 115)">
                    <rect x="0" y="0" width="96" height="24" rx="7" fill="#bfdbfe" />
                    <text x="8" y="16" fill="#0057a8" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">8 HRS / 7 DAYS</text>
                  </g>

                  {/* RIGHT SPEECH BUBBLE (THANKS!) */}
                  <g transform="translate(290, 92)">
                    <rect x="0" y="0" width="106" height="52" rx="14" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="1.2" />
                    {/* THANKS Text */}
                    <text x="14" y="23" fill="#0057a8" fontSize="11" fontWeight="bold" fontFamily="sans-serif">THANKS!</text>
                    {/* Skeleton lines */}
                    <line x1="14" y1="30" x2="62" y2="30" stroke="#93c5fd" strokeWidth="2.8" strokeLinecap="round" />
                    <line x1="14" y1="37" x2="48" y2="37" stroke="#93c5fd" strokeWidth="2.8" strokeLinecap="round" />
                    {/* User Avatar */}
                    <circle cx="82" cy="26" r="11" fill="#93c5fd" />
                    <circle cx="82" cy="23" r="4.5" fill="#1e293b" />
                    <path d="M76 34 C76 30 88 30 88 34 Z" fill="#1e293b" />
                    {/* Tail */}
                    <path d="M22 52 L17 58 L30 52 Z" fill="#dbeafe" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
