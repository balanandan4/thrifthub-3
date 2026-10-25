# ThriftHub

> **Student-to-Student Educational Resource Sharing and Reselling System**  
> *Tagline: "Good Things Deserve a Second Story."*

ThriftHub is a full-stack web application designed for college campuses. It enables students to buy, sell, share, and reuse pre-owned educational resources—including core engineering textbooks, Casio scientific calculators, handwritten study materials/PYQs, and drawing/laboratory instruments.

---

## 1. Problem Statement & Objectives

College students purchase expensive textbooks, calculators, and laboratory kits each semester. Once courses finish, these items often sit unused in dorms while incoming students are forced to buy the exact same materials at full retail prices.

ThriftHub solves this by providing:
- A centralized, organized campus marketplace with structured educational categories.
- Dual-role capabilities: any student can act as both buyer and seller.
- A transparent purchase request lifecycle (*Pending → Accepted / Declined → Completed Handover*).
- An immutable audit trail and progress timeline for every transaction.
- Gemini 3.8 Flash AI integration for fair pricing suggestions and semester syllabus matching.
- Administrator management, interactive Recharts statistics, student directory, and listings moderation.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS (Zero-Pill discipline)
- **Icons & Visuals**: Lucide React, Custom SVG Category Illustrations
- **Charts & Telemetry**: Recharts (Donut, Bar, Area charts)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (via WebAssembly `sql.js` with disk synchronization to `./data/thrifthub.sqlite`)
- **Authentication**: JWT, bcrypt password hashing, HTTP cookies & Bearer tokens
- **AI Intelligence**: `@google/genai` TypeScript SDK (server-side with `gemini-3.8-flash`)

---

## 3. Demo Accounts (1-Click Evaluation)

The application includes pre-configured verified student and administrator accounts in `./server/db.ts`:

| Role | Name | Email | Password | Details |
|---|---|---|---|---|
| **Student (Seller)** | Alex Carter | `alex.carter@thrifthub.edu` | `Student@123` | CS Junior; has active listings for DSA, Math & Notes |
| **Student (Seller)** | Priya Sharma | `priya.sharma@thrifthub.edu` | `Student@123` | ECE Senior; has Casio calculator & Digital Logic listings |
| **Student (Buyer)** | David Chen | `david.chen@thrifthub.edu` | `Student@123` | Mech Sophomore; actively sends requests |
| **Administrator** | Administrator | `admin@thrifthub.edu` | `Admin@123` | Campus Moderator; access to `/admin` dashboard |

*Note: You can switch between any demo user instantly using the "Demo Roles" dropdown in the navbar or the links in the footer!*

---

## 4. Key Workflows & Features

1. **Student Registration & Login**: Full registration with branch, year, college ID, and phone. Passwords hashed using bcrypt.
2. **Resource Listing with Gemini AI Autofill**: Enter a textbook or tool title, click *"Auto-Fill with Gemini AI"*, and receive fair resale prices, semester recommendations, and clean descriptions.
3. **Explore & Search Catalog**: Real-time filtering by category, semester (Sem 1 to Sem 8), availability (Available, Sold), and sort order.
4. **Purchase Request Lifecycle**:
   - Buyer clicks *"Request Item"*, provides message and preferred contact info.
   - Status updates to `Pending`.
   - Seller receives an in-app notification and reviews request in *Incoming Requests*.
   - Seller chooses **Accept** (marks item as `Requested`) or **Decline**.
   - After meeting on campus for handover, either party marks **Completed** (marks item as `Sold`).
5. **Interactive Progress Timeline**: Both parties can view the complete audit timeline for every request.
6. **Administrator Console (`/admin`)**:
   - Calculated statistics from SQLite (Students, Resources, Completed Exchanges, Value Saved).
   - Recharts visual graphs for category distribution, request status, and monthly activity.
   - Student directory and moderation table to remove inappropriate listings with automated audit logs.

---

## 5. Project Structure

```
├── data/                      # Persistent SQLite storage
│   └── thrifthub.sqlite       # Database binary file
├── docs/                      # SE Mini Project Documentation
│   ├── SRS.md                 # Software Requirements Specification
│   ├── SYSTEM_ARCHITECTURE.md # System Architecture & Layering
│   ├── ERD.md                 # Entity Relationship Diagram
│   ├── DFD.md                 # Data Flow Diagrams (Level 0 & Level 1)
│   ├── USE_CASE_DIAGRAM.md    # Actor & Use Case Specifications
│   └── TEST_CASES.md          # Automated & Manual Test Cases
├── server/                    # Backend Source
│   ├── db.ts                  # SQLite DB manager, schema & initial seeds
│   └── api.ts                 # Express REST API routes & Gemini integration
├── src/                       # Frontend React Application
│   ├── components/            # Reusable UI components
│   │   ├── Navbar.tsx         # Top bar contract implementation
│   │   ├── Footer.tsx         # Academic disclaimer & links
│   │   ├── ResourceCard.tsx   # Product card display
│   │   ├── CategoryVisual.tsx # Zero-broken-image SVG illustrations
│   │   ├── AddResourceModal.tsx # Listing creation with Gemini AI
│   │   ├── RequestModal.tsx   # Buyer request submission
│   │   ├── RequestTimelineModal.tsx # Visual request tracking modal
│   │   ├── AuthModals.tsx     # Login/Register with 1-click test fills
│   │   ├── AiMatcherModal.tsx # Gemini syllabus matcher
│   │   └── NotificationDrawer.tsx # In-app notification drawer
│   ├── views/                 # Main page views
│   │   ├── HomeView.tsx       # Landing page
│   │   ├── ExploreView.tsx    # Search & catalog view
│   │   ├── ResourceDetailView.tsx # Item detail page
│   │   ├── DashboardView.tsx  # Student dashboard (Listings, Requests)
│   │   ├── AdminView.tsx      # Moderator console & Recharts
│   │   └── AboutView.tsx      # In-app interactive SE documentation
│   ├── api.ts                 # Client REST API wrapper
│   ├── types.ts               # TypeScript data models
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Client entry point
├── server.ts                  # Express + Vite server entry point
├── package.json
└── README.md
```

---

## 6. How to Run the Project

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Server will start at `http://localhost:3000`.

3. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 7. Software Engineering Documentation

Full requirements, diagrams, and test specifications can be viewed directly inside the application under the **Project Docs** tab, or in the `./docs/` folder:
- [SRS Specification](./docs/SRS.md)
- [System Architecture](./docs/SYSTEM_ARCHITECTURE.md)
- [Entity Relationship Diagram (ERD)](./docs/ERD.md)
- [Data Flow Diagrams (DFD)](./docs/DFD.md)
- [Use Case Diagrams](./docs/USE_CASE_DIAGRAM.md)
- [Test Cases & Results](./docs/TEST_CASES.md)
