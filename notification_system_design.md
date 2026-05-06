# Stage 1 – Campus Notification Priority Inbox

## Overview

The campus notifications platform receives a continuous stream of updates — Placements, Results, and Events. With high notification volume, users were losing track of what mattered most. This design document explains the Priority Inbox system implemented to surface the top‑N most important notifications at any given time.

---

## Problem

Students receive many notifications daily. Without prioritization, critical placement and result updates get buried under lower‑priority event announcements.

## Solution: Composite Priority Score

Each notification is assigned a **composite score** computed as:

```
score = (TYPE_WEIGHT × 1,000,000,000,000) + epoch_milliseconds(Timestamp)
```

### Type Weights

| Type      | Weight | Reason                                   |
|-----------|--------|------------------------------------------|
| Placement | 3      | Highest impact — job/internship alerts   |
| Result    | 2      | Academic importance                      |
| Event     | 1      | Informational, least time-sensitive      |

The large multiplier (1e12) guarantees that **type always dominates** over recency. Within the same type, **newer notifications rank higher** via the epoch timestamp component.

---

## Algorithm

```
1. Fetch all notifications from the API (live, no caching)
2. For each notification:
   a. Look up its TYPE_WEIGHT
   b. Parse Timestamp → epoch milliseconds
   c. score = TYPE_WEIGHT * 1e12 + epochMs
3. Sort all notifications by score (descending)
4. Return top N
```

**Time Complexity:** O(n log n) — dominated by the sort step.  
**Space Complexity:** O(n) — scored notification array in memory.

---

## Handling Continuously Arriving Notifications

Because new notifications keep arriving, the system **never caches** results. Every call to `getTopPriorityNotifications(n)` performs a fresh API fetch and re‑ranks from scratch. This means:

- No stale data
- No need for a database or persistent store
- The top‑N window always reflects the true current state

For a production-scale system, this could be improved with:
- A priority queue (max-heap) that accepts push operations in O(log n)
- SSE / WebSocket feed from the backend to update the heap incrementally
- Redis sorted sets for distributed environments

---

## Output

Running `node priorityInbox.js` prints the top 10 notifications ranked by importance:

```
════════════════════════════════════════════════════════════
   🔔  Top 10 Priority Notifications
════════════════════════════════════════════════════════════

  01. 💼 [Placement] Advanced Micro Devices Inc. hiring
       ID: 8a7412bd-...   |   Time: 2026-04-22 17:49:42

  02. 💼 [Placement] CSX Corporation hiring
       ...
```

---

## Files

| File | Purpose |
|------|---------|
| `notification_app_be/priorityInbox.js` | Main Stage 1 entry point |
| `logging_middleware/logger.js` | Centralized logging to evaluation service |

---

*Submitted by: p.akshaya | Roll No: av.sc.u4aie23135*
