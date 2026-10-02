# BIDSETU — API Reference & Specification

> **Base URL (Next.js Application)**: `http://localhost:3000/api`  
> **Base URL (Python AI Service)**: `http://localhost:8000`

---

## 1. Authentication & User Management Endpoints

### `POST /api/auth/login`
Authenticates a user and sets an HTTP-only JWT cookie.

* **Request Body**:
```json
{
  "email": "officer@mnre.gov.in",
  "password": "officerPass2026"
}
```

* **Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "usr-001",
    "name": "Rajesh Kumar",
    "email": "officer@mnre.gov.in",
    "role": "PROCUREMENT_OFFICER",
    "organizationId": "org-mnre"
  }
}
```

---

### `POST /api/auth/register`
Registers a new vendor or evaluator account.

* **Request Body**:
```json
{
  "name": "Tata Power Renewable",
  "email": "contact@tatapowerren.com",
  "password": "secureVendorPassword123!",
  "role": "VENDOR",
  "organizationName": "Tata Power Renewable Energy Ltd"
}
```

---

### `GET /api/auth/me`
Fetches current session user information from JWT token.

* **Response (200 OK)**:
```json
{
  "authenticated": true,
  "user": {
    "id": "usr-001",
    "name": "Rajesh Kumar",
    "email": "officer@mnre.gov.in",
    "role": "PROCUREMENT_OFFICER"
  }
}
```

---

## 2. Document & OCR Processing Endpoints

### `GET /api/documents`
Lists all uploaded procurement documents.

---

### `POST /api/documents/upload`
Uploads a new PDF / Image document into MongoDB and triggers document processing.

* **Request Header**: `Content-Type: multipart/form-data`
* **Form Data**:
  - `file`: Document File (`.pdf`, `.png`, `.jpg`)
  - `category`: String (`GST_CERTIFICATE`, `FINANCIAL_TURNOVER`, etc.)

---

### `GET /api/documents/[id]/ocr`
Retrieves extracted OCR text, bounding boxes, confidence scores, and structured key-value fields.

* **Response (200 OK)**:
```json
{
  "success": true,
  "documentId": "doc-1726354890",
  "engine": "PaddleOCR v2.7.3",
  "overallConfidence": 0.973,
  "pagesProcessed": 1,
  "pages": [
    {
      "pageNumber": 1,
      "text": "GSTIN: 07WKMCP4023I9ZY\nLegal Name: Pragati Micro Control Systems...",
      "confidence": 0.973,
      "blocks": [
        {
          "text": "GSTIN: 07WKMCP4023I9ZY",
          "confidence": 0.985,
          "bbox": [320.0, 510.0, 940.0, 565.0]
        }
      ]
    }
  ],
  "structuredFields": [
    {
      "key": "gstin",
      "label": "GST Identification Number",
      "category": "IDENTITY",
      "value": "07WKMCP4023I9ZY",
      "confidence": 0.985
    }
  ]
}
```

---

### `POST /api/documents/[id]/ocr`
Forces re-execution of PaddleOCR on an existing document.

---

## 3. Tender & Bid Verification Endpoints

### `GET /api/tenders`
Lists active tender requirement specifications.

### `POST /api/tenders`
Defines a new tender specification with eligibility criteria and financial thresholds.

### `GET /api/bids/[id]`
Retrieves full bid proposal details, submitted document references, and compliance score breakdown.

### `POST /api/compliance`
Executes AI NLI evaluation and rule-engine verification against a target bid submission.

---

## 4. Risk Analytics & Audit Trail Endpoints

### `GET /api/risk`
Retrieves overall platform risk distribution, collusion flags, turnover anomaly stats, and debarment matches.

### `GET /api/audit-logs`
Retrieves immutable security audit logs for compliance tracking.

### `GET /api/admin`
Retrieves platform-wide system health, database metrics, and active processing queue statistics.

---

## 5. Python AI Microservice Endpoints (`http://localhost:8000`)

### `GET /health`
Diagnostic endpoint reporting microservice status, loaded PaddleOCR model version, and system CPU/GPU capabilities.

* **Response (200 OK)**:
```json
{
  "status": "healthy",
  "service": "BIDSETU PaddleOCR AI Service",
  "paddleocr": true,
  "pymupdf": true,
  "opencv": true
}
```

---

### `POST /ocr/process`
Main OCR processing route for PDF & image files.

* **Request Header**: `Content-Type: multipart/form-data`
* **Form Data**:
  - `file`: Document Binary File
  - `documentId`: String ID
  - `forceOcr`: Boolean (`true` / `false`)
