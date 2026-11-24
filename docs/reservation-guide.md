# Reservation System & Page Decommission Guide

This document explains the current state of the reservation system on the Waldhaus am See website and provides instructions on how to integrate the new reservation system in the future.

---

## 1. Current State: Reservation Page Completely Disabled

Per the requirement, the entire reservation page is decommissioned:

* **Reservation Page (`/contact`)**:
  * The entire route (`Ref/src/app/(site)/contact/page.tsx`) is commented out and triggers `notFound()`.
  * All original JSX and logic have been preserved inside comments within that file.
* **Reservation API (`/api/inquiries`)**:
  * Deactivated and returns `503 Service Unavailable`.
  * The original inquiry handling logic is preserved in comments within `Ref/src/app/api/inquiries/route.ts`.
* **Reserve Buttons (Kept Visually Across the Entire Site)**:
  * Top navigation header: **"RESERVE"** button (`Ref/src/components/header.tsx`) ➔ Kept, `href="#"`.
  * Mobile sticky bar: **"Reserve a Stay"** button (`Ref/src/components/sticky-reserve.tsx`) ➔ Kept, `href="#"`.
  * Home page ticket stage: **"Check availability"** booking bar (`Ref/src/components/booking-bar.tsx`) ➔ Kept, submit paused.
  * Room, Dine, Spa & Whisky pages: Action buttons ➔ Kept, `href="#"`.
  * *All buttons remain visually on the site without navigating to a decommissioned page.*

---

## 2. Where the Code Is Stored

All original code has been preserved cleanly in comments:

| File | Purpose / Details |
| :--- | :--- |
| [`Ref/src/app/(site)/contact/page.tsx`](../Ref/src/app/(site)/contact/page.tsx) | Entire page component commented out; triggers `notFound()`. Original code preserved in block comments. |
| [`Ref/src/components/inquiry-form.tsx`](../Ref/src/components/inquiry-form.tsx) | The complete interactive reservation letterform component. |
| [`Ref/src/app/api/inquiries/route.ts`](../Ref/src/app/api/inquiries/route.ts) | Backend API endpoint, inactive with original code commented out. |

---

## 3. How to Integrate the New Reservation System Later

When you are ready to integrate the new reservation system:

### Option A: If using an External Booking Engine (e.g. SynXis, SimpleBooking, Cloudbeds, D-EDGE)
Simply update the `href` on the reserve buttons to your direct booking engine link:
1. **Header Button:** In `Ref/src/components/header.tsx`, update `href="#"` to `href="https://your-booking-engine-url.com"`.
2. **Mobile Sticky Bar:** In `Ref/src/components/sticky-reserve.tsx`, update `href="#"`.
3. **Room & Dine Buttons:** In `stay/page.tsx`, `dine/page.tsx`, etc., update `href="#"`.

### Option B: If restoring the built-in Reservation Page
1. In `Ref/src/app/(site)/contact/page.tsx`, uncomment the original page implementation.
2. In `Ref/src/app/api/inquiries/route.ts`, uncomment the POST handler.
3. In `Ref/src/components/header.tsx`, `booking-bar.tsx`, etc., restore `href="/contact?type=room"`.
