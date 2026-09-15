"use client";

import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-[#edf7ff] text-[#004e8a] border border-[#bcdbfc] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Government Support Desk
          </span>
          <h1 className="text-3xl font-extrabold text-[#002b4d] mt-3 mb-4">
            Contact BIDSETU Support
          </h1>
          <p className="text-sm text-[#4a5568]">
            Have questions regarding tender compliance, DATASETU API integrations, or vendor onboarding?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CONTACT INFO */}
          <div className="bg-white p-7 rounded-2xl border border-[#dce6f0] shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-[#002b4d] border-b border-[#edf1f4] pb-3">
              Ministry Headquarters
            </h3>

            <div className="flex items-start gap-3.5 text-xs text-[#4a5568]">
              <MapPin size={18} className="text-[#004e8a] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-[#002b4d]">National e-Governance Division (NeGD)</strong>
                Electronics Niketan, 6 CGO Complex, Lodhi Road, New Delhi – 110003
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-xs text-[#4a5568]">
              <Phone size={18} className="text-[#004e8a] shrink-0" />
              <div>
                <strong className="block font-bold text-[#002b4d]">Toll-Free Helpline</strong>
                1800-11-0011 / +91 (011) 24301700
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-xs text-[#4a5568]">
              <Mail size={18} className="text-[#004e8a] shrink-0" />
              <div>
                <strong className="block font-bold text-[#002b4d]">Official Email</strong>
                support@bidsetu.gov.in / compliance@negd.gov.in
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-white p-7 rounded-2xl border border-[#dce6f0] shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 size={48} className="text-[#138808] mx-auto" />
                <h3 className="text-lg font-bold text-[#002b4d]">Grievance Inquiry Submitted</h3>
                <p className="text-xs text-[#5c6b73]">
                  Ticket reference #BST-2026-89412 generated. Our support desk will respond within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#002b4d] mb-1">Full Name</label>
                  <input required type="text" placeholder="e.g. Rajesh Kumar" className="w-full p-2.5 border border-[#cbd7e0] rounded focus:outline-none focus:ring-1 focus:ring-[#004e8a]" />
                </div>
                <div>
                  <label className="block font-semibold text-[#002b4d] mb-1">Official Email / Phone</label>
                  <input required type="email" placeholder="e.g. officer@mnre.gov.in" className="w-full p-2.5 border border-[#cbd7e0] rounded focus:outline-none focus:ring-1 focus:ring-[#004e8a]" />
                </div>
                <div>
                  <label className="block font-semibold text-[#002b4d] mb-1">Subject</label>
                  <input required type="text" placeholder="e.g. GST Statutory Verification Inquiry" className="w-full p-2.5 border border-[#cbd7e0] rounded focus:outline-none focus:ring-1 focus:ring-[#004e8a]" />
                </div>
                <div>
                  <label className="block font-semibold text-[#002b4d] mb-1">Message</label>
                  <textarea required rows={4} placeholder="Describe your inquiry..." className="w-full p-2.5 border border-[#cbd7e0] rounded focus:outline-none focus:ring-1 focus:ring-[#004e8a]" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-[#004e8a] hover:bg-[#003d70] text-white font-bold rounded flex items-center justify-center gap-2 transition-colors">
                  <Send size={14} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
