# BIDSETU — Technical Requirements Document

**Product:** BIDSETU  
**Team:** OneBuilds  
**SIH Problem Statement:** SIH26100 — AI-Powered Integrated Bid Compliance Verification Platform  
**Version:** 1.0  
**Status:** Final Technical Baseline  
**Primary Database:** MongoDB

---

# 1. Technical Objective

Build BIDSETU as a secure, database-backed, end-to-end procurement compliance platform.

The system must connect:

**Authentication → Tender → Requirements → Bid → Documents → Processing → AI/NLP → Compliance → Evidence → Risk → Reports → Audit**

The implementation must not be a static frontend with hardcoded business data.

Every operational screen must obtain its information from:

- authenticated user actions;
- MongoDB records;
- document-processing output;
- AI analysis output;
- system-generated audit/notification records.

---

# 2. Technology Stack

## Frontend / Application

- Next.js
- React
- TypeScript

Use the Next.js App Router.

## Styling

- Tailwind CSS
- Shared BIDSETU design tokens
- Reusable UI components

## Database

**MongoDB**

MongoDB is the primary application database.

Do not introduce PostgreSQL/Supabase as a second primary database.

## AI

Initial AI provider:

**Google Gemini API**

Implement a provider abstraction so Gemini can later be replaced by another provider or an internally hosted model.

## File Storage

Use private object storage for uploaded documents.

The exact provider can be selected according to deployment requirements.

Do not store large document binaries directly in ordinary MongoDB documents.

## Optional Background Processing

Use a background job/queue system when required for long-running document processing and AI analysis.

Redis may be used if the selected queue architecture requires it.

Do not introduce unnecessary infrastructure solely for architectural complexity.

---

# 3. Application Architecture

```text
Browser
   |
   v
Next.js Application
   |
   +-------------------------+
   |                         |
   v                         v
Authentication          Server/API Layer
                             |
              +--------------+--------------+
              |              |              |
              v              v              v
           MongoDB      Object Storage   AI Provider
                                            |
                                        Gemini API
              |
              v
       Domain Services
              |
      +-------+--------+
      |       |        |
   Tender   Bid    Documents
                    |
                    v
             Processing Pipeline
                    |
                    v
              AI / NLP Layer
                    |
                    v
            Compliance Engine
                    |
          +---------+---------+
          |                   |
          v                   v
      Evidence              Risk
          |                   |
          +---------+---------+
                    |
                  Reports
                    |
                  Audit
```

---

# 4. Architectural Principles

1. Server is the security boundary.
2. MongoDB is the source of persisted application truth.
3. Uploaded documents are untrusted input.
4. AI output is untrusted output until validated.
5. Compliance logic is independent from the UI.
6. AI provider implementation is replaceable.
7. Business data is never hardcoded into UI components.
8. Authorization is enforced server-side.
9. Important operations are auditable.
10. All secrets remain outside source code.
11. Domain services should not depend directly on presentation components.
12. Long-running processing should not block ordinary HTTP requests.

---

# 5. Suggested Project Structure

```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (app)/
│   ├── admin/
│   ├── vendor/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   ├── tables/
│   ├── documents/
│   ├── compliance/
│   ├── risk/
│   └── reports/
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── organizations/
│   ├── tenders/
│   ├── requirements/
│   ├── bids/
│   ├── documents/
│   ├── compliance/
│   ├── evidence/
│   ├── risk/
│   ├── reports/
│   ├── notifications/
│   └── audit/
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── ai/
│   ├── storage/
│   ├── security/
│   ├── validation/
│   └── permissions/
│
├── server/
│   ├── services/
│   ├── repositories/
│   └── jobs/
│
├── types/
├── config/
└── constants/
```

The exact structure may be adapted, but domain separation must remain.

---

# 6. Environment Configuration

Use `.env.local` for local development and deployment secret management in production.

Example `.env.example`:

```env
MONGODB_URI=
MONGODB_DB_NAME=bidsetu

GEMINI_API_KEY=

NEXT_PUBLIC_APP_URL=

STORAGE_ENDPOINT=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

AUTH_SECRET=
```

Rules:

