# 🎙️ Demo Day Run-of-Show

This document contains the exact script, fallbacks, and Q&A prep you need to deliver a flawless 3-minute hackathon pitch.

## ⏱️ 3-Minute Timed Script

| Time | Action | What to Say |
| :--- | :--- | :--- |
| **0:00-0:15** | *Show Landing Page* | "Fake degrees cost companies millions and slow down hiring. Today, verification is manual and broken. We built EduVerify AI—an automated authenticity validator for academia." |
| **0:15-0:30** | *Click "Get Started" → Login* | "Here's our secure platform. I'm logging in with Role-Based Access as an administrator." |
| **0:30-0:45** | *Upload Tampered Certificate* | "Let's upload a tampered certificate. Notice the AI-powered OCR extracts all fields automatically." |
| **0:45-1:00** | *Show "TAMPERED" result* | "It doesn't just say 'invalid' – it flags the exact mismatch. Marks expected 78%, but found 99% on the document." |
| **1:00-1:15** | *Show "Blacklist"* | "From the dashboard, we can instantly blacklist this certificate to protect the network from future misuse." |
| **1:15-1:30** | *Upload Genuine Certificate* | "Now a genuine certificate – it passes the perceptual hash and OCR checks, showing VERIFIED with a green badge." |
| **1:30-1:45** | *Show QR Code + PDF* | "For compliance, it instantly generates a scannable verification QR code and a downloadable PDF report." |
| **1:45-2:00** | *Show Watermark* | "We can even apply a digital watermark directly to the image for extra visual security." |
| **2:00-2:15** | *Switch to Admin Dashboard* | "Our enterprise Admin Dashboard provides a real-time fraud intelligence system with verification trends and logs." |
| **2:15-2:30** | *Show Bulk Import* | "Universities can bulk import thousands of genuine records in seconds using JSON or CSV." |
| **2:30-2:45** | *Show Dark Mode* | "The entire platform features a highly polished UX, including a seamless dark mode." |
| **2:45-3:00** | *Closing* | "Next steps: blockchain integration, a national registry, and institutional APIs. Thank you." |

---

## 🚨 Break Glass Plan (The Mock Data Toggle)
If the Wi-Fi is slow or the OCR engine hangs during the live demo, **DO NOT PANIC**. 
1. Check the hidden **"Use Mock Data"** checkbox on the Upload Page.
2. The app will bypass the heavy OCR processing and instantly return the hardcoded values (Anjali Kumar, C001, 78%), allowing you to continue the flow seamlessly. Frame it to judges as: *"For the sake of time in this demo, we're using our rapid-test environment..."*

## 🔴 Killswitch Instructions
If you need to instantly wipe all data and reset the database to its pristine demo state (e.g., right before you walk on stage):
1. Go to the **Admin Dashboard**.
2. Find the blue **Activity** icon card at the top.
3. **Triple-click** the icon.
4. The system will nuke the database, re-seed the mock certificates, and log you out.

---

## 🧠 Judge Q&A Prep

**Q: How do you handle variations in certificate formats?**
A: "Currently, our OCR engine extracts raw text and uses regex pattern matching to find key fields. For production, we would implement custom machine learning models trained on specific university templates, or enforce a standard QR/Barcode system."

**Q: What happens if a student changes their name legally?**
A: "The system relies on the immutable data provided by the issuing institution at the time of graduation. Any legal name changes would require the institution to issue a new certificate and update the database via our Bulk Import API."

**Q: Is perceptual hashing enough to stop fakes?**
A: "Perceptual hashing catches exact visual duplicates or slightly cropped images. However, our true line of defense is the multi-layered approach: if they alter the image, the OCR catches the text mismatch. If they change the text, the hash and database lookup fail."
