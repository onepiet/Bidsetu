"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { User, Lock, Bell, Shield, Check } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"PROFILE" | "SECURITY" | "NOTIFICATIONS">("PROFILE");

  const [profile, setProfile] = useState({
    name: "Prayag Kaushik",
    email: "officer@mnre.gov.in",
    phone: "+91 98110 44219",
    org: "Ministry of New & Renewable Energy",
    role: "PROCUREMENT_OFFICER",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSession = localStorage.getItem("bidsetu_session");
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          setProfile({
            name: parsed.name || (parsed.role === "VENDOR" ? "Ananya Deshmukh" : "Prayag Kaushik"),
            email: parsed.email || (parsed.role === "VENDOR" ? "ananya.d@tatapower.com" : "officer@mnre.gov.in"),
            phone: parsed.phone || "+91 98110 44219",
            org: parsed.org || (parsed.role === "VENDOR" ? "Tata Power Renewable Energy Limited" : "Ministry of New & Renewable Energy"),
            role: parsed.role || "PROCUREMENT_OFFICER",
          });
        } catch (e) {
          console.error(e);
        }
      } else if (window.location.pathname.includes("vendor")) {
        setProfile({
          name: "Ananya Deshmukh",
          email: "ananya.d@tatapower.com",
          phone: "+91 99580 44210",
          org: "Tata Power Renewable Energy Limited",
          role: "VENDOR",
        });
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const savedSession = localStorage.getItem("bidsetu_session");
      const current = savedSession ? JSON.parse(savedSession) : {};
      const updated = {
        ...current,
        name: profile.name,
        email: profile.email,
        org: profile.org,
        phone: profile.phone,
        role: profile.role,
      };
      localStorage.setItem("bidsetu_session", JSON.stringify(updated));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell pageTitle="Settings & User Preferences">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs">
          <h2 className="text-base font-bold text-navy">Account & Platform Settings</h2>
          <p className="text-xs text-[#627a8f]">
            Manage authorized credentials, communication preferences, and profile details for {profile.name}
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b border-[#dce4e9]">
          <button
            onClick={() => setActiveTab("PROFILE")}
            className={`py-2 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === "PROFILE"
                ? "border-[#0b5f96] text-[#0b5f96]"
                : "border-transparent text-gray-500 hover:text-navy"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("SECURITY")}
            className={`py-2 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === "SECURITY"
                ? "border-[#0b5f96] text-[#0b5f96]"
                : "border-transparent text-gray-500 hover:text-navy"
            }`}
          >
            Security & Credentials
          </button>
          <button
            onClick={() => setActiveTab("NOTIFICATIONS")}
            className={`py-2 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === "NOTIFICATIONS"
                ? "border-[#0b5f96] text-[#0b5f96]"
                : "border-transparent text-gray-500 hover:text-navy"
            }`}
          >
            Notifications
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSave} className="bg-white p-6 rounded-lg border border-[#d7e1e9] shadow-xs space-y-4 text-xs">
          {saved && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded font-semibold flex items-center gap-2">
              <Check size={16} /> Profile preferences for {profile.name} saved successfully!
            </div>
          )}

          {activeTab === "PROFILE" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-navy mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-navy mb-1">Official Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full h-9 px-3 border border-gray-200 bg-gray-50 text-gray-700 rounded font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-navy mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-navy mb-1">Assigned Organization</label>
                  <input
                    type="text"
                    value={profile.org}
                    onChange={(e) => setProfile({ ...profile, org: e.target.value })}
                    className="w-full h-9 px-3 border border-gray-200 bg-gray-50 text-gray-700 rounded font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "SECURITY" && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-navy mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full sm:w-1/2 h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-navy mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new strong password"
                    className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-navy mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "NOTIFICATIONS" && (
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue" />
                <span>Receive email alert when new vendor bids are submitted</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue" />
                <span>Receive notifications when AI compliance verification completes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue" />
                <span>Receive urgent alerts for high-risk discrepancy signals</span>
              </label>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button type="submit" className="btn btn-primary text-xs px-5">
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
