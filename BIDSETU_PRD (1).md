# BIDSETU — Product Requirements Document

**Product:** BIDSETU  
**Tagline:** AI-Powered Procurement Compliance & Risk Intelligence Platform  
**Team:** OneBuilds  
**SIH Problem Statement:** SIH26100 — AI-Powered Integrated Bid Compliance Verification Platform  
**Version:** 1.0  
**Status:** Final Product Requirements Baseline  
**Database:** MongoDB

---

## 1. Purpose

BIDSETU is a complete procurement compliance and risk-intelligence platform for managing tenders, vendor bids, procurement documents, compliance requirements, evidence, AI-assisted verification, risk analysis, explanations, reports, and audit activity.

The product is intended to provide a complete working workflow rather than a static UI demonstration.

The core journey is:

**Tender → Requirements → Vendor Bid → Documents → Processing → AI/NLP → Compliance Verification → Evidence → Risk → Explanation → Report → Audit**

The architecture supplied for the project defines document processing, AI/NLP intelligence, compliance verification/rule processing, and risk/explainability as the core functional layers. fileciteturn1file0L87-L144

---

## 2. Product Vision

BIDSETU should make procurement bid verification:

- faster;
- systematic;
- evidence-based;
- explainable;
- traceable;
- secure.

BIDSETU assists authorized procurement personnel. It does not replace the authorized human procurement decision-maker.

---

## 3. Product Roles

There are exactly **three** roles:

### 3.1 Procurement Officer / Buyer

Can:

- access authorized procurement workspace;
- create and manage tenders;
- define eligibility and technical requirements;
- manage tender documents;
- view submitted bids;
- access authorized vendor documents;
- initiate compliance analysis;
- review requirement-level results;
- inspect evidence and clauses;
- review risk insights;
- generate reports;
- access permitted audit information.

### 3.2 Bidder / Vendor

Can:

- register an organization account;
- sign in;
- view tenders available to the vendor;
- view authorized tender information;
- submit bids;
- upload supporting documents;
- monitor bid/document processing status;
- view compliance results made available to the vendor;
- respond to required actions where supported.

### 3.3 Admin

Can:

- manage users;
- manage organizations;
- manage role assignments within the three-role model;
- manage platform configuration;
- inspect audit logs.

No fourth role should be introduced.

---

# 4. Public Website

## 4.1 Home

The public home page establishes BIDSETU's identity and explains its purpose.

### Header

- BIDSETU logo/wordmark
- Home
- About
- How It Works
- Procurement
- Guidelines
- Help
- Contact
- Search
- Login

### Hero

Primary message:

**Smarter Procurement for a Stronger India**

Supporting message explains that BIDSETU helps analyze tender/vendor documents, verify requirements, identify discrepancies, assess risk, and provide explainable insights.

Primary actions:

- Officer Login
- Vendor Login

### Capabilities

- Document Intelligence
- Compliance Verification
- Risk Analysis
- Explainable AI
- Secure Processing
- Evidence-Based Analysis
- Requirement-Level Verification
- Explainable Risk Insights
- Role-Based Procurement Workflow

### How BIDSETU Works

1. Upload Documents
2. AI Processing
3. Verify Compliance
4. Assess Risk
5. Get Insights

### Public data

Latest Tenders and Announcements can be displayed only when actual public records exist.

If no records exist, show an intentional empty state.

**Never fabricate public procurement records, government departments, dates, statistics, accuracy claims, or announcements.**

---

# 5. Authentication

## 5.1 Login

The login page must focus primarily on authentication.

Required:

- BIDSETU branding;
- email/username;
- password;
- show/hide password;
- remember me;
- forgot password;
- Sign In;
- vendor account registration;
- concise secure-access information.

Secondary contextual information can remain visible in the background with reduced visual emphasis.

The login form must remain the dominant element.

## 5.2 Vendor Signup

Vendor signup must collect:

### Organization Information