- never commit `.env.local`;
- never hardcode credentials;
- never expose private keys with `NEXT_PUBLIC_`;
- never place credentials in seed data;
- never include real secrets in documentation.

---

# 7. MongoDB Database Design

Recommended collections:

```text
users
organizations
tenders
requirements
bids
documents
complianceRules
complianceChecks
complianceResults
evidence
aiAnalyses
riskAssessments
reports
notifications
auditLogs
```

Use references between major entities.

Do not create one massive document containing the complete platform state.

---

# 8. Users

Suggested document:

```ts
{
  _id,
  email,
  passwordHash,
  role,
  organizationId,
  profile: {
    fullName,
    phone
  },
  status,
  emailVerified,
  lastLoginAt,
  createdAt,
  updatedAt
}
```

Allowed roles:

```text
PROCUREMENT_OFFICER
VENDOR
ADMIN
```

No additional roles.

---

# 9. Organizations

```ts
{
  _id,
  name,
  type,
  registrationNumber,
  address: {
    line1,
    city,
    state,
    pinCode
  },
  status,
  createdAt,
  updatedAt
}
```

Registration numbers should have appropriate uniqueness constraints.

---

# 10. Tenders

```ts
{
  _id,
  tenderId,
  title,
  description,
  organizationId,
  category,
  status,
  publication: {
    publishedAt,
    submissionDeadline
  },
  eligibilityCriteria: [],
  technicalRequirements: [],
  documentIds: [],
  createdBy,
  createdAt,
  updatedAt
}
```

Tender IDs must be generated/validated by the backend.

Do not hardcode tender records in frontend code.

---

# 11. Requirements

Requirements should be individually addressable.

```ts
{
  _id,
  tenderId,
  category,
  title,
  description,
  type,
  mandatory,
  validationConfig,
  order,
  createdAt,
  updatedAt
}
```

Possible types:

```text
CERTIFICATION
EXPERIENCE
FINANCIAL
TECHNICAL
ELIGIBILITY
DOCUMENT
NUMERIC
OTHER
```

---

# 12. Bids

```ts
{
  _id,
  tenderId,
  vendorOrganizationId,
  submittedBy,
  status,
  submittedAt,
  documentIds: [],
  complianceAnalysisId,
  createdAt,
  updatedAt
}
```

Vendor ownership must be enforced server-side.

---

# 13. Documents

```ts
{
  _id,
  fileName,
  mimeType,
  size,
  storageKey,
  sha256,
  uploadedBy,
  organizationId,
  tenderId,
  bidId,
  status,
  processing: {
    startedAt,
    completedAt,
    errorCode
  },
  extractedTextReference,
  createdAt,
  updatedAt
}
```

Documents are stored privately in object storage.

MongoDB stores metadata and relationships.

---

# 14. Compliance Rules

```ts
{
  _id,
  name,
  version,
  scope,
  ruleType,
  configuration,
  active,
  createdBy,
  createdAt,
  updatedAt
}
```

Rules are versioned.

Important verification logic must not be hidden inside frontend components.

---

# 15. Compliance Checks

```ts
{
  _id,
  tenderId,
  bidId,
  requirementId,
  ruleId,
  inputReferences: [],
  result,
  confidence,
  reason,
  evidenceIds: [],
  executedAt,
  engineVersion
}
```

Each execution should be traceable to its inputs and rule version.

---

# 16. Compliance Results

```ts
{
  _id,
  tenderId,
  bidId,
  requirementId,
  result,
  confidence,
  evidenceIds: [],
  explanation,
  reviewStatus,
  createdAt,
  updatedAt
}
```

Allowed result values:

```text
COMPLIANT
REVIEW_REQUIRED
NON_COMPLIANT
```

---

# 17. Evidence

```ts
{
  _id,
  documentId,
  requirementId,
  bidId,
  pageNumber,
  clauseReference,
  extractedText,
  boundingBox,
  evidenceType,
  confidence,
  createdAt
}
```

`boundingBox` may be used for document highlighting.

---

# 18. AI Analyses

```ts
{
  _id,
  entityType,
  entityId,
  provider,
  model,
  promptVersion,
  analysisVersion,
  inputReferences: [],
  outputReference,
  confidence,
  tokenUsage,
  latencyMs,
  status,
  createdAt
}
```

