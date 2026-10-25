# Entity Relationship Diagram (ERD) & Schema Overview

## 1. Relational Database Schema Design

ThriftHub uses a relational SQLite database structure with foreign keys, indexes, and constraints.

```
+--------------------------------------------------------------------------------+
|                                    USERS                                       |
+--------------------------------------------------------------------------------+
| PK  id             TEXT          Unique student identifier (usr_*)             |
|     full_name      TEXT          Student's full name                           |
|     email          TEXT UNIQUE   College email address (Indexed)               |
|     password_hash  TEXT          Bcrypt password hash                          |
|     role           TEXT          'student' or 'admin'                          |
|     college_id     TEXT          Roll number / student ID                      |
|     branch         TEXT          Academic department / major                   |
|     year           TEXT          Current academic year                         |
|     phone          TEXT          Contact phone / WhatsApp                      |
|     bio            TEXT          Student bio notes                             |
|     created_at     DATETIME      Account creation timestamp                    |
|     updated_at     DATETIME      Last profile update timestamp                 |
+--------------------------------------------------------------------------------+
        |                            |                           |
        | 1:N (seller_id)            | 1:N (buyer_id)            | 1:N (admin_id)
        v                            v                           v
+-----------------------------+  +------------------------+  +--------------------+
|          RESOURCES          |  |        REQUESTS        |  |     AUDIT_LOGS     |
+-----------------------------+  +------------------------+  +--------------------+
| PK  id             TEXT     |  | PK  id            TEXT |  | PK  id        TEXT |
| FK  seller_id      TEXT     |  | FK  resource_id   TEXT |  | FK  admin_id  TEXT |
|     title          TEXT     |  | FK  buyer_id      TEXT |  |     action    TEXT |
|     category       TEXT     |  | FK  seller_id     TEXT |  |     target_typeTEXT|
|     subject        TEXT     |  |     message       TEXT |  |     target_id TEXT |
|     semester       TEXT     |  |     contact_info  TEXT |  |     details   TEXT |
|     author_or_brandTEXT     |  |     status        TEXT |  |     created_at     |
|     price          REAL     |  |     created_at         |  +--------------------+
|     condition      TEXT     |  |     updated_at         |
|     description    TEXT     |  |     resolved_at        |
|     image_url      TEXT     |  +------------------------+
|     availability   TEXT     |              |
|     created_at     DATETIME |              | 1:N
|     updated_at     DATETIME |              v
+-----------------------------+  +------------------------+
                                 |    REQUEST_HISTORY     |
                                 +------------------------+
                                 | PK  id            TEXT |
                                 | FK  request_id    TEXT |
                                 |     previous_statusTEXT|
                                 |     new_status    TEXT |
                                 | FK  actor_id      TEXT |
                                 |     note          TEXT |
                                 |     created_at    DATETIME
                                 +------------------------+
```

---

## 2. Table Constraints & Indexing Strategy

1. **Foreign Keys**:
   - `resources.seller_id` → `users.id` (`ON DELETE CASCADE`)
   - `requests.resource_id` → `resources.id` (`ON DELETE CASCADE`)
   - `requests.buyer_id` → `users.id` (`ON DELETE CASCADE`)
   - `requests.seller_id` → `users.id` (`ON DELETE CASCADE`)
   - `request_history.request_id` → `requests.id` (`ON DELETE CASCADE`)
   - `notifications.user_id` → `users.id` (`ON DELETE CASCADE`)

2. **Indexes**:
   - `idx_resources_category`: Accelerates catalog filtering by category.
   - `idx_resources_availability`: Filters available vs sold items quickly.
   - `idx_resources_seller`: Speeds up retrieval in "My Listings".
   - `idx_requests_buyer` / `idx_requests_seller`: Fast lookups for student dashboards.
   - `idx_notifications_user`: Optimizes unread notification polling.
