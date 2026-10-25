# Data Flow Diagrams (DFD)

## 1. Level 0 Context-Level DFD

The Level 0 Data Flow Diagram portrays the entire ThriftHub system as a single process interacting with its external entities: Student Seller, Student Buyer, and Campus Administrator.

```
                  [Listing Data: Title, Category, Price, Condition]
  +----------------+ ---------------------------------------------> +-----------------------+
  |                |                                                |                       |
  | Student Seller | <--------------------------------------------- |                       |
  |                |    [Request Notifications & Buyer Notes]       |                       |
  +----------------+                                                |                       |
                                                                    |       THRIFTHUB       |
                  [Search Query: Category, Semester, Keyword]       |   EDUCATIONAL SHARING |
  +----------------+ ---------------------------------------------> |        SYSTEM         |
  |                |                                                |      (PROCESS 0)      |
  |  Student Buyer | <--------------------------------------------- |                       |
  |                |   [Resource Details, Pricing & Availability]   |                       |
  |                | ---------------------------------------------> |                       |
  |                |   [Purchase Request: Message, Contact Details] |                       |
  +----------------+                                                |                       |
                                                                    |                       |
  +----------------+ [Audit Inspection & Listing Moderation]        |                       |
  | Administrator  | <============================================> |                       |
  +----------------+                                                +-----------------------+
```

---

## 2. Level 1 DFD: Subsystems & Data Stores

The Level 1 DFD decomposes ThriftHub into its core computational processes and persistent data stores.

```
                           +------------------------+
                           |  1.0 AUTHENTICATION &  | <====> [D1: USERS STORE]
[Student Credentials] ---> |   PROFILE MANAGEMENT   |
                           +------------------------+
                                       |
                   (Verified Auth User Session / JWT)
                                       v
                           +------------------------+
[New Listing Details] ---> |  2.0 RESOURCE LISTING  | -----> [D2: RESOURCES STORE]
                           |       & AI ASSIST      | <===== [Gemini 3.8 Flash AI]
                           +------------------------+
                                       |
                           +------------------------+
[Buyer Search Query] ----> | 3.0 SEARCH, DISCOVERY  | <----- [D2: RESOURCES STORE]
                           |       & FILTERING      |
                           +------------------------+
                                       |
                   (Selected Item ID for Purchase)
                                       v
                           +------------------------+ -----> [D3: REQUESTS STORE]
[Purchase Request] ------> | 4.0 PURCHASE REQUEST   |
                           |   LIFECYCLE ENGINE     | -----> [D4: REQUEST_HISTORY]
                           +------------------------+
                                |              |
                                v              v
                    [D5: NOTIFICATIONS]   [D2: RESOURCES STORE]
                                           (Status: Available/Requested/Sold)
                                       |
                           +------------------------+
[Admin Moderation] ------> | 5.0 MODERATION, CHARTS | <----> [D6: AUDIT_LOGS]
                           |     & AUDIT ENGINE     | <----> [All Data Stores]
                           +------------------------+
```

### Process Descriptions:
- **Process 1.0**: Validates registration credentials, hashes passwords via bcrypt, and issues JWT tokens.
- **Process 2.0**: Validates resource fields and persists listings into `resources` table. Optionally invokes Gemini API for price suggestion.
- **Process 3.0**: Filters catalog records based on availability, department, semester, and search terms.
- **Process 4.0**: Enforces state machine transitions (*Pending → Accepted → Completed*), updates availability flag, and records immutable history entries.
- **Process 5.0**: Generates Recharts platform statistics and logs administrative interventions into `audit_logs`.
