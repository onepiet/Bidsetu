"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp, ExternalLink } from "lucide-react";

export default function GovtFooter() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#e5f1fb] text-[#1f2937] pt-10 pb-6 px-4 sm:px-8 lg:px-12 select-none border-t border-[#d0e3f5] font-sans text-[12.5px]">
      <div className="max-w-7xl mx-auto">
        {/* MAIN FOOTER COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* COLUMN 1: GET TO KNOW & GRIEVANCE */}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-[13.5px] text-[#1f2937] mb-3 tracking-tight">
                Get to Know
              </h4>
              <ul className="space-y-2 text-[#374151]">
                <li>
                  <Link href="/privacy-policy" className="hover:text-[#004e8a] hover:underline transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-[#004e8a] hover:underline transition-colors">
                    Cancellation/Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-[#004e8a] hover:underline transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#004e8a] hover:underline transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/case-study" className="hover:text-[#004e8a] hover:underline transition-colors">
                    UMANG Case Study
                  </Link>
                </li>
              </ul>
            </div>

            <div className="pt-2 border-t border-[#cbdcf0]">
              <h4 className="font-bold text-[13.5px] text-[#1f2937] mb-3 tracking-tight">
                Grievance
              </h4>
              <ul className="space-y-2 text-[#374151]">
                <li>
                  <Link href="/cpgrams" className="hover:text-[#004e8a] hover:underline transition-colors flex items-center gap-1">
                    <span>CPGRAMS</span>
                    <ExternalLink size={11} className="text-[#6b7280]" />
                  </Link>
                </li>
                <li>
                  <Link href="/consumer-helpline" className="hover:text-[#004e8a] hover:underline transition-colors">
                    National Consumer Helpline
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div>
            <h4 className="font-bold text-[13.5px] text-[#1f2937] mb-3 tracking-tight">
              Quick Links
            </h4>
            <ul className="space-y-2 text-[#374151]">
              <li>
                <Link href="/about" className="hover:text-[#004e8a] hover:underline transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#004e8a] hover:underline transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-[#004e8a] hover:underline transition-colors">
                  Schemes
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-[#004e8a] hover:underline transition-colors">
                  Our Partners
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#004e8a] hover:underline transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/video-guide" className="hover:text-[#004e8a] hover:underline transition-colors">
                  Video Guide
                </Link>
              </li>
              <li>
                <Link href="/ebook" className="hover:text-[#004e8a] hover:underline transition-colors">
                  eBook
                </Link>
              </li>
              <li>
                <Link href="/user-manual" className="hover:text-[#004e8a] hover:underline transition-colors">
                  User Manual
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-[#004e8a] hover:underline transition-colors">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-[#004e8a] hover:underline transition-colors">
                  Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 & 4: USEFUL LINKS, PARTNER LOGOS & TEAM CREDITS */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h4 className="font-bold text-[13.5px] text-[#1f2937] mb-3.5 tracking-tight">
                Useful Links
              </h4>
              {/* CLEAN SINGLE-LINE FLEX CONTAINER FOR LOGOS */}
              <div className="flex items-center justify-between flex-wrap sm:flex-nowrap gap-3 sm:gap-4 bg-white px-5 py-3 rounded-2xl border border-[#cbe0f2] shadow-2xs">
                {/* NeGD LOGO */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-[#004e8a] flex items-center justify-center text-white text-[9.5px] font-black">
                    NeGD
                  </div>
                  <span className="text-[11px] font-extrabold text-[#003866] leading-tight">
                    National e-Governance Division
                  </span>
                </div>

                <div className="h-5 w-[1px] bg-[#dce6f0] hidden sm:block shrink-0"></div>

                {/* DIGITAL INDIA LOGO */}
                <div className="flex items-center gap-1 shrink-0">
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <span className="font-black text-[12px] text-[#00529b] leading-none">i</span>
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-[#FF9933] to-[#138808]"></span>
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[8px] font-semibold text-gray-500 uppercase">Digital</span>
                    <span className="text-[9.5px] font-black text-[#00529b]">India</span>
                  </div>
                </div>

                <div className="h-5 w-[1px] bg-[#dce6f0] hidden sm:block shrink-0"></div>

                {/* MYGOV LOGO */}
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[11.5px] font-extrabold text-[#0073b7]">my</span>
                  <span className="text-[11.5px] font-black text-[#e53935] uppercase tracking-tighter">GOV</span>
                  <span className="text-[9px] font-bold text-[#138808] leading-tight ml-0.5">मेरी सरकार</span>
                </div>

                <div className="h-5 w-[1px] bg-[#dce6f0] hidden sm:block shrink-0"></div>

                {/* INDIA.GOV.IN LOGO */}
                <div className="text-[11.5px] font-black text-[#004e8a] tracking-tight shrink-0">
                  india<span className="text-[#e53935]">.gov.in</span>
                </div>
              </div>
            </div>

            {/* TEAM CREDITS BADGE WITH ONEBUILDS & DEVELOPMENT TEAM LOGO */}
            <div className="flex items-center justify-end flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#cbe0f2] shadow-2xs text-[11.5px]">
                <span className="text-gray-500 font-medium">Developed by</span>
                <span className="font-extrabold text-[#004e8a]">OneBuilds and Development Team</span>
                <span className="badge bg-[#edf7ff] text-[#004e8a] border border-[#bce0fd] text-[10px] font-bold ml-1">
                  SIH26100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM LEGAL & DEVELOPER FOOTER */}
        <div className="pt-5 border-t border-[#cce0f2] text-center text-[11px] text-[#4b5563] leading-relaxed">
          <p className="max-w-4xl mx-auto">
            BIDSETU Platform is owned, designed & developed by <strong className="text-[#004e8a] font-bold">OneBuilds and Development Team</strong> (SIH26100). Powered by AI-Driven Procurement Compliance & Risk Intelligence.
          </p>
        </div>
      </div>

      {/* FLOATING UI CONTROLS */}
      {/* SCROLL-TO-TOP BUTTON (BOTTOM-LEFT) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 w-9 h-9 rounded-full bg-white text-[#004e8a] border border-[#bce0fd] shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          title="Scroll to Top"
        >
          <div className="w-6 h-6 rounded-full border border-[#004e8a]/40 flex items-center justify-center">
            <ArrowUp size={14} strokeWidth={2.5} className="text-[#004e8a]" />
          </div>
        </button>
      )}

      {/* VIRTUAL ASSISTANT FLOATING AVATAR (BOTTOM-RIGHT) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => alert("BIDSETU AI Helpdesk: Ask any question about tender filings, GST verification, or compliance rules.")}
          className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#004e8a] to-[#0b5f96] text-white shadow-lg hover:shadow-xl flex items-center justify-center relative border-2 border-white transition-transform hover:scale-105"
          title="Open AI Virtual Assistant"
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a5 5 0 015 5v3a5 5 0 01-10 0V7a5 5 0 015-5z" fill="currentColor" fillOpacity="0.2" />
            <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="3" />
          </svg>
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
        </button>
      </div>
    </footer>
  );
}
