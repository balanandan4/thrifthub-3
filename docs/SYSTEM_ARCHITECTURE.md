# System Architecture Document

## 1. Architectural Style & Patterns

ThriftHub follows a **Full-Stack Layered Architecture** with clear separation of concerns across presentation, business logic, persistence, and external AI services.

```
+-------------------------------------------------------------------------------+
|                             PRESENTATION LAYER                                |
|  - React 19 Single Page Application                                           |
|  - Tailwind CSS 4 with Zero-Pill Typography Discipline                        |
|  - Lucide React Iconography                                                   |
|  - Recharts Visual Analytics Component Engine                                 |
+-------------------------------------------------------------------------------+
                                      |
                           (JSON via RESTful HTTP)
                                      v
+-------------------------------------------------------------------------------+
|                            API & ROUTING LAYER                                |
|  - Express.js Application Server (server.ts)                                  |
|  - API Router (/api/auth, /api/resources, /api/requests, /api/admin)          |
|  - JWT Authentication & Role Authorization Middleware                          |
|  - Cookie-Parser & Request Body Validation                                     |
+-------------------------------------------------------------------------------+
                   |                                           |
          (SQL Queries)                           (Server-Side SDK)
                   v                                           v
+-------------------------------------+     +-----------------------------------+
|         PERSISTENCE LAYER           |     |         AI SERVICES LAYER         |
|  - WebAssembly SQLite (sql.js)      |     |  - @google/genai TypeScript SDK   |
|  - Disk Sync Engine (data/thrifthub)|     |  - Model: gemini-3.8-flash        |
|  - Cascading Constraints & Indexes  |     |  - Features: Pricing & Matching   |
+-------------------------------------+     +-----------------------------------+
```

---

## 2. Key Architectural Decisions

1. **Integrated Dev Server**: In development mode, the Express server mounts Vite's dev middleware (`vite.middlewares`), allowing single-command startup on port 3000 (`tsx server.ts`).
2. **Zero-Setup SQLite Persistence**: Rather than requiring external database server processes (which can fail or require manual credentials), ThriftHub utilizes `sql.js` with automated binary disk exporting. All changes survive restarts.
3. **Server-Authoritative State Machine**: A student cannot directly manipulate the availability of an item or another student's request status. All status changes validate authorization on the backend and record history rows.
4. **Resilient Imagery**: All cards implement styled SVG category visual containers, ensuring the interface never displays broken image frames even if external image hosts fail or lack network access.
