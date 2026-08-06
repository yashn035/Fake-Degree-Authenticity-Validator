# 🎙️ DEMO DAY CHEAT SHEET

*Print this out and keep it next to your keyboard.*

## ⏱️ The 3-Minute Script (Key Points Only)

1. **Start at Landing Page:** "Fake degrees cost millions. We built an AI validator to stop it."
2. **Login:** "Logging into our secure, role-based JWT system."
3. **Upload Tampered Cert:** "OCR extracts text automatically."
4. **Tampered Result:** "Flags exact mismatch: Expected 78%, found 99%."
5. **Blacklist:** "One click to permanently block this fake."
6. **Upload Genuine Cert:** "Now a real one – VERIFIED."
7. **QR & PDF:** "Instant QR code and downloadable compliance PDF."
8. **Admin Dashboard:** "Full fraud intelligence: logs, trends, and blacklist control."
9. **Bulk Import:** "Upload thousands of JSON/CSV records in seconds."
10. **Dark Mode:** "Beautiful UI with built-in dark mode."
11. **Watermark:** "Digital watermark applied for extra visual security."
12. **Closing:** "Next steps: APIs and Blockchain. Thank you."

---

## 🔐 Credentials
- **Admin Email:** `admin@jharkhand.gov.in`
- **Admin Password:** `Admin@123`
- **Frontend URL:** `http://localhost:5173`
- **Backend URL:** `http://localhost:5000`

---

## 🚨 Fallback Commands & Shortcuts

- **Start Everything:** `npm run start:all`
- **Docker Start:** `docker-compose up --build`
- **Restart App:** `Ctrl + C` in terminal, then `npm run start:all`
- **Hard Refresh Browser:** `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)
- **The Killswitch:** Triple-click the blue **Activity icon** in the Admin Dashboard to instantly wipe and reset the database.
- **OCR Failing?** Check the hidden **"Use Mock Data (Demo Mode)"** checkbox on the Upload page to bypass live OCR.

---

## 🧠 Quick Judge Q&A

- **Q: OCR accuracy?** 
  - A: "~90% with Tesseract. We use regex fallbacks and a mock-data toggle for live demos."
- **Q: Why not blockchain immediately?** 
  - A: "Blockchain fixes future issuances. Our system solves the immediate problem: verifying existing legacy paper certificates."
- **Q: Scalability?** 
  - A: "Microservices architecture. SQLite can swap to Postgres, and we support Bulk Import APIs."
- **Q: False positives?** 
  - A: "We combine Perceptual Hashing + OCR exact matches. Only clear mismatches flag as tampering."
