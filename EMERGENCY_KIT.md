# 🚨 Demo Day Emergency Kit

> **Keep this document open on a side monitor or printed on your desk during your presentation!**

---

## 🔄 1. The Emergency Killswitch
*If the system gets stuck, cluttered with bad data, or someone uploads something unexpected during a live demo, trigger the Killswitch to instantly reset the environment.*

1. Go to the **Admin Dashboard**.
2. **Triple-click** the blue Activity icon (pulse line) in the top left corner next to the title.
3. A strict confirmation modal will appear: *"⚠️ EMERGENCY KILLSWITCH TRIGGERED ⚠️"*.
4. Click **OK**. The database will truncate, re-seed with clean default data, and the page will instantly reload.

---

## 🔑 2. Admin Credentials
If you get logged out, do not panic. Use these credentials to get back in:
- **Email:** `admin@jharkhand.gov.in`
- **Password:** `Admin@123`

---

## 🛜 3. WiFi / Connectivity Fallback Plan
Hackathon WiFi is notoriously unreliable. If the venue WiFi drops completely:
1. **Don't panic.** The entire system runs 100% locally on your machine (`localhost`).
2. Do **not** refresh the browser (this keeps the React app running smoothly from memory).
3. Continue the demo exactly as planned.
4. If a judge asks about internet requirements, casually mention: *"Our architecture supports complete offline-first edge deployment, which is why it continues to function perfectly without an active connection."*

---

## 🖼️ 4. Test Certificates (Desktop Prep)
Before you walk on stage, ensure these three specific files are saved directly to your desktop for easy dragging-and-dropping:
- 🟢 `genuine.png` (Matches C001 perfectly -> VERIFIED)
- 🔴 `tampered.png` (Altered Marks to 99% -> TAMPERED)
- ⚠️ `fake.png` (ID X999 -> NOT FOUND)

---

## 🤖 5. OCR Failure Fallback
If the lighting is bad or the screen-share compresses the image making it unreadable by Tesseract:
1. Simply check the **"Use Mock Data (Demo Mode)"** toggle on the upload form.
2. The system will bypass OCR and use clean simulated text extraction, allowing the rest of the verification and AI engine to run perfectly.

---

## 🎤 6. The "Wow" Factor (Voice Demo)
If you lose your voice, or just want to impress the judges with an automated walkthrough:
1. Ensure your laptop volume is up.
2. Click the purple **Voice Demo 🎤** button in the top right of the Navbar.
3. Let the system narrate its own capabilities.

---

### 💻 System Ports Reminder
If a terminal crashes, restart it immediately:
- **Backend:** `cd backend && npm run dev` (Runs on port `5000`)
- **Frontend:** `cd frontend && npm run dev` (Runs on port `5173`)

> *Take a deep breath. You know this codebase inside and out. You've got this!* 🏆