- Organization Name
- Organization Type
- Registration / Identification Number
- Business Address
- City
- State
- PIN Code

### Primary Contact

- Full Name
- Official Email Address
- Phone Number

### Account Security

- Password
- Confirm Password

### Consent

- Terms of Use
- Privacy Policy

Action:

**Create Vendor Account**

## 5.3 Password Recovery

Provide secure password recovery.

Do not disclose whether an account exists through overly specific responses.

---

# 6. Authenticated Application

All authenticated pages use the same BIDSETU application shell.

### Sidebar

- BIDSETU
- Dashboard
- Tenders
- Bids
- Documents
- Compliance Analysis
- Risk & Insights
- Reports
- Audit Logs
- Settings

The visible navigation is permission-aware.

### Header

- breadcrumb/page context;
- global search where applicable;
- notifications;
- help;
- authenticated user;
- role.

### Footer

Authenticated pages use a compact footer:

**© 2026 BIDSETU • Powered by OneBuilds**

---

# 7. Procurement Officer Dashboard

The dashboard is an operational workspace, not a decorative statistics page.

Show data generated from actual application records:

- Active Tenders
- Bids Under Analysis
- Reviews Required
- High Risk Bids
- Recent Tenders
- Recent Compliance Analyses
- Notifications
- Quick Actions
- Procurement Insights
- My Tasks
- Compliance Status Overview

If a dataset is empty, display a meaningful empty state.

Do not hardcode business metrics.

---

# 8. Vendor Dashboard

Show actual vendor-specific data:

- Available Tenders
- My Bids
- Submitted Documents
- Compliance Results
- Required Actions
- Notifications

The vendor can only access records authorized for that vendor organization.

---

# 9. Tender Management

## 9.1 Tender List

Provide:

- search;
- filtering;
- status filtering;
- deadline filtering;
- category filtering;
- creation-date filtering;
- pagination.

Table:

| Field |
|---|
| Tender ID |
| Tender Title |
| Status |
| Submission Deadline |
| Created Date |
| Actions |

## 9.2 Create Tender

Allow authorized procurement officers to enter:

- tender information;
- description;
- eligibility criteria;
- technical specifications;
- mandatory requirements;
- required certificates;
- supporting documents;
- important dates;
- publication status.

## 9.3 Tender Details

Show:

- tender information;
- eligibility criteria;
- technical requirements;
- required documents;
- important dates;
- tender documents;
- submitted bids.

---

# 10. Bid Management

## 10.1 Bid List

Show:

- Vendor
- Tender
- Submission Date
- Bid Status
- Document Status
- Compliance Status
- Risk

## 10.2 Bid Details

Show:

- vendor information;
- tender information;
- submission information;
- documents;
- processing status;
- compliance status;
- risk;
- available reports.

Authorized procurement officers can initiate compliance analysis.

---

# 11. Document Management

Documents are first-class application records.

Each document should have:

- filename;
- type;
- size;
- uploader;
- related organization;
- related tender;
- related bid;
- upload date;
- processing status;
- extracted information status.

Processing states:

- Uploaded
- Processing
- Processed
- Requires Review
- Failed

The architecture specifically identifies uploaded documents, file validation, PDF/DOCX parsing + OCR, text cleaning/preprocessing, and structured machine-readable data. fileciteturn1file0L87-L103

---

# 12. Document Processing

The user must be able to see the document-processing lifecycle:

**File Validation → PDF/DOCX Parsing + OCR → Text Cleaning → Structured Data → AI/NLP Analysis**

Processing should be asynchronous for operations that may take significant time.

The UI must provide clear status and failure information.

---

# 13. AI/NLP Intelligence

The AI layer supports:

- requirement extraction;
- semantic understanding and matching;
- entity/information extraction;
- LLM-based reasoning;
- confidence scoring.

These capabilities are part of the supplied architecture. fileciteturn1file0L104-L118

AI should be integrated into the workflow.

BIDSETU should not present a chatbot as its main product feature.

