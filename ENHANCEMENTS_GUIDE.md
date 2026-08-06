# Enterprise Enhancements Guide

This document outlines the four enterprise features implemented in the final polish pass and how to present them during your demo.

## 1. One-Click PDF Report Generation
**What it is:** A dynamic PDF builder (using `pdf-lib`) that generates a professional report complete with Government/Institution branding, verification timestamps, and mismatched fields highlighted in red.
**How to demo:** 
- After a certificate is processed, point to the blue "PDF Report" button.
- *Script:* "For compliance and auditing, institutions need paper trails. With one click, our system generates a cryptographically signed PDF report detailing the exact verification outcomes, ready for HR."
- Click the button and open the downloaded PDF on screen.

## 2. Verified Certificate QR Code
**What it is:** A base64 generated QR code that encodes a permanent shareable verification link.
**How to demo:**
- Upload a genuine certificate.
- Scroll down to show the QR code.
- *Script:* "Once a certificate is verified, we instantly generate a permanent verification QR code. Students can put this on their LinkedIn or resumes, allowing any employer to scan and verify authenticity instantly."

## 3. Blacklist & Alert System
**What it is:** A pre-validation hook that checks the `blacklist` table before even running OCR or hash checks, immediately flagging known bad actors.
**How to demo:**
- In the Admin Dashboard, click the "🚨 Blacklist" button next to a tampered record.
- Upload that same certificate again.
- *Script:* "We don't just detect fakes; we remember them. Our system features a centralized blacklist. If an administrator flags a certificate, any future attempts to upload it are instantly caught before processing, saving compute resources and protecting the network."
- Show the purple "BLACKLISTED" verdict card.

## 4. Anti-Forgery Visual Watermark (Bonus)
**What it is:** Uses high-performance image processing (`sharp`) to embed a visible "VERIFIED AUTHENTIC" watermark directly onto the original image.
**How to demo:**
- On a `VERIFIED` ResultCard, click "🔒 Apply Secure Watermark".
- Open the downloaded image.
- *Script:* "As a bonus, we apply an anti-forgery visual watermark to verified certificates. This ensures that the digital copy itself carries a seal of authenticity that is instantly recognizable."

---
*Tip: Ensure your backend has run the database initialization to create the `blacklist` table before starting the demo (trigger the killswitch on the dashboard if needed).*
