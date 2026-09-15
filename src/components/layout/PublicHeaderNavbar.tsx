"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";
import GovtHeaderTopBar from "./GovtHeaderTopBar";

export default function PublicHeaderNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userSession, setUserSession] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bidsetu_session");
      if (saved) {
        try {
          setUserSession(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Procurement", href: "/procurement" },
    { name: "Guidelines", href: "/guidelines" },
    { name: "Help", href: "/help" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* TOP GOVERNMENT BAR (SCROLLS AWAY ON SCROLL) */}
      <GovtHeaderTopBar />

      {/* STICKY MAIN NAVBAR */}
      <header className="site-header sticky top-0 z-50 bg-white shadow-xs">
        <div className="header-brand">
          <Link href="/" className="flex items-center gap-3">
            <div className="government-brand">
              <img
                src="/assets/emblem.svg"
                alt="Government of India"
                className="w-[52px] h-[58px] object-contain"
              />
            </div>

            <div className="bidsetu-brand">
              <div className="bidsetu-logo">
                BIDSETU
                <div className="h-[3px] w-full bg-gradient-to-r from-[#f39a21] via-[#f39a21] to-[#229b68] mt-[-1px] rounded-sm"></div>
              </div>
              <div className="bidsetu-subtitle">
                AI-Powered Procurement
                <br />
                Compliance & Risk Intelligence Platform
              </div>
            </div>
          </Link>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="main-nav hidden lg:flex" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.name}
                href={link.href}
                className={isActive ? "active" : ""}
              >
                {link.name}
              </Link>
            );
          })}
          <span className="text-[#cbd7e0] font-light">|</span>
          <button
            className="search-button"
            aria-label="Search"
            onClick={() =>
              alert("Search BIDSETU Tenders, Bids, or GFR Compliance Guidelines...")
            }
          >
            <Search size={17} strokeWidth={2.2} />
          </button>
          {userSession ? (
            <Link
              className="login-button bg-[#004e8a] hover:bg-[#003b6d] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 text-xs shadow-xs"
              href={userSession.role === "VENDOR" ? "/vendor" : "/dashboard"}
            >
              <LayoutDashboard size={14} />
              <span>Workspace</span>
            </Link>
          ) : (
            <Link className="login-button" href="/login">
              Login
            </Link>
          )}
        </nav>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          className="lg:hidden p-2 text-[#002b4d] hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* MOBILE MENU DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-[112px] z-50 bg-black/50 lg:hidden flex justify-end">
            <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="text-xs font-bold text-[#627a8f] uppercase tracking-wider pb-2 border-b border-gray-100">
                  Navigation Menu
                </div>
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname === link.href || pathname.startsWith(link.href + "/");
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-sm py-2 px-3 rounded-lg font-medium transition ${
                          isActive
                            ? "bg-[#edf7ff] text-[#004e8a] font-bold"
                            : "text-[#36536d] hover:bg-slate-50 hover:text-[#004e8a]"
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    alert("Search BIDSETU Tenders, Bids, or GFR Compliance Guidelines...");
                  }}
                  className="w-full py-2.5 px-3 bg-slate-100 text-[#36536d] text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
                >
                  <Search size={15} /> Search Tenders & Guidelines
                </button>

                {userSession ? (
                  <Link
                    href={userSession.role === "VENDOR" ? "/vendor" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 bg-[#004e8a] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm"
                  >
                    <LayoutDashboard size={16} />
                    <span>Go to Workspace</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 bg-[#004e8a] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Sign In / Login</span>
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

