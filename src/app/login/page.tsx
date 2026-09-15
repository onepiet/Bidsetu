"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  FileText,
  BarChart3,
  Users,
  Sparkles,
  Building2,
  CheckCircle2,
} from "lucide-react";

import PublicLayout from "@/components/layout/PublicLayout";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("officer@mnre.gov.in");
  const [password, setPassword] = useState("officerPass2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleQuickSelect = (role: "OFFICER" | "VENDOR" | "ADMIN") => {
    setError("");
    if (role === "OFFICER") {
      setEmail("officer@mnre.gov.in");
      setPassword("officerPass2026");
    } else if (role === "VENDOR") {
      setEmail("tenders@tatapowerrenewable.com");
      setPassword("vendorPass2026");
    } else {
      setEmail("admin@bidsetu.gov.in");
      setPassword("adminPass2026");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email/username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      const user = data.user;
      const role = user.role;
      const name = user.profile?.fullName || user.email;
      const org = user.organizationId || "Government Organization";

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "bidsetu_session",
          JSON.stringify({
            userId: user._id,
            email: user.email,
            role,
            name,
            org,
            token: data.token,
            loginAt: new Date().toISOString(),
          })
        );
      }

      setLoading(false);
      if (role === "VENDOR") {
        router.push("/vendor");
      } else if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Failed to authenticate with server.");
    }
  };

  return (
    <PublicLayout>
      <div className="py-12 px-4 sm:px-6 relative overflow-hidden bg-slate-50 min-h-[calc(100vh-140px)] flex flex-col justify-center">
        {/* BACKGROUND DECORATIVE GLOWS */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none"></div>

        {/* MAIN CONTAINER */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 my-auto">
        {/* LEFT COLUMN: HERO MARKETING */}
        <div className="lg:col-span-4 space-y-6 hidden lg:block">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            <Sparkles size={14} /> SIH26100 AI Compliance Platform
          </div>

          <h1 className="text-4xl font-black text-navy leading-tight tracking-tight">
            Smarter Procurement.
            <br />
            <span className="text-blue-600">Stronger Governance.</span>
          </h1>

          <p className="text-sm text-gray-600 leading-relaxed">
            AI-powered compliance verification, optical character recognition evidence inspection, and risk intelligence for public and private sector tenders.
          </p>

          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-navy">Deterministic Rule Verification</h4>
                <p className="text-[11px] text-gray-500">Automatic validation of financial & statutory eligibility</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-navy">Human Officer Review Protocol</h4>
                <p className="text-[11px] text-gray-500">Final qualification decision remains with authorized officer</p>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: AUTHENTICATION CARD */}
        <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-gray-200 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-navy">Sign in to your account</h2>
            <p className="text-xs text-gray-500">Access your role-based workspace</p>
          </div>

          {/* QUICK ROLE SELECTOR BUTTONS */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block text-center">
              Quick Role Presets for Demo / Judging:
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl border border-gray-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleRoleQuickSelect("OFFICER")}
                className={`py-2 px-3 rounded-lg transition ${
                  email.includes("officer")
                    ? "bg-navy text-white shadow-sm"
                    : "text-gray-700 hover:bg-white"
                }`}
              >
                Officer
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickSelect("VENDOR")}
                className={`py-2 px-3 rounded-lg transition ${
                  email.includes("tatapower")
                    ? "bg-navy text-white shadow-sm"
                    : "text-gray-700 hover:bg-white"
                }`}
              >
                Vendor
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickSelect("ADMIN")}
                className={`py-2 px-3 rounded-lg transition ${
                  email.includes("admin")
                    ? "bg-navy text-white shadow-sm"
                    : "text-gray-700 hover:bg-white"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Official Email / Username</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@mnre.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-navy"
                />
                <span>Remember session</span>
              </label>

              <Link href="#" className="text-blue-600 font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-navy hover:bg-navy-dark text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                "Authenticating Session..."
              ) : (
                <>
                  <span>Sign In to BIDSETU Workspace</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-500">
            <span>New vendor? </span>
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: FEATURE CARDS */}
        <div className="lg:col-span-3 space-y-3 hidden lg:block">
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-xs space-y-1">
            <FileText size={20} className="text-blue-600" />
            <h3 className="text-xs font-bold text-navy">Document Intelligence</h3>
            <p className="text-[11px] text-gray-500">PyMuPDF digital parser & PaddleOCR scanned document extraction.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-xs space-y-1">
            <ShieldCheck size={20} className="text-emerald-600" />
            <h3 className="text-xs font-bold text-navy">Compliance Matrix</h3>
            <p className="text-[11px] text-gray-500">Clause-by-clause evaluation, statutory verification, and NLI check.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-xs space-y-1">
            <BarChart3 size={20} className="text-amber-600" />
            <h3 className="text-xs font-bold text-navy">Risk Intelligence</h3>
            <p className="text-[11px] text-gray-500">Anomalies, CPPP debarment checks, and immutable audit logs.</p>
          </div>
        </div>
      </div>
    </div>
  </PublicLayout>
  );
}
