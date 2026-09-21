"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck,
  FolderOpen,
  ShieldAlert,
  BarChart4,
  FileText,
  History,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  UserCheck,
  ExternalLink,
} from "lucide-react";

import GovtHeaderTopBar from "./GovtHeaderTopBar";
import GlobalSearchModal from "../search/GlobalSearchModal";
import AskBidsetuFloatingWidget from "../common/AskBidsetuFloatingWidget";

interface AppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function AppShell({ children, pageTitle }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [userSession, setUserSession] = useState(() => {
    if (typeof window !== "undefined") {
      const isVendor = window.location.pathname.startsWith("/vendor");
      return isVendor
        ? {
            name: "Ananya Deshmukh",
            role: "VENDOR",
            email: "ananya.d@tatapower.com",
            org: "Tata Power Renewable Energy Limited",
          }
        : {
            name: "Prayag Kaushik",
            role: "PROCUREMENT_OFFICER",
            email: "officer@mnre.gov.in",
            org: "Ministry of New & Renewable Energy",
          };
    }
    return {
      name: "Prayag Kaushik",
      role: "PROCUREMENT_OFFICER",
      email: "officer@mnre.gov.in",
      org: "Ministry of New & Renewable Energy",
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bidsetu_session");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUserSession((prev) => ({
            ...prev,
            ...parsed,
          }));
        } catch (e) {
          console.error(e);
        }
      } else if (pathname.startsWith("/vendor")) {
        setUserSession({
          name: "Ananya Deshmukh",
          role: "VENDOR",
          email: "ananya.d@tatapower.com",
          org: "Tata Power Renewable Energy Limited",
        });
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("bidsetu_session");
    }
    router.push("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: userSession.role === "VENDOR" ? "/vendor" : "/dashboard",
      icon: LayoutDashboard,
    },
    { name: "Tenders", href: "/tenders", icon: FileSpreadsheet },
    { name: "Bids", href: "/bids", icon: FileCheck },
    { name: "Documents", href: "/documents", icon: FolderOpen },
    { name: "Compliance Analysis", href: "/compliance", icon: FileCheck },
    { name: "Risk & Insights", href: "/risk", icon: ShieldAlert },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Audit Logs", href: "/audit-logs", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7fa]">
      {/* TOP GOVERNMENT OF INDIA BANNER */}
      <GovtHeaderTopBar />

      <div className="app-shell flex flex-1">
      {/* SIDEBAR */}
      <aside className="app-sidebar hidden lg:flex">
        <div className="app-sidebar-header">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/assets/emblem.svg"
              alt="Government of India"
              className="w-[36px] h-[42px] object-contain"
            />
            <div>
              <div className="font-extrabold text-[20px] text-navy leading-none">
                BIDSETU
                <div className="h-[2.5px] w-full bg-gradient-to-r from-[#f39a21] via-[#f39a21] to-[#229b68] mt-0.5 rounded-sm"></div>
              </div>
              <div className="text-[10px] text-[#55718a] mt-1 font-medium leading-tight">
                Compliance Intelligence
              </div>
            </div>
          </Link>
        </div>

        <nav className="app-sidebar-nav">
          <div className="px-3 py-2 text-[10.5px] font-bold tracking-wider text-[#7990a3] uppercase">
            Procurement Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "/vendor" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* USER PROFILE IN SIDEBAR */}
        <div className="p-3 border-t border-[#e2eaf0] bg-[#fafcfe]">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#dce5ed]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#edf7ff] border border-[#bce0fd] flex items-center justify-center text-navy font-bold text-xs">
                {userSession.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-navy truncate">
                  {userSession.name}
                </div>
                <div className="text-[10px] text-[#627a8f] truncate">
                  {userSession.role.replace("_", " ")}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded transition"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative w-64 max-w-[80%] bg-white flex flex-col h-full shadow-2xl z-10">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="font-extrabold text-xl text-navy">BIDSETU</div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`nav-item ${isActive ? "active" : ""}`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full btn btn-secondary text-xs flex items-center justify-center gap-2"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN APPLICATION CONTAINER */}
      <div className="app-main flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="app-header">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-[17px] font-bold text-navy leading-tight">
                {pageTitle || "Procurement Operations Workspace"}
              </h1>
              <div className="text-[11.5px] text-[#5e778d] flex items-center gap-1.5">
                <span>{userSession.org}</span>
                <span>•</span>
                <span className="text-[#16794c] font-medium">SIH26100 Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-[#f0f5fa] hover:bg-[#e4ee6a]/20 border border-[#d8e2ec] hover:border-[#004e8a] px-3 py-1.5 rounded-md text-xs text-[#526d85] hover:text-[#004e8a] transition cursor-pointer"
            >
              <Search size={14} />
              <span>Search tenders, bids, or clauses...</span>
              <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded">
                Ctrl K
              </kbd>
            </button>

            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#f39a21] rounded-full"></span>
            </button>

            <div className="h-6 w-[1px] bg-gray-200"></div>

            <Link
              href="/"
              target="_blank"
              className="hidden md:flex items-center gap-1 text-xs text-[#0b5f96] font-medium hover:underline"
            >
              <span>Public Portal</span>
              <ExternalLink size={12} />
            </Link>

            <span className="badge bg-[#edf7ff] text-[#0b5f96] border border-[#bcdbfc] text-[11px] font-semibold">
              {userSession.role === "PROCUREMENT_OFFICER"
                ? "Buyer"
                : userSession.role === "VENDOR"
                ? "Bidder"
                : "Admin"}
            </span>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="app-content">{children}</main>

        {/* COMPACT FOOTER */}
        <footer className="app-footer">
          <div className="flex items-center gap-2">
            <strong className="text-navy font-bold">BIDSETU</strong>
            <span>•</span>
            <span>AI-Powered Procurement Compliance & Risk Intelligence Platform</span>
          </div>
          <div>© 2026 BIDSETU • Developed by OneBuilds and Development Team</div>
        </footer>
      </div>
    </div>

    {/* GLOBAL SEARCH MODAL */}
    <GlobalSearchModal
      isOpen={searchModalOpen}
      onClose={() => setSearchModalOpen(false)}
    />
  </div>
);
}
