# Software Requirements Specification (SRS)

## 1. Introduction
### 1.1 Purpose
This Software Requirements Specification (SRS) defines the functional and non-functional requirements for **ThriftHub: Student-to-Student Educational Resource Sharing and Reselling System**.

### 1.2 Scope
ThriftHub operates within a college campus ecosystem. It allows enrolled students to list pre-owned textbooks, scientific calculators, study materials, and laboratory instruments, while allowing junior or peer students to search, filter, and send purchase requests for these items. Physical handovers are conducted on campus.

---

## 2. Overall Description
### 2.1 User Perspectives & Roles
1. **Student as Buyer**: Can explore available resources, search by course or model, send structured purchase requests, and monitor request status timelines.
2. **Student as Seller**: Can post educational materials, provide prices and condition reports, receive incoming requests, and accept or reject them.
3. **Campus Administrator**: Responsible for platform governance, monitoring active listings, removing inappropriate or fraudulent items, and auditing system events.

### 2.2 Operating Environment
- Client: Modern web browsers (Chrome, Edge, Firefox, Safari)
- Server: Node.js runtime with Express
- Database: SQLite (via sql.js WebAssembly engine) with disk persistence

---

## 3. Specific Functional Requirements

### 3.1 Authentication & Profile Subsystem
- **FR-1.1**: The system shall allow students to register with their name, college email, password, department, and academic year.
- **FR-1.2**: Passwords shall be encrypted with bcrypt (salt rounds = 10) prior to database insertion.
- **FR-1.3**: The system shall support secure login via JSON Web Tokens (JWT) stored in HTTP cookies or Bearer headers.
- **FR-1.4**: Users shall be able to update their profile bio, branch, year, and phone number.

### 3.2 Resource Listing Subsystem
- **FR-2.1**: Sellers shall be able to post items under defined categories: *Textbooks*, *Calculators*, *Notes & Study Materials*, *Drawing & Lab Materials*, *Other College Essentials*.
- **FR-2.2**: The system shall validate that price is a positive numeric amount in Indian Rupees (₹).
- **FR-2.3**: Sellers may leverage the Gemini 3.8 Flash AI Assistant to automatically infer standard college subjects, fair price ranges, and curriculum semesters.
- **FR-2.4**: Sellers can update their listing's details, mark items as `Available` or `Sold`, or delete their listings.

### 3.3 Search, Filter & Discovery Subsystem
- **FR-3.1**: The catalog shall support real-time keyword search across title, author, subject, and description.
- **FR-3.2**: Users shall be able to filter listings by Category, Semester (Sem 1 to Sem 8), Availability (`Available`, `Sold`), and sort by price.
- **FR-3.3**: The AI Syllabus Matcher shall allow students to input their branch and semester to discover relevant textbooks and calculators.

### 3.4 Purchase Request & Handover Subsystem
- **FR-4.1**: Buyers can submit a purchase request for any `Available` item.
- **FR-4.2**: The system shall disallow a seller from requesting their own listed resource.
- **FR-4.3**: The system shall reject duplicate active requests from the same buyer for the same item.
- **FR-4.4**: Sellers shall be able to `Accept` or `Reject` incoming requests with an optional message.
- **FR-4.5**: Accepting a request updates resource availability to `Requested`.
- **FR-4.6**: Completing an exchange transitions request status to `Completed` and resource availability to `Sold`.

### 3.5 Timeline & Audit Subsystem
- **FR-5.1**: Every status change must record a history record with timestamp, previous status, new status, and responsible actor.
- **FR-5.2**: Administrators shall have access to system audit logs and Recharts statistics.

---

## 4. Non-Functional Requirements

- **NFR-1 Usability**: Intuitive user interface adhering to WCAG AA contrast guidelines and zero-pill typographic discipline.
- **NFR-2 Response Time**: Catalog searches and API queries shall complete in under 150ms.
- **NFR-3 Security**: Server-side role verification for all administrative and user-restricted operations.
- **NFR-4 Data Integrity**: Parameterized queries to prevent SQL injection vulnerabilities.
