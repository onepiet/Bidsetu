"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { repository } from "@/lib/db/repository";
import { Requirement } from "@/types";
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from "lucide-react";

export default function CreateTenderPage() {
  const router = useRouter();
  const [tenderId, setTenderId] = useState(`TND-2026-GOI-${Math.floor(1000 + Math.random() * 9000)}`);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Renewable Energy & Infrastructure");
  const [deadline, setDeadline] = useState("2026-05-30");

  const [eligibilityList, setEligibilityList] = useState<string[]>([
    "Minimum 3 years of registered operations in India",
    "Positive audited net worth over previous two fiscal years",
  ]);
  const [newEligibility, setNewEligibility] = useState("");

  const [requirements, setRequirements] = useState<Omit<Requirement, "_id" | "tenderId">[]>([
    {
      title: "Technical Compliance Specification",
      description: "Must fulfill technical performance guidelines set by national standards.",
      category: "TECHNICAL",
      type: "DOCUMENT",
      mandatory: true,
      order: 1,
    },
  ]);

  const [newReqTitle, setNewReqTitle] = useState("");
  const [newReqDesc, setNewReqDesc] = useState("");
  const [newReqCategory, setNewReqCategory] = useState<Requirement["category"]>("TECHNICAL");
  const [newReqMandatory, setNewReqMandatory] = useState(true);

  const handleAddEligibility = () => {
    if (newEligibility.trim()) {
      setEligibilityList([...eligibilityList, newEligibility.trim()]);
      setNewEligibility("");
    }
  };

  const handleRemoveEligibility = (index: number) => {
    setEligibilityList(eligibilityList.filter((_, i) => i !== index));
  };

  const handleAddRequirement = () => {
    if (newReqTitle.trim()) {
      setRequirements([
        ...requirements,
        {
          title: newReqTitle.trim(),
          description: newReqDesc.trim(),
          category: newReqCategory,
          type: "DOCUMENT",
          mandatory: newReqMandatory,
          order: requirements.length + 1,
        },
      ]);
      setNewReqTitle("");
      setNewReqDesc("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const formattedRequirements: Requirement[] = requirements.map((r, i) => ({
      ...r,
      _id: `req-${Date.now()}-${i}`,
      tenderId,
    }));

    repository.createTender({
      tenderId,
      title,
      description,
      organizationId: "org-gov-001",
      category,
      status: "PUBLISHED",
      publication: {
        publishedAt: new Date().toISOString(),
        submissionDeadline: new Date(deadline).toISOString(),
      },
      eligibilityCriteria: eligibilityList,
      technicalRequirements: formattedRequirements,
      documentIds: [],
      createdBy: "usr-off-001",
    });

    router.push("/tenders");
  };

  return (
    <AppShell pageTitle="Create New Tender">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/tenders"
            className="p-1.5 bg-white border border-[#cbd7e0] rounded-md text-gray-500 hover:text-navy"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-base font-bold text-navy">New Procurement Tender</h2>
            <p className="text-xs text-[#627a8f]">
              Define eligibility parameters, mandatory compliance rules, and submission deadlines
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="bg-white p-6 rounded-lg border border-[#d7e1e9] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-navy border-b border-[#edf1f4] pb-2">
              1. Tender Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">
                  Tender Reference ID *
                </label>
                <input
                  type="text"
                  value={tenderId}
                  onChange={(e) => setTenderId(e.target.value)}
                  className="w-full h-9 px-3 text-xs border border-[#cbd7e0] rounded-md bg-gray-50 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy mb-1">
                  Procurement Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-9 px-3 text-xs border border-[#cbd7e0] rounded-md bg-white text-navy"
                >
                  <option value="Renewable Energy & Infrastructure">Renewable Energy & Infrastructure</option>
                  <option value="Information Technology & Hardware">Information Technology & Hardware</option>
                  <option value="Civil Engineering & Construction">Civil Engineering & Construction</option>
                  <option value="Healthcare & Medical Equipment">Healthcare & Medical Equipment</option>
                  <option value="Telecommunications & Networking">Telecommunications & Networking</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Tender Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter formal procurement title"
                className="w-full h-9 px-3 text-xs border border-[#cbd7e0] rounded-md bg-white focus:outline-none focus:border-blue"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Detailed Scope of Work & Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Provide comprehensive description and terms..."
                className="w-full p-3 text-xs border border-[#cbd7e0] rounded-md bg-white focus:outline-none focus:border-blue"
                required
              ></textarea>
            </div>

            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-semibold text-navy mb-1">
                Submission Deadline *
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full h-9 px-3 text-xs border border-[#cbd7e0] rounded-md bg-white"
                required
              />
            </div>
          </div>

          {/* SECTION 2: ELIGIBILITY CRITERIA */}
          <div className="bg-white p-6 rounded-lg border border-[#d7e1e9] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-navy border-b border-[#edf1f4] pb-2">
              2. Eligibility Criteria
            </h3>

            <div className="space-y-2">
              {eligibilityList.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-[#f8fafc] border border-[#e2eaf0] rounded text-xs text-navy"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#16794c]" />
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEligibility(idx)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newEligibility}
                onChange={(e) => setNewEligibility(e.target.value)}
                placeholder="Add eligibility clause (e.g. ISO 9001 certified)..."
                className="flex-1 h-9 px-3 text-xs border border-[#cbd7e0] rounded-md bg-white"
              />
              <button
                type="button"
                onClick={handleAddEligibility}
                className="btn btn-secondary text-xs min-h-[36px] py-1 px-3 flex items-center gap-1"
              >
                <Plus size={14} /> Add Clause
              </button>
            </div>
          </div>

          {/* SECTION 3: TECHNICAL REQUIREMENTS */}
          <div className="bg-white p-6 rounded-lg border border-[#d7e1e9] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-navy border-b border-[#edf1f4] pb-2">
              3. Verification Requirements for AI Compliance Engine
            </h3>

            <div className="space-y-3">
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#f8fafc] border border-[#e2eaf0] rounded-lg text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy">{req.title}</span>
                      <span className="badge bg-[#edf7ff] text-[#0b5f96] text-[10px]">
                        {req.category}
                      </span>
                      {req.mandatory && (
                        <span className="badge bg-red-50 text-red-700 text-[10px]">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(idx)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-[#55718a] text-[11.5px]">{req.description}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border border-dashed border-[#bce0fd] bg-[#f7fbff] rounded-lg space-y-3">
              <div className="font-semibold text-xs text-navy">Add Verification Rule</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newReqTitle}
                  onChange={(e) => setNewReqTitle(e.target.value)}
                  placeholder="Requirement Title"
                  className="h-8 px-2 text-xs border border-[#cbd7e0] rounded bg-white"
                />
                <select
                  value={newReqCategory}
                  onChange={(e) => setNewReqCategory(e.target.value as any)}
                  className="h-8 px-2 text-xs border border-[#cbd7e0] rounded bg-white text-navy"
                >
                  <option value="TECHNICAL">TECHNICAL</option>
                  <option value="CERTIFICATION">CERTIFICATION</option>
                  <option value="FINANCIAL">FINANCIAL</option>
                  <option value="COMPLIANCE">COMPLIANCE</option>
                  <option value="ELIGIBILITY">ELIGIBILITY</option>
                </select>
                <label className="flex items-center gap-2 text-xs text-navy cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newReqMandatory}
                    onChange={(e) => setNewReqMandatory(e.target.checked)}
                    className="w-4 h-4 accent-blue"
                  />
                  Mandatory Condition
                </label>
              </div>
              <textarea
                value={newReqDesc}
                onChange={(e) => setNewReqDesc(e.target.value)}
                placeholder="Technical threshold, standard clause, or acceptance parameter..."
                rows={2}
                className="w-full p-2 text-xs border border-[#cbd7e0] rounded bg-white"
              ></textarea>
              <button
                type="button"
                onClick={handleAddRequirement}
                className="btn btn-secondary text-xs min-h-[32px] py-1 px-3"
              >
                + Append Rule
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end gap-3">
            <Link href="/tenders" className="btn btn-secondary text-xs">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary text-xs px-6">
              Publish Tender
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