AI output should be evidence-backed wherever possible.

---

# 14. Compliance Verification

For each tender requirement, BIDSETU should perform:

1. Requirement-document mapping
2. Mandatory rule validation
3. Semantic compliance matching
4. Numeric/data validation
5. Missing/mismatch detection
6. Result classification

The defined result categories are:

- **Compliant**
- **Review Required**
- **Non-Compliant**

The architecture explicitly defines these verification stages. fileciteturn1file0L119-L136

Each requirement result should provide, where available:

- requirement;
- category;
- mandatory flag;
- result;
- confidence;
- evidence;
- document;
- page;
- clause;
- explanation;
- review state.

---

# 15. Compliance Analysis Screen

This is BIDSETU's primary intelligence screen.

The page must show:

- Tender
- Vendor
- Overall Compliance Score
- Compliant count
- Review Required count
- Non-Compliant count
- Risk Level

Then a requirement-level table:

| Requirement | Category | Mandatory | Result | Confidence | Evidence | Explanation |
|---|---|---|---|---:|---|---|

Selecting a requirement opens its evidence and explanation.

The score and counts must come from the actual persisted analysis.

---

# 16. Evidence Viewer

The evidence viewer is the signature workflow.

Use:

**Original Document + AI Analysis**

The interface should allow the authorized user to inspect:

- requirement;
- result;
- confidence;
- source document;
- page;
- clause;
- extracted evidence;
- explanation.

Relevant clauses/evidence should be highlighted when the document-processing pipeline provides location information.

The architecture explicitly includes evidence and clause highlighting and AI-generated explanation. fileciteturn1file0L10-L19

---

# 17. Risk & Insights

Show actual analysis-derived:

- risk level;
- compliance score;
- discrepancies;
- anomalies;
- missing information;
- unresolved review items;
- requirement distribution.

Risk levels:

- Low
- Medium
- High

The architecture defines compliance-score calculation, risk classification, discrepancy/anomaly detection, and explainability. fileciteturn1file0L10-L19

---

# 18. Reports

Reports are generated from actual tender, bid, compliance, evidence, and risk data.

Supported report categories can include:

- Compliance Report
- Risk Assessment
- Bid Evaluation Summary
- Tender Analysis

A report must contain:

- related tender;
- related bid where applicable;
- analysis timestamp;
- creator;
- report status;
- generated content.

---

# 19. Audit Logs

Record important security and business activity:

- authentication events;
- user changes;
- organization changes;
- role changes;
- tender changes;
- bid submission;
- document upload;
- document processing;
- compliance analysis;
- report generation;
- administrative configuration changes;
- sensitive resource access.

Audit data must not be editable by ordinary users.

---

# 20. Notifications

Notifications can cover:

- tender activity;
- bid activity;
- document processing;
- compliance review requirements;
- security/account events.

Notifications must be permission-scoped.

---

# 21. Settings

Provide:

- Profile
- Account
- Security
- Notifications
- Preferences

Use the same form components as authentication.

---

# 22. Admin

Admin pages:

- Admin Dashboard
- User Management
- Organization Management
- Role Management
- System Configuration
- Audit Logs

Admin must still use the same BIDSETU visual language.

---

# 23. Data Truthfulness — NON-NEGOTIABLE

BIDSETU must be a real, data-driven application.

The frontend must not depend on hardcoded business records.

Do not create fake operational data such as:

- invented tenders;
- invented vendors;
- invented government departments;
- invented announcements;
- invented statistics;
- invented compliance scores;
- invented risk assessments;
- invented evidence;
- invented AI confidence values.

If the system contains no record, show an appropriate empty state.

For SIH presentation, meaningful application records can be created through the actual workflows and stored in MongoDB. Those records then appear throughout the application normally.

The system must never pretend that internally created presentation records are actual government records.

---

# 24. Prohibited Product Terminology

Do not use these terms for product data, records, accounts, features, routes, components, or workflows:

