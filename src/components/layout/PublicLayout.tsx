"use client";

import PublicHeaderNavbar from "./PublicHeaderNavbar";
import GovtFooter from "./GovtFooter";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* SHARED PUBLIC HEADER NAVBAR */}
      <PublicHeaderNavbar />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 bg-[#fafcfe]">{children}</main>

      {/* OFFICIAL GOVERNMENT FOOTER */}
      <GovtFooter />
    </div>
  );
}
