# User Manual - EduVerify AI

Welcome to EduVerify AI. This system is designed for institutions and employers to instantly verify academic certificates using AI.

## Getting Started
1. **Sign Up**: Navigate to the homepage and click "Get Started" to create a user account.
2. **Login**: Admins can log in using `admin@jharkhand.gov.in` to access the full fraud intelligence suite.

## Verifying a Certificate
1. From the dashboard, drag and drop the scanned certificate image or PDF.
2. Click **Scan & Verify**. 
3. The system will extract the text and compare it against the immutable database.

## Understanding Results
- **VERIFIED ✅**: The document is 100% authentic and unaltered.
- **TAMPERED ❌**: The document exists in the database, but the user altered a specific field (e.g., Marks). The system will highlight exactly which field was altered.
- **NOT_FOUND ⚠️**: The certificate ID does not exist in the official university records.
- **FLAGGED ⚠️**: The data matches, but this exact image file has been uploaded before, indicating a potential duplicate submission.
- **BLACKLISTED 🚫**: This certificate has been flagged by an Admin for confirmed fraud.

## Admin Guide
- **Analytics Dashboard**: View real-time fraud trends, geographic heatmaps, and institution leaderboards.
- **Live Feed**: Watch a real-time stream of verifications happening globally.
- **Blockchain Simulation**: Issue new certificates directly to the simulated cryptographic ledger.
- **Bulk Import**: Import CSVs of new student records into the database.

### Power-User Features
- **Global Blacklist**: Manually blacklist a certificate ID to instantly reject it in future scans.
- **Emergency Killswitch**: Triple-click the Activity icon on the dashboard to safely truncate and reseed the demonstration database.

## FAQ
**Q: What if the image is blurry?**
A: Our AI will do its best. If it fails to read the ID, it will return a "NOT FOUND" warning.

**Q: Can I download a report?**
A: Yes! Verified results include a button to download a secure PDF with a QR code.