- Dummy
- Demo
- Trial
- Fake
- Mock
- Sample
- Test
- Prototype
- Temporary
- Placeholder

Do not create names such as:

- DummyUser
- DemoVendor
- TestTender
- MockBid
- FakeData

---

# 25. UI Design Requirements

The approved Login, Signup, Public Home, and Dashboard designs are the visual source of truth.

All pages must use the same design language.

### Visual character

**Modern Government Enterprise**

Not an old government portal.

Not generic AI SaaS.

Not futuristic AI.

### Approved palette

| Token | Value |
|---|---|
| Government Blue | #1F6F9F |
| Deep Navy | #123B5D |
| Dark Navy | #071A2D |
| Saffron | #E67E22 |
| Background | #F5F7FA |
| White | #FFFFFF |
| Primary Text | #17202A |
| Secondary Text | #5F6B76 |
| Success | #16794C |
| Warning | #B7791F |
| Danger | #B42318 |

Saffron is a restrained identity accent.

### Design behavior

Use:

- clean white surfaces;
- light blue/grey backgrounds;
- thin borders;
- subtle shadows;
- compact cards;
- professional tables;
- consistent line icons;
- restrained badges;
- strong hierarchy;
- 6–10px radius;
- controlled spacing.

Avoid:

- excessive rounded cards;
- glassmorphism;
- neon;
- large decorative illustrations;
- glowing AI graphics;
- excessive gradients;
- excessive animation;
- decorative filler.

---

# 26. Progressive Visual Hierarchy

Useful secondary information should not automatically be removed.

Instead, it can be shown with:

- lower contrast;
- muted text;
- smaller typography;
- subtle background;
- reduced visual weight.

Primary actions and critical information must remain visually dominant.

This applies to public pages, login, signup, dashboards, analysis, reports, and settings.

---

# 27. Responsive UX

Primary environment: desktop/laptop.

Also support:

- tablet;
- mobile.

Authenticated sidebar becomes a mobile drawer.

Tables must remain usable.

Evidence viewer becomes vertically stacked on narrow screens.

---

# 28. Accessibility

Provide:

- keyboard navigation;
- visible focus states;
- accessible form labels;
- logical headings;
- sufficient contrast;
- accessible tables;
- status communicated by icon/text in addition to color;
- meaningful error messages.

---

# 29. Product Acceptance Criteria

BIDSETU is functionally acceptable when a procurement officer can:

1. sign in;
2. create/manage a tender;
3. define requirements;
4. receive/view a vendor bid;
5. access submitted documents;
6. process documents;
7. extract relevant information;
8. run compliance analysis;
9. view requirement-level results;
10. inspect evidence;
11. read AI explanations;
12. review compliance score;
13. review risk;
14. generate a report;
15. inspect relevant audit activity.

A vendor can:

1. register;
2. sign in;
3. access authorized tenders;
4. submit a bid;
5. upload documents;
6. monitor processing;
7. view authorized compliance results.

An admin can:

1. manage users;
2. manage organizations;
3. manage the three-role authorization model;
4. manage configuration;
5. inspect audit logs.

---

# 30. Product Definition of Done

BIDSETU is not considered complete merely because the screens exist.

A feature is complete only when:

- the UI is implemented;
- the relevant database records exist;
- the server-side API/workflow exists;
- authorization is enforced;
- validation is implemented;
- loading/error/empty states exist;
- relevant audit events exist;
- actual application data flows through the feature;
- the feature works without hardcoded business data;
- the feature uses the locked BIDSETU design system.

---

# 31. Core Product Principle

**BIDSETU is a functioning procurement compliance platform, not a collection of static screens.**

The UI is the interface.

MongoDB is the persistent application data layer.

Document processing creates structured information.

AI/NLP interprets and matches information.

The compliance engine verifies requirements.

Evidence connects results to source documents.

Risk analysis summarizes potential issues.

Reports package the results.

Audit logs preserve traceability.

The complete product must work as one connected system.