Do not store unnecessary sensitive model inputs.

---

# 19. Risk Assessments

```ts
{
  _id,
  bidId,
  complianceAnalysisId,
  level,
  score,
  signals: [],
  explanation,
  engineVersion,
  createdAt
}
```

Levels:

```text
LOW
MEDIUM
HIGH
```

Persist contributing signals.

---

# 20. Reports

```ts
{
  _id,
  type,
  tenderId,
  bidId,
  createdBy,
  status,
  storageKey,
  generatedAt,
  createdAt
}
```

Reports must be generated from actual stored application data.

---

# 21. Notifications

```ts
{
  _id,
  userId,
  type,
  title,
  message,
  resourceType,
  resourceId,
  readAt,
  createdAt
}
```

---

# 22. Audit Logs

```ts
{
  _id,
  actorUserId,
  actorRole,
  organizationId,
  action,
  resourceType,
  resourceId,
  result,
  metadata,
  createdAt
}
```

Do not store passwords, API keys, session secrets, or unnecessary sensitive document contents.

---

# 23. MongoDB Indexing

Initial indexes should include:

### Users

```text
email: unique
organizationId + role
status
```

### Organizations

```text
registrationNumber: unique where appropriate
status
```

### Tenders

```text
tenderId
organizationId + status
publication.submissionDeadline
createdAt
```

### Requirements

```text
tenderId + order
tenderId + mandatory
```

### Bids

```text
tenderId + status
vendorOrganizationId + createdAt
```

### Documents

```text
bidId
tenderId
organizationId
sha256
status
```

### Compliance

```text
bidId
tenderId
requirementId
result
```

### Evidence

```text
bidId + requirementId
documentId + pageNumber
```

### Audit

```text
createdAt
actorUserId + createdAt
resourceType + resourceId
```

Indexes should be confirmed against actual query patterns.

---

# 24. Authentication

Recommended flow:

```text
Credentials
   ↓
Validate input
   ↓
Find user
   ↓
Verify password hash
   ↓
Create secure session
   ↓
Authenticated application
```

Use:

- secure session cookies;
- HttpOnly;
- Secure in production;
- appropriate SameSite policy;
- session expiration;
- session rotation where appropriate;
- authentication rate limiting.

Passwords must use secure hashing.

---

# 25. Authorization / RBAC

Authorization is server-side.

Use a permission service such as:

```ts
authorize(user, action, resource)
```

Authorization should check:

- role;
- organization;
- resource ownership;
- resource relationship;
- action.

Examples:

```text
Vendor A cannot access Vendor B's bid.

Vendor cannot perform procurement-officer actions.

Procurement Officer cannot access unauthorized organizational records.

Admin-only operations reject other roles.
```

Never trust a client-supplied role or organization ID as proof of authorization.

---

# 26. API Architecture

Recommended routes:

```text
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/vendor-signup
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

GET    /api/tenders
POST   /api/tenders
GET    /api/tenders/:id
PATCH  /api/tenders/:id

GET    /api/tenders/:id/bids
POST   /api/tenders/:id/bids

GET    /api/bids/:id
POST   /api/bids/:id/analyze

POST   /api/documents
GET    /api/documents/:id
GET    /api/documents/:id/status

GET    /api/compliance/:analysisId
GET    /api/compliance/:analysisId/requirements/:requirementId

GET    /api/risk/:bidId

POST   /api/reports
GET    /api/reports/:id

GET    /api/notifications
PATCH  /api/notifications/:id/read

GET    /api/audit-logs

GET    /api/admin/users
PATCH  /api/admin/users/:id
```

Route naming may be adapted to the final Next.js implementation.

---

# 27. API Boundary Security

Every protected API must:

1. authenticate;
2. authorize;
3. validate input;
4. execute business logic;
5. persist changes;
6. audit sensitive actions.

Recommended validation:

**Zod**

Client validation improves UX but never replaces server validation.

---

# 28. File Upload Security

Uploaded documents are untrusted.

Implement:

- MIME validation;
- extension validation;
- file-size limits;
- safe filename normalization;
- generated storage keys;
- private storage;
- signed URLs;
- authorization before download;
- SHA-256 hashing;
- processing timeouts;
- parser safety;
- malware scanning where available.

