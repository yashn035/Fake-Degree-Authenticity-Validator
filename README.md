# EduVerify AI

Instant academic credential verification — from a 14-day manual process to a 3-second automated check.

## 1. The Core Concept

**The Problem:** Verifying academic degrees today is slow, manual, and easy to fake. Employers and universities routinely spend days or weeks emailing institutions to confirm a candidate's certificate is genuine — while forgery tools (Photoshop, deepfakes) keep getting better and cheaper.

**The Solution:** EduVerify AI is an automated verification platform that combines Optical Character Recognition (OCR), perceptual image hashing, and a structured records database to instantly determine whether a submitted certificate is authentic, tampered, unrecognized, or a flagged duplicate.

*(Note on the "3-second" claim: this reflects processing time for a typical single-page certificate image on standard dev hardware, not a benchmarked production SLA.)*

## 2. How the Verification Engine Works

When a user uploads a certificate image, it passes through a multi-layered verification pipeline:

- **OCR Extraction** — `tesseract.js` reads the image and extracts key fields: Certificate ID, Student Name, Institution, Marks, Year.
- **Perceptual Hashing** — generates a fingerprint of the image that detects visual similarity, not just byte-for-byte identity. This is what catches duplicate/reused images even if metadata differs.
- **Database Cross-Reference** — extracted fields are compared against official institutional records stored in SQLite.
- **Verdict Generation** — the engine returns exactly one of four outcomes, evaluated in priority order so results are deterministic even in overlapping edge cases:

| Verdict | Condition | Priority |
| :--- | :--- | :--- |
| **TAMPERED ❌** | Certificate ID exists, but one or more fields (marks, name, year) don't match records | Checked first — a forged field is the most serious finding |
| **FLAGGED ⚠️** | All fields match, but this exact image has been submitted before | Checked only if no field mismatch exists |
| **NOT FOUND ⚠️** | Certificate ID does not exist in records at all | Independent — short-circuits before hashing is even needed |
| **VERIFIED ✅** | Perfect field match, image not previously seen | Default when nothing else triggers |

## 3. Technical Architecture

Built as a modern, decoupled web application:

- **Frontend:** React.js (Vite), Tailwind CSS — responsive layout, dark mode, animated result states
- **Backend:** Node.js + Express.js — RESTful API design
- **Database:** SQLite for rapid local demonstration (see Roadmap — Postgres/RDS planned for multi-tenant scale)
- **Authentication:** JWT-based, stateless, role-based access control (RBAC)
- **Auth Verification:** admin routes tested live — unauthenticated requests to `/api/admin/*` return 401 Unauthorized.

## 4. Admin Fraud Intelligence Suite
- **Live Event Feed** — Server-Sent Events push verification attempts to the admin dashboard in real time, no refresh needed.
- **Rule-Based Fraud Scoring** — a 0–100% heuristic score for TAMPERED/NOT FOUND results, weighted on signals like marks >90%, future-dated degrees, and known diploma-mill institution names.
- **Geographic Heatmap** — visualizes fraud concentration by region.
- **Institution Scoreboard** — ranks institutions by authenticity rate vs. fraud-flag rate.
- **Automated Alerts (Simulated)** — logs a formatted WhatsApp/email alert payload when severe fraud is detected; not wired to a live messaging provider.
- **Global Blacklist** — admins can permanently blacklist a Certificate ID, rejecting it in all future scans.

## 5. Security & Enterprise-Style Features
- **Blockchain Simulation** — a simulated Proof-of-Work ledger; admins "mint" certificates to a mock chain and verified records display a block number.
- **Exportable Audits** — watermarked PDF verification reports with a scannable QR code linking back to the record.
- **Emergency Killswitch** — hidden admin action (triple-click the Activity icon) that truncates and re-seeds the database with clean demo data. Gated behind a confirmation modal to prevent accidental use during a live demo.
- **Password Security** — bcrypt-hashed credentials, JWT session tokens.

## 6. Strategic Roadmap (Phase 2)

What we'd build next, given more time:

- **Enterprise data scaling** — migrate SQLite to Postgres/RDS to support concurrent multi-institution writes.
- **True ML fraud model** — replace weighted heuristics with a trained classifier once labeled fraud data is available.
- **Live alerting integration** — connect simulated WhatsApp/email alerts to real messaging APIs (Twilio, SendGrid).
- **Real blockchain anchoring** — replace the PoW simulation with an actual lightweight ledger (e.g., a permissioned chain) for tamper-evident audit trails.

## 7. Getting Started (Local Setup)

```bash
git clone <repo-url>
cd eduverify-ai

# Backend
cd backend
npm install
npm run dev        # starts Express API on :5000

# Frontend
cd ../frontend
npm install
npm run dev        # starts Vite dev server, typically :5173
```
*Note: Default admin credentials (`admin@jharkhand.gov.in` / `Admin@123`) and seed data are pre-configured. Reseed anytime via the Emergency Killswitch on the admin dashboard.*

## 8. Team & Credits
*(Add team member names, roles, and contact/GitHub links here.)*

---
**Summary:** EduVerify AI is a complete, well-rounded prototype demonstrating an end-to-end approach to a real verification problem — spanning OCR, fraud heuristics, real-time admin tooling, and security fundamentals — while being explicitly honest about what is simulated versus production-ready.
