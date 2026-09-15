import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIDSETU — AI-Powered Procurement Compliance & Risk Intelligence Platform",
  description:
    "Smarter Procurement for a Stronger India. AI-assisted procurement compliance verification, evidence inspection, and risk analysis for authorized personnel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