Never use the user filename directly as a storage path.

---

# 29. Document Processing Pipeline

The architecture requires:

**Uploaded Documents → File Validation → PDF/DOCX Parser + OCR → Text Cleaning/Preprocessing → Structured/Machine-Readable Data**

Implement:

```text
Upload
  ↓
Validate
  ↓
Private Storage
  ↓
Document Record
  ↓
Processing Job
  ↓
PDF/DOCX Parsing
  ↓
OCR if required
  ↓
Text Cleaning
  ↓
Structured Extraction
```

Persist processing state and errors.

---

# 30. AI/NLP Pipeline

After structured extraction:

```text
Structured Data
      ↓
Requirement Extraction
      ↓
Entity / Information Extraction
      ↓
Semantic Understanding & Matching
      ↓
LLM Reasoning
      ↓
Confidence Scoring
```

These stages reflect the supplied architecture. fileciteturn1file0L104-L118

---

# 31. AI Provider Abstraction

Define:

```ts
interface AIProvider {
  extractRequirements(input): Promise<RequirementExtractionResult>
  extractEntities(input): Promise<EntityExtractionResult>
  semanticMatch(input): Promise<SemanticMatchResult>
  explainCompliance(input): Promise<ComplianceExplanation>
  assessRiskSignals(input): Promise<RiskInsightResult>
}
```

Initial implementation:

```text
AIProvider
   └── GeminiProvider
```

Future implementation may add:

```text
CustomModelProvider
```

Business logic must depend on `AIProvider`, not directly on Gemini.

---

# 32. AI Output Validation

AI output is untrusted.

Implement:

- structured output;
- schema validation;
- confidence;
- source references;
- prompt version;
- model version;
- provider name;
- timeout;
- bounded retry;
- malformed-output handling.

Never execute AI output as code, database commands, authorization instructions, or application configuration.

---

# 33. Prompt Injection Protection

Document content must be treated as untrusted data.

The AI pipeline must explicitly distinguish:

```text
System Instructions
Application Rules
Tender Requirements
Document Content
Extracted Evidence
```

Document text must never be allowed to:

- modify permissions;
- change system rules;
- issue database commands;
- override system instructions.

---

# 34. Compliance Engine

Compliance must be an independent server-side service.

Example:

```ts
ComplianceEngine.evaluate({
  tender,
  bid,
  requirements,
  documents,
  extractedData
})
```

It performs:

1. requirement-document mapping;
2. mandatory rule validation;
3. semantic compliance matching;
4. numeric/data validation;
5. missing/mismatch detection;
6. result classification.

---

# 35. Compliance Scoring

Centralize scoring:

```ts
calculateComplianceScore(results, scoringPolicy)
```

Do not scatter score weights across frontend components.

The scoring policy must be explicit and versioned.

The final score must be reproducible from persisted results and the scoring policy.

The exact mathematical formula is not defined by the supplied architecture; therefore it must be an implementation/business-rule decision, not presented as an official government formula.

---

# 36. Risk Engine

Centralize risk assessment:

```ts
assessRisk({
  complianceResults,
  discrepancies,
  anomalies,
  missingEvidence,
  scoringPolicy
})
```

Return:

```ts
{
  level: "LOW" | "MEDIUM" | "HIGH",
  score: number,
  signals: [],
  explanation: string
}
```

Persist the contributing signals.

The supplied architecture defines the risk levels and capabilities but does not specify a numerical risk formula; the implementation must therefore version its chosen policy. fileciteturn1file0L10-L19

---

# 37. Evidence Mapping

Evidence should identify:

- source document;
- requirement;
- page;
- clause;
- extracted text;
- confidence;
- optional bounding box.

The UI uses this information to navigate and highlight supporting content.

---

# 38. Analysis Lifecycle

Recommended states:

```text
CREATED
QUEUED
PROCESSING
COMPLETED
REQUIRES_REVIEW
FAILED
```

An analysis is only complete when required pipeline outputs are persisted.

---

# 39. Background Jobs

Long-running operations should use background jobs:

- document parsing;
- OCR;
- structured extraction;
- AI analysis;
- compliance execution;
- report generation.

