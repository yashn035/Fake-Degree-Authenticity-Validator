# Developer Guide

Welcome to the EduVerify AI codebase.

## Architecture
```text
[ React Frontend ] <--- REST & SSE ---> [ Node.js Backend ]
                                             |
                                     [ AI & Services ]
                                     - Tesseract.js (OCR)
                                     - image-hash (Perceptual)
                                             |
                                       [ SQLite DB ]
```

## Local Setup
1. `npm install` in both `/frontend` and `/backend`.
2. `npm run dev` in both directories.
3. To reset the DB with mock data, run `node backend/db/seed.js`.

## Extending the System
### Adding New AI Models
The OCR logic is isolated in `backend/services/ocrService.js`. You can swap `tesseract.js` for AWS Textract or Google Cloud Vision by simply replacing the `extractText` implementation. The rest of the app will continue to function seamlessly.

### Adding New Database Sources
Currently, we use a local SQLite DB for demonstration. To integrate with a real university API or Postgres:
1. Open `backend/models/Certificate.js`.
2. Rewrite the `getCertificateById` function to perform an axios/fetch call to your external data warehouse.

## Database Schema
- **certificates**: `id`, `cert_id`, `student_name`, `institution`, `course`, `year`, `marks`, `issue_date`, `image_hash`
- **users**: `id`, `full_name`, `email`, `password_hash`, `role`
- **blacklist**: `id`, `cert_id`, `reason`

## Debugging Tips
- If the SSE stream stops working, ensure CORS is correctly configured for the `/api/events` endpoint.
- If the AI is failing to read text, test your image with `tesseract.js` standalone to ensure it has enough DPI.
