"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { User, Lock, Bell, Shield, Check } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"PROFILE" | "SECURITY" | "NOTIFICATIONS">("PROFILE");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell pageTitle="Settings & User Preferences">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-5 rounded-lg border border-[#d7e1e9] shadow-xs">
          <h2 className="text-base font-bold text-navy">Account & Platform Settings</h2>
          <p className="text-xs text-[#627a8f]">
            Manage authorized credentials, communication preferences, and security factors
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
              <Check size={16} /> Changes saved successfully!
            </div>
          )}

          {activeTab === "PROFILE" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-navy mb-1">Full Name</label>
                  <input
                    defaultValue="Prayag Kaushik"
                    className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-navy mb-1">Official Email</label>
                  <input
                    defaultValue="officer@mnre.gov.in"
                    disabled
                    className="w-full h-9 px-3 border border-gray-200 bg-gray-50 text-gray-500 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-navy mb-1">Phone Number</label>
                  <input
                    defaultValue="+91 98110 44219"
                    className="w-full h-9 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-navy mb-1">Assigned Organization</label>
                  <input
                    defaultValue="Ministry of New and Renewable Energy"
                    disabled
                    className="w-full h-9 px-3 border border-gray-200 bg-gray-50 text-gray-500 rounded"
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