Each job should have:

```text
jobId
entityId
attemptCount
status
startedAt
completedAt
errorCode
```

Retries must be bounded.

---

# 40. Frontend Architecture

Authenticated shell:

```text
AppShell
├── Sidebar
├── TopHeader
├── MainContent
└── Footer
```

All authenticated pages reuse the same shell.

Public/auth pages reuse the same BIDSETU visual system but use their established layouts.

---

# 41. Route Structure

Suggested:

```text
/
 /about
 /how-it-works
 /procurement
 /guidelines
 /help
 /contact

 /login
 /signup
 /forgot-password
 /reset-password

 /dashboard

 /tenders
 /tenders/new
 /tenders/[id]
 /tenders/[id]/edit

 /bids
 /bids/[id]

 /documents
 /documents/[id]
 /documents/[id]/processing

 /compliance
 /compliance/[analysisId]
 /compliance/[analysisId]/requirements/[requirementId]
 /compliance/[analysisId]/evidence/[evidenceId]

 /risk
 /risk/[id]

 /reports
 /reports/[id]

 /notifications
 /audit-logs

 /profile
 /settings
 /settings/security
 /settings/notifications

 /admin
 /admin/users
 /admin/organizations
 /admin/roles
 /admin/configuration

 /vendor
 /vendor/tenders
 /vendor/tenders/[id]
 /vendor/bids
 /vendor/bids/[id]
 /vendor/documents
 /vendor/compliance
```

Every protected route must enforce server-side authorization.

---

# 42. UI Design System

The four approved reference experiences establish the visual system:

1. Public Home
2. Login
3. Vendor Signup
4. Authenticated Dashboard

All remaining pages must extend this system.

### Colors

```text
Government Blue: #1F6F9F
Deep Navy:       #123B5D
Dark Navy:       #071A2D
Saffron:         #E67E22
Background:      #F5F7FA
White:           #FFFFFF
Primary Text:    #17202A
Secondary Text:  #5F6B76
Success:         #16794C
Warning:         #B7791F
Danger:          #B42318
```

### Component rules

Reuse shared:

- buttons;
- inputs;
- selects;
- checkboxes;
- cards;
- tables;
- badges;
- alerts;
- tabs;
- pagination;
- filters;
- dialogs;
- empty states;
- document viewer;
- evidence panel;
- compliance summary;
- risk indicators.

Do not create separate visual systems for Admin or Vendor.

---

# 43. UI Data Rule

Frontend components must receive operational data through application services/API/database-backed state.

Do not write:

```ts
const tenders = [...]
const vendors = [...]
const complianceScore = 85
```

as permanent product data.

Use:

```text
API → service → MongoDB → UI
```

or an equivalent server-backed flow.

---

# 44. Presentation Data Rule

For SIH presentation, the team may create records using the actual application.

Example:

```text
Procurement Officer
    ↓
Create Tender
    ↓
Add Requirements
    ↓
Vendor Account
    ↓
Submit Bid
    ↓
Upload Documents
    ↓
Run Analysis
    ↓
Persist Results
    ↓
Dashboard displays results
```

This creates real application records.

Do not bypass the application's data model by hardcoding a presentation dashboard.

---

# 45. Empty States

Empty states are required for genuinely empty datasets.

Examples:

```text
No tenders available
No bids available
No documents uploaded
No compliance analyses available
No reports available
No notifications
No audit activity
```

Empty states should provide useful next actions where authorized.

They must not be used as a substitute for implementing the underlying workflow.

---

# 46. Security Requirements

Implement:

- server-side authentication;
- server-side authorization;
- strict RBAC;
- secure password hashing;
- secure sessions;
- rate limiting;
- input validation;
- output safety;
- private document storage;
- signed document access;
- audit logging;
- security headers;
- secure cookies;
- TLS in production;
- least-privilege database access;
- vendor data isolation;
- organization-level access controls.

---

# 47. Security Boundaries

MongoDB must never be directly accessible from the browser.

Object storage must not expose unrestricted public document URLs.

AI API credentials must remain server-side.

The client must never be trusted to determine:

- role;
- organization;
- resource ownership;
- compliance authority.

---

# 48. Security Headers

Configure appropriate production headers, including where compatible:

