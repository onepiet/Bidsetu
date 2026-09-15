"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  User,
  Mail,
  FileText,
  ShieldCheck,
  BarChart3,
  Bell,
} from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    orgName: "",
    orgType: "PRIVATE_ENTERPRISE",
    regNumber: "",
    address: "",
    city: "",
    state: "Delhi",
    pinCode: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const indianStates = [
    "Select state",
    "Andhra Pradesh",
    "Assam",
    "Bihar",
    "Delhi",
    "Gujarat",
    "Haryana",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Tamil Nadu",
    "Telangana",
    "Uttar Pradesh",
    "West Bengal",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.orgName ||
      !formData.regNumber ||
      !formData.address ||
      !formData.city ||
      !formData.pinCode ||
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError("Please fill out all required fields marked with an asterisk (*).");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the Terms of Use and Privacy Policy.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Store session
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "bidsetu_session",
          JSON.stringify({
            email: formData.email,
            role: "VENDOR",
            name: formData.fullName,
            org: formData.orgName,
            loginAt: new Date().toISOString(),
          })
        );
      }
      setTimeout(() => {
        router.push("/vendor");
      }, 1000);
    }, 600);
  };

  return (
    <PublicLayout>
      <div className="py-8 bg-slate-50 min-h-[calc(100vh-140px)]">

      {/* REGISTRATION 3-COLUMN LAYOUT */}
      <div className="registration-layout my-auto">
        {/* LEFT MARKETING SECTION */}
        <section className="registration-marketing">
          <h1>
            Partnering
            <br />
            for a Transparent
            <br />
            and Efficient India
          </h1>

          <div className="orange-line"></div>

          <p>
            BIDSETU enables vendors to participate
            <br />
            in government procurement with
            <br />
            simplified documentation and
            <br />
            AI-powered compliance verification.
          </p>

          <blockquote>
            “Building trust between
            <br />
            government and industry
            <br />
            through technology.”
          </blockquote>

          <div className="fair-values">
            Fair &nbsp; | &nbsp; Transparent &nbsp; | &nbsp; Accountable
          </div>
        </section>

        {/* CENTER REGISTRATION CARD */}
        <section className="registration-card">
          <div className="auth-brand">
            <strong className="font-extrabold text-[36px] text-navy tracking-tight">
              BIDSETU
            </strong>
            <div className="w-[58px] h-[3px] bg-gradient-to-r from-[#f39a21] to-[#229b68] mx-auto mt-[-2px] rounded-sm"></div>
            <span>
              AI-Powered Procurement Compliance
              <br />
              & Risk Intelligence Platform
            </span>
          </div>

          <h2>Create your vendor account</h2>
          <p className="auth-subtitle">
            Join BIDSETU to participate in government tenders.
          </p>

          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-3 p-2 bg-green-50 border border-green-200 text-green-700 text-xs rounded">
              Vendor account created successfully! Redirecting to vendor portal...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h3>Organization Information</h3>

            <div className="form-grid two-columns">
              <div className="field">
                <label>Organization Name *</label>
                <div className="relative">
                  <input
                    value={formData.orgName}
                    onChange={(e) =>
                      setFormData({ ...formData, orgName: e.target.value })
                    }
                    placeholder="Enter organization name"
                    required
                  />
                  <Building2
                    size={14}
                    className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="field">
                <label>Organization Type *</label>
                <select
                  value={formData.orgType}
                  onChange={(e) =>
                    setFormData({ ...formData, orgType: e.target.value })
                  }
                  required
                >
                  <option value="PRIVATE_ENTERPRISE">Private Enterprise</option>
                  <option value="PUBLIC_SECTOR">Public Sector Undertaking (PSU)</option>
                  <option value="MSME">Micro, Small & Medium Enterprise (MSME)</option>
                  <option value="GOVERNMENT">Government Corporation</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Registration / Identification Number *</label>
              <input
                value={formData.regNumber}
                onChange={(e) =>
                  setFormData({ ...formData, regNumber: e.target.value })
                }
                placeholder="Enter registration number (e.g. CIN / GSTIN / Udyam)"
                required
              />
            </div>

            <div className="field">
              <label>Business Address *</label>
              <div className="relative">
                <input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter full address"
                  required
                />
                <MapPin
                  size={14}
                  className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="form-grid three-columns">
              <div className="field">
                <label>City *</label>
                <input
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="field">
                <label>State *</label>
                <select
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  required
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>PIN Code *</label>
                <input
                  value={formData.pinCode}
                  onChange={(e) =>
                    setFormData({ ...formData, pinCode: e.target.value })
                  }
                  placeholder="Enter PIN code"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <hr />

            <h3>Primary Contact</h3>

            <div className="form-grid two-columns">
              <div className="field">
                <label>Full Name *</label>
                <div className="relative">
                  <input
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Enter full name"
                    required
                  />
                  <User
                    size={14}
                    className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="field">
                <label>Official Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="you@organization.gov.in"
                    required
                  />
                  <Mail
                    size={14}
                    className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="field phone-field">
              <label>Phone Number *</label>
              <div>
                <span>+91</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <hr />

            <h3>Account Security</h3>

            <div className="form-grid two-columns">
              <div className="field password-field">
                <label>Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="field password-field">
                <label>Confirm Password *</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <label className="terms">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) =>
                  setFormData({ ...formData, agreeTerms: e.target.checked })
                }
                required
              />
              I agree to the <Link href="/terms">Terms of Use</Link> and{" "}
              <Link href="/privacy">Privacy Policy</Link> *
            </label>

            <button
              className="btn btn-primary submit-registration"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Vendor Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </section>

        {/* RIGHT ASIDE */}
        <aside className="registration-features">
          <article>
            <span>
              <FileText size={22} strokeWidth={1.8} />
            </span>
            <div>
              <h3>Simplified Participation</h3>
              <p>Submit documents easily and track your application status.</p>
            </div>
          </article>

          <article>
            <span>
              <ShieldCheck size={22} strokeWidth={1.8} />
            </span>
            <div>
              <h3>AI-Powered Verification</h3>
              <p>Faster and fairer compliance checks.</p>
            </div>
          </article>

          <article>
            <span>
              <Bell size={22} strokeWidth={1.8} />
            </span>
            <div>
              <h3>Stay Informed</h3>
              <p>Get real-time updates on tenders and notifications.</p>
            </div>
          </article>

          <article>
            <span>
              <BarChart3 size={22} strokeWidth={1.8} />
            </span>
            <div>
              <h3>Build Opportunities</h3>
              <p>Connect with government procurement initiatives across India.</p>
            </div>
          </article>

          {/* VIKSIT BHARAT BANNER */}
          <div className="viksit-bharat">
            <h4>Viksit Bharat</h4>
            <p>Through Collaboration</p>
            <div className="w-10 h-1 bg-gradient-to-r from-[#f39a21] to-[#229b68] mt-2 rounded"></div>
          </div>
        </aside>
      </div>
    </div>
  </PublicLayout>
);
}
