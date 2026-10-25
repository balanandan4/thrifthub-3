# Use Case Diagram & Actor Specifications

## 1. Primary Actors

1. **Student as Buyer**: Browses materials, requests items, coordinates in-person pickup, tracks request status.
2. **Student as Seller**: Posts listings, receives purchase requests, accepts/declines, marks exchanges completed.
3. **Campus Administrator**: Moderates platform listings, audits transactions, inspects analytics.
4. **Gemini 3.8 Flash AI Assistant (System Actor)**: Suggests pricing and matches semester curriculum.

---

## 2. Textual Use Case Diagram

```
                              +---------------------------------------------+
                              |                  THRIFTHUB                  |
                              +---------------------------------------------+
                                     |
    (Student as Buyer) ------------> (UC-01: Register & Log In)
                                     |
    (Student as Seller) -----------> (UC-02: Post Educational Resource)
                                     |   |-- <<include>> (Gemini AI Pricing Assist)
                                     |
    (Student as Buyer) ------------> (UC-03: Browse, Search & Filter Catalog)
                                     |   |-- <<extend>> (AI Syllabus Matcher)
                                     |
    (Student as Buyer) ------------> (UC-04: Submit Purchase Request)
                                     |
    (Student as Seller) -----------> (UC-05: Review Incoming Requests)
                                     |
    (Student as Seller) -----------> (UC-06: Accept or Decline Request)
                                     |   |-- <<include>> (Emit In-App Notification)
                                     |   |-- <<include>> (Log State in Request History)
                                     |
    (Buyer / Seller) --------------> (UC-07: Track Progress Timeline)
                                     |
    (Buyer / Seller) --------------> (UC-08: Mark Handover Completed & Item Sold)
                                     |
    (Administrator) ---------------> (UC-09: Moderate Inappropriate Listings)
                                     |   |-- <<include>> (Record Action in Audit Log)
                                     |
    (Administrator) ---------------> (UC-10: View Campus Analytics & User Directory)
```

---

## 3. Detailed Use Case Narrative: UC-04 Submit Purchase Request

- **Primary Actor**: Student as Buyer
- **Preconditions**:
  1. Student is registered and authenticated.
  2. Target resource has `availability = 'Available'`.
  3. Buyer is not the seller of the resource.
- **Main Success Scenario**:
  1. Buyer opens resource detail page.
  2. Buyer clicks *"Send Purchase Request"*.
  3. System prompts for optional note (preferred meeting location/time) and student contact phone.
  4. Buyer confirms submission.
  5. System validates request, generates unique request ID (`req_*`), sets status to `Pending`, and logs entry in `request_history`.
  6. System creates notification for seller.
  7. Buyer is directed to their *My Requests* dashboard.
- **Postconditions**: Request is stored in database; seller is notified.
