# Software Testing & Verification Report

## 1. Test Strategy Overview
Testing for ThriftHub encompasses:
- Functional unit and route testing for user authentication, resource listing, and purchase request state transitions.
- Security and authorization verification (preventing self-requests, unauthorized admin access).
- UI usability and rendering verification.

---

## 2. Test Cases Specification

| ID | Title | Test Steps | Expected Output | Status |
|---|---|---|---|---|
| **TC-01** | Student Registration | 1. Open register modal.<br>2. Submit valid name, college email, password, and branch.<br>3. Inspect response & DB. | Account created with HTTP 201; password stored as bcrypt hash; JWT cookie returned. | **PASSED** |
| **TC-02** | Invalid Login Handling | 1. Enter non-existent email or wrong password.<br>2. Submit login form. | HTTP 401 Unauthorized returned; user sees clear error message; session not created. | **PASSED** |
| **TC-03** | 1-Click Demo Login | 1. Select "Alex (CS Junior Seller)" from demo roles.<br>2. Check auth state. | Immediate login without typing; navbar displays Alex Carter's profile and active listings. | **PASSED** |
| **TC-04** | Resource Creation | 1. Fill title, category, price, condition.<br>2. Click submit. | Resource record inserted into SQLite; status defaults to `Available`; appears in catalog. | **PASSED** |
| **TC-05** | Gemini AI Assist | 1. Type "Data Structures Weiss".<br>2. Click "Auto-Fill with Gemini AI". | Gemini analyzes title, sets subject to Data Structures, suggests fair resale price, and populates description. | **PASSED** |
| **TC-06** | Self-Request Prevention | 1. Log in as Alex Carter.<br>2. Try requesting Alex's own textbook. | Backend rejects with HTTP 400 "You cannot request your own listed item." | **PASSED** |
| **TC-07** | Request Creation & Lifecycle | 1. Log in as David Chen (buyer).<br>2. Send request for Priya's calculator.<br>3. Log in as Priya (seller).<br>4. Accept request. | Status transitions to `Accepted`; resource availability changes to `Requested`; history recorded. | **PASSED** |
| **TC-08** | Exchange Completion | 1. Click "Complete Exchange".<br>2. Check request and item state. | Request status updates to `Completed`; item availability marks as `Sold`; notifications sent. | **PASSED** |
| **TC-09** | Admin Route Authorization | 1. Non-admin user attempts GET on `/api/admin/stats`. | Server responds with HTTP 403 Forbidden; access denied message shown. | **PASSED** |
| **TC-10** | Admin Moderation & Audit | 1. Admin removes inappropriate listing.<br>2. Check audit logs. | Listing deleted; seller receives notification; permanent entry recorded in `audit_logs`. | **PASSED** |
| **TC-11** | Zero Broken Images | 1. View items without external image URL. | Renders styled, thematic SVG category visual with gradient background; no broken frames. | **PASSED** |
