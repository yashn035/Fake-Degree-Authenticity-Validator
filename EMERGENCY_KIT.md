# 🚨 THE ULTIMATE DEMO DAY EMERGENCY KIT 🚨

```text
  ___    _        _   _            _  __         _    ___ 
 | __|__| |_  _  | | | |___ _ _ _ | |/ _|_  _   /_\  |_ _|
 | _|/ _` | || | | |_| / -_) '_| || |  _| || | / _ \  | | 
 |___\__,_|\_,_|  \___/\___|_|  \_, |_|  \_, |/_/ \_\|___|
                                |__/     |__/             
```

> [!IMPORTANT]
> **Keep this document open on a side monitor, or print it and tape it to your desk.** When things go wrong on stage, your adrenaline will spike. Follow these steps exactly.

---

## 📋 PRE-FLIGHT CHECKLIST (T-Minus 5 Minutes)
- [ ] Ensure `genuine.png`, `tampered.png`, and `fake.png` are saved to your Desktop.
- [ ] Both frontend (`:5173`) and backend (`:5000`) servers are running without errors.
- [ ] You are logged into the Admin Dashboard (`admin@jharkhand.gov.in` / `Admin@123`).
- [ ] The **"Use Mock Data"** toggle is unchecked (unless you plan to use it).
- [ ] Your laptop volume is turned up (for the Voice Demo).
- [ ] Browser cache is cleared (Ctrl+Shift+Delete) to prevent stale state.
- [ ] Take a deep breath. 🧘‍♂️

---

## 🧠 Q&A CHEAT SHEET: Verdict Priority Engine
*If a judge asks how the system decides between verdicts, use this diagram:*

```mermaid
graph TD
    A[Upload Image] --> B(Extract Data)
    B --> C{Are there Mismatched Fields?}
    C -- YES --> D((❌ TAMPERED))
    C -- NO --> E{Is the Image Hash a Duplicate?}
    E -- YES --> F((⚠️ FLAGGED))
    E -- NO --> G{Does the Cert ID exist in DB?}
    G -- NO --> H((⚠️ NOT FOUND))
    G -- YES --> I((✅ VERIFIED))

    classDef red fill:#fca5a5,stroke:#991b1b,stroke-width:2px,color:#000;
    classDef yellow fill:#fef08a,stroke:#a16207,stroke-width:2px,color:#000;
    classDef green fill:#bbf7d0,stroke:#166534,stroke-width:2px,color:#000;
    
    class D red;
    class F,H yellow;
    class I green;
```
> **Script:** *"We use a deterministic priority cascade. TAMPERED wins over everything because a forged field is the most severe offense. FLAGGED comes second for duplicate imagery. NOT FOUND handles complete fabrications."*

---

## 🔄 1. THE EMERGENCY KILLSWITCH
> [!CAUTION]  
> If the system gets stuck, cluttered with bad data, or a judge uploads something unexpected, trigger the Killswitch to instantly reset the environment to a pristine state.

1. Go to the **Admin Dashboard**.
2. **Triple-click** the blue Activity icon (pulse line) in the top left corner.
3. A strict confirmation modal will appear: *"⚠️ EMERGENCY KILLSWITCH TRIGGERED ⚠️"*.
4. Click **OK**. The database will truncate, re-seed with clean default data, and the page will instantly reload.

---

## 🛜 2. WIFI / CONNECTIVITY FALLBACK
> [!WARNING]
> Hackathon WiFi is notoriously unreliable. If the venue WiFi drops completely while you are presenting:

1. **DO NOT refresh the browser.** This keeps the React app running smoothly from memory.
2. Continue the demo exactly as planned. The system runs 100% locally on `localhost`.
3. If a judge notices you aren't connected to WiFi, say: 
   *"Our architecture supports complete offline-first edge deployment, which is why the AI engine continues to function perfectly without an active connection."*

---

<details>
<summary><b>🤖 Click to Expand: OCR Failure Fallback</b></summary>

> [!TIP]
> If the projector lighting is bad, or the screen-share compresses the image making it unreadable by the Tesseract engine:

1. Point to the **"Use Mock Data (Demo Mode)"** toggle on the upload form.
2. Check the box and explain: *"Because OCR is highly dependent on camera quality, we have a fallback mechanism for demonstrations."*
3. The system will bypass OCR and use clean simulated text extraction, allowing the rest of the verification and Fraud Scoring engine to run perfectly.
</details>

<details>
<summary><b>🎤 Click to Expand: The "Wow" Factor (Voice Demo)</b></summary>

If you lose your voice, or just want a flawless, automated walkthrough to impress the judges:
1. Click the purple **Voice Demo 🎤** button in the top right of the Navbar.
2. Step back from the keyboard and let the system narrate its own capabilities.
</details>

<details>
<summary><b>💻 Click to Expand: System Crash / Port Reminder</b></summary>

If a terminal crashes, restart it immediately:
- **Backend:** `cd backend && npm run dev` (Runs on port `5000`)
- **Frontend:** `cd frontend && npm run dev` (Runs on port `5173`)
</details>

---
> [!NOTE]
> You know this codebase inside and out. If something breaks, explain *why* it broke. Judges love a developer who can debug live. **You've got this!** 🏆
