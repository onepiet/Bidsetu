# SIH26100 — Live Demonstration & Evaluation Guide

> **Project**: BIDSETU — AI-Powered Integrated Bid Compliance Verification & Risk Intelligence Platform  
> **Problem Statement**: SIH26100 (GeM Procurement AI Compliance Verification & Risk Intelligence)  
> **Target Audience**: Evaluators, Procurement Officers, Technical Judges

---

## 20-Step Live Judging Demo Sequence

Follow this sequence to evaluate the end-to-end capabilities of BIDSETU:

1. Open `http://localhost:3000/login` and click the **Quick Role Preset "Officer"** button (`officer@mnre.gov.in` / `officerPass2026`).
2. Open Procurement Officer Executive Dashboard (`http://localhost:3000/dashboard`).
3. Review Action Required Evaluation Queue.
4. Inspect Active GeM Procurement Tender (`TND-2026-MNRE-0842`).
5. View Structured Requirements & Evaluation Rules.
6. Open Submitted Vendor Bid Proposal (`Tata Power Renewable Energy Limited`).
7. View Uploaded Technical Document Submissions.
8. Launch Document Intelligence & PaddleOCR Viewer (`/documents/[id]/ocr`).
9. Run Real PaddleOCR Processing (Extracted 30 blocks, Bounding Boxes `[x1,y1,x2,y2]`, 97.3% Confidence).
10. Inspect Categorized Extracted Data (Identity, Financial, Dates, Registration).
11. Execute Requirement Classification (Model: `microsoft/deberta-v3-base`).
12. Perform Evidence Retrieval & Clause Matching.
13. Execute Statutory Verification against DATASETU Government Portal API (`GSTIN: 07WKMCP4023I9ZY`).
14. Run NLI Contradiction Analysis (`DeBERTa-v3-nli` — SUPPORTS / CONTRADICTS / INSUFFICIENT).
15. Run Deterministic Rule Engine (`TURNOVER >= 150 Crore`, `GST_VALID == True`).
16. Display Clause-by-Clause Compliance Matrix (`/compliance/[id]`).
17. Demonstrate Why Requirement Passed (Turnover ₹150Cr rule satisfied).
18. Demonstrate Officer Result Override (Mark Compliant / Non-Compliant with Audit Reason).
19. Record Final Procurement Officer Qualification Decision (`[QUALIFY BID]` / `[DISQUALIFY BID]`).
20. Verify Immutable Security Audit Trail (`/audit-logs`).

---

## Pre-Configured Evaluation Scenarios (Scenarios A – F)

The platform includes 6 pre-configured, deterministic evaluation scenarios:

| Scenario | Vendor Name | Bid ID | Primary Finding | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **Scenario A** | Pragati Micro Control Systems | `SYN-BID-000001` | Fully Compliant Submission | **PASS / QUALIFIED** |
| **Scenario B** | Apex Solar Infrastructures | `SYN-BID-000002` | Missing Mandatory OEM Auth | **NON_COMPLIANT / REVIEW** |
| **Scenario C** | Delta Tech Solutions | `SYN-BID-000003` | GSTIN Legal Name Mismatch | **MISMATCH / REVIEW** |
| **Scenario D** | Zenith Energy Services | `SYN-BID-000004` | Turnover ₹3.2Cr < ₹5Cr Required | **NON_COMPLIANT** |
| **Scenario E** | Nova Systems Pvt Ltd | `SYN-BID-000005` | Experience Certificate Dates Contradiction | **NLI CONTRADICTION** |
| **Scenario F** | Blacklisted Vendor Corp | `SYN-BID-000006` | CPPP Debarment Registry Match | **HIGH RISK / DISQUALIFIED** |