- Content-Security-Policy;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- Strict-Transport-Security;
- clickjacking protection.

Test CSP against all required frontend functionality.

---

# 49. Logging

Use structured application logging.

Log:

- request ID;
- module;
- operation;
- duration;
- safe error information.

Never log:

- passwords;
- API keys;
- session secrets;
- unnecessary full document contents;
- sensitive personal/vendor information unnecessarily.

---

# 50. Rate Limits

Apply limits to:

- login;
- signup;
- password recovery;
- document upload;
- AI analysis initiation;
- report generation;
- sensitive admin endpoints.

---

# 51. Error Handling

Provide safe user-facing errors for:

- invalid input;
- authentication failure;
- authorization failure;
- missing resource;
- conflicting update;
- file upload failure;
- document-processing failure;
- AI provider failure;
- database failure;
- unexpected server failure.

Never expose stack traces, database connection strings, API keys, or internal exception details.

---

# 52. Testing

## Unit Tests

Test:

- validation;
- authorization;
- requirement rules;
- compliance classification;
- scoring;
- risk classification;
- data transformations.

## Integration Tests

Test:

- authentication;
- authorization;
- tender creation;
- bid submission;
- document upload;
- document processing;
- AI pipeline;
- compliance pipeline;
- report generation.

## Security Tests

Test:

- cross-vendor access;
- privilege escalation;
- unauthorized API calls;
- invalid uploads;
- oversized uploads;
- session expiration;
- client-side role manipulation;
- rate limits;
- document access control;
- prompt-injection handling.

## UI Tests

Test:

- Login;
- Signup;
- Dashboard;
- Tender workflow;
- Bid workflow;
- Document workflow;
- Compliance workflow;
- Evidence viewer;
- responsive layouts.

---

# 53. Critical Security Acceptance Tests

The following must pass:

1. Vendor A cannot access Vendor B's data.
2. Vendor cannot access procurement-officer operations.
3. Procurement Officer cannot access unauthorized organization data.
4. Admin-only endpoints reject other roles.
5. Changing role values in browser requests does not grant access.
6. Expired sessions cannot access protected APIs.
7. Invalid document types are rejected.
8. Oversized files are rejected.
9. Unauthorized storage objects cannot be downloaded.
10. AI output cannot modify authorization.
11. Passwords never appear in logs.
12. Secrets never appear in browser bundles.
13. Sensitive actions create audit records.

---

# 54. Performance

The system should:

- paginate large datasets;
- server-filter large tables;
- lazy-load heavy document views;
- process long-running operations asynchronously;
- avoid blocking HTTP requests on AI analysis;
- provide processing status;
- minimize unnecessary AI calls;
- avoid loading full document collections into the browser.

---

# 55. Storage and Document Access

Document access must be:

```text
Authenticated User
      ↓
Server Authorization
      ↓
Verify Resource Relationship
      ↓
Generate Short-Lived Access
      ↓
Private Object Storage
```

Never expose predictable unrestricted document paths.

---

# 56. Database Transactions / Consistency

Where multiple related MongoDB records must be changed atomically, use MongoDB transactions where supported and appropriate.

Examples:

- critical tender state transitions;
- bid submission finalization;
- role assignment changes;
- analysis completion state.

Do not introduce transactions where a simple idempotent operation is sufficient.

---

# 57. Idempotency

Operations that may be retried should be idempotent where practical.

Important examples:

- document-processing jobs;
- AI analysis jobs;
- report generation;
- notification creation.

Use unique operation/job identifiers where necessary.

---

# 58. Data Versioning

Persist versions for:

- compliance rules;
- scoring policy;
- risk policy;
- AI prompt;
- AI model;
- analysis engine.

This allows old results to remain understandable after system updates.

---

# 59. Configuration

Configuration that affects business behavior should not be buried in frontend code.

Examples:

- file-size limits;
- processing settings;
- scoring policies;
- risk thresholds;
- enabled AI provider;
- feature availability.

Secrets remain environment-managed.

Business configuration should be appropriately persisted and audited when changed.

---

# 60. Deployment

Target architecture:

