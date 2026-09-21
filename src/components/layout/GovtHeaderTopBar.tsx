"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, ChevronDown, Accessibility } from "lucide-react";

export default function GovtHeaderTopBar() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };
  return (
    <div className="bg-gradient-to-r from-[#083655] via-[#0b426d] to-[#0b5f96] text-white h-[38px] px-3 sm:px-6 flex items-center justify-between border-b border-[#084f7e] select-none text-[11.5px] font-sans shadow-xs">
      {/* LEFT SECTION: EMBLEM OF INDIA + MEITY BRANDING + DIGITAL INDIA BADGE */}
      <div className="flex items-center gap-3.5">
        {/* EMBLEM & MINISTRY TITLE */}
        <div className="flex items-center gap-2">
          {/* HIGH-PRECISION EMBLEM OF INDIA VECTOR */}
          <svg className="w-5 h-6 shrink-0 text-white fill-current" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 6 C41 6 35 12 35 21 C35 27 39 31 43 34 C41 39 37 45 31 47 C27 43 21 43 17 47 C13 51 15 59 21 61 C25 63 29 61 33 57 C37 63 43 67 49 67 C55 67 61 63 65 57 C69 61 73 63 77 61 C83 59 85 51 81 47 C77 43 71 43 67 47 C61 45 57 39 55 34 C59 31 63 27 63 21 C63 12 57 6 48 6 Z" />
            <rect x="22" y="71" width="56" height="13" rx="2" />
            <circle cx="50" cy="77.5" r="4.5" fill="#0b5f96" />
            <path d="M16 88 H84 L79 98 H21 Z" />
            <text x="50" y="111" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">सत्यमेव जयते</text>
          </svg>

          <div className="leading-[1.15]">
            <div className="font-bold text-[11px] text-white tracking-tight whitespace-nowrap">
              Ministry of Electronics and
            </div>
            <div className="font-bold text-[11px] text-white tracking-tight whitespace-nowrap">
              Information Technology
            </div>
          </div>
        </div>

        {/* OFFICIAL DIGITAL INDIA LOGO BADGE */}
        <div className="hidden sm:flex items-center bg-white px-2.5 py-1 rounded-[5px] shadow-2xs">
          <svg width="74" height="20" viewBox="0 0 150 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Orange i-dot */}
            <circle cx="18" cy="8" r="5.5" fill="#f39a21" />
            {/* Blue i-stem */}
            <rect x="13" y="17" width="10" height="21" rx="1.5" fill="#0b426d" />
            {/* Digital Text */}
            <text x="30" y="19" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="15" fill="#0b426d" letterSpacing="-0.2">Digital</text>
            {/* India Text */}
            <text x="30" y="36" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="18" fill="#0b426d" letterSpacing="-0.4">India</text>
            {/* Indian Flag Arc */}
            <path d="M86 32 Q112 37 138 27" stroke="#f39a21" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M92 36 Q116 41 140 31" stroke="#229b68" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* RIGHT SECTION: ACCESSIBILITY, DARK MODE, ISL CHATBOT, LANGUAGE */}
      <div className="flex items-center gap-2">
        {/* ACCESSIBILITY TOOL BUTTON */}
        <button
          onClick={() => alert("Accessibility options: High Contrast & Screen Reader Mode Enabled.")}
          className="w-7 h-7 border border-white/20 hover:border-white/50 rounded-[4px] bg-[#07304f] hover:bg-[#052640] flex items-center justify-center transition-colors"
          title="Screen Reader & Accessibility Options"
        >
          <Accessibility size={15} className="text-white" />
        </button>

        {/* DARK MODE TOGGLE BUTTON */}
        <button
          onClick={toggleDarkMode}
          className="w-7 h-7 border border-white/20 hover:border-white/50 rounded-[4px] bg-[#07304f] hover:bg-[#052640] flex items-center justify-center transition-colors"
          title="Toggle Dark Mode"
        >
          {darkMode ? (
            <Sun size={14} className="text-[#f39a21]" />
          ) : (
            <Moon size={14} className="text-white fill-white/20" />
          )}
        </button>

        {/* ISL CHATBOT BADGE */}
        <div className="hidden sm:flex items-center bg-[#07304f] border border-white/20 rounded-[4px] overflow-hidden text-[11px] font-semibold">
          <span className="px-2.5 py-0.5 text-white tracking-tight">ISL Chatbot</span>
          <div className="bg-[#d9383a] px-1.5 py-1 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3l4 4-4 4" />
              <path d="M20 7H4" />
              <path d="M8 21l-4-4 4-4" />
              <path d="M4 17h16" />
            </svg>
          </div>
        </div>

        {/* LANGUAGE SELECTOR DROPDOWN */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#07304f] border border-white/20 rounded-[4px] text-white font-semibold text-[11.5px] pl-2.5 pr-7 py-0.5 focus:outline-none focus:border-white cursor-pointer appearance-none shadow-xs"
          >
            <option value="English" className="bg-[#0b426d] text-white">English</option>
            <option value="Hindi" className="bg-[#0b426d] text-white">हिन्दी</option>
            <option value="Tamil" className="bg-[#0b426d] text-white">தமிழ்</option>
            <option value="Marathi" className="bg-[#0b426d] text-white">मराठी</option>
            <option value="Gujarati" className="bg-[#0b426d] text-white">ગુજરાતી</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