```text
Users
  ↓
HTTPS
  ↓
Next.js Application
  ↓
MongoDB
  +
Private Object Storage
  +
Gemini API
  +
Optional Background Worker/Queue
```

The exact hosting vendors can be selected during deployment.

The implementation should not depend on an unnecessary cloud-specific architecture.

---

# 61. Production Requirements

Production deployment must have:

- HTTPS;
- secure cookies;
- environment-specific secrets;
- private database access;
- private document storage;
- backups;
- error monitoring;
- structured logging;
- rate limiting;
- security headers;
- controlled CORS;
- appropriate session expiration.

---

# 62. Backup and Recovery

MongoDB production data must have an appropriate backup strategy.

The team must be able to restore application data.

Document storage must have an appropriate recovery/versioning strategy where supported.

---

# 63. Data Retention

Retention must be configurable according to deployment requirements and applicable organizational/legal requirements.

Do not retain documents indefinitely without a defined reason.

Deletion must respect authorization and required audit/retention rules.

---

# 64. Accessibility

Implement:

- semantic HTML;
- keyboard navigation;
- visible focus;
- accessible forms;
- accessible tables;
- non-color status communication;
- logical heading hierarchy;
- sufficient contrast;
- accessible dialogs and menus.

---

# 65. Public Page Technical Requirements

Public pages must be:

- responsive;
- accessible;
- indexable where appropriate;
- free of private application data.

Use meaningful:

- page titles;
- meta descriptions;
- headings;
- link labels.

Authenticated/private pages should not expose private data to search engines.

---

# 66. UI Quality Gate

Before accepting a new screen, verify:

### Visual

- Does it use the same BIDSETU shell?
- Same typography?
- Same colors?
- Same spacing?
- Same buttons?
- Same tables?
- Same cards?
- Same footer?
- Same visual density?

### Functional

- Is data loaded from the backend?
- Are permissions enforced?
- Are loading/error/empty states present?
- Are actions connected to actual workflows?

### Integrity

- Is any operational data hardcoded?
- Is any fabricated government information shown?
- Are prohibited dummy/demo/test concepts present?

If any answer violates the product rules, the screen is not complete.

---

# 67. Technical Definition of Done

A feature is complete only when:

1. UI exists.
2. Backend logic exists.
3. MongoDB persistence exists where applicable.
4. Authorization exists.
5. Validation exists.
6. Loading state exists.
7. Error state exists.
8. Empty state exists where applicable.
9. Audit behavior exists where required.
10. Tests cover critical behavior.
11. No secrets are committed.
12. No hardcoded operational data is required.
13. The feature uses the BIDSETU design system.
14. The feature works with actual application-created records.

---

# 68. Core Technical Workflow

```text
AUTHENTICATION
      ↓
AUTHORIZED WORKSPACE
      ↓
TENDER
      ↓
REQUIREMENTS
      ↓
VENDOR BID
      ↓
DOCUMENT UPLOAD
      ↓
FILE VALIDATION
      ↓
PDF/DOCX + OCR
      ↓
TEXT CLEANING
      ↓
STRUCTURED DATA
      ↓
REQUIREMENT EXTRACTION
      ↓
ENTITY EXTRACTION
      ↓
SEMANTIC MATCHING
      ↓
RULE VALIDATION
      ↓
NUMERIC / DATA VALIDATION
      ↓
MISSING / MISMATCH DETECTION
      ↓
COMPLIANT / REVIEW / NON-COMPLIANT
      ↓
COMPLIANCE SCORE
      ↓
RISK CLASSIFICATION
      ↓
EVIDENCE + CLAUSE
      ↓
AI EXPLANATION
      ↓
REPORT
      ↓
AUDIT
```

This directly reflects the supplied architecture's defined processing, AI/NLP, compliance, and risk/explainability layers. fileciteturn1file0L87-L144

---

# 69. Final Technical Principle

**The UI is not the product. The connected system behind the UI is the product.**

BIDSETU must therefore be implemented so that:

- users create real records;
- MongoDB persists them;
- documents are actually processed;
- AI actually analyzes relevant content;
- compliance results are actually calculated;
- evidence is actually linked;
- risk is actually derived;
- reports are actually generated;
- audit records are actually stored.

The approved UI is the presentation layer of that system, not a substitute for it.
