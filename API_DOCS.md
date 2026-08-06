# API Documentation - EduVerify AI

## Authentication
All protected routes require a Bearer token in the Authorization header.
`Authorization: Bearer <token>`

---

### POST `/api/auth/login`
Authenticates a user and returns a JWT.
- **Body**: `{ "email": "admin@jharkhand.gov.in", "password": "..." }`
- **Response**: `{ "token": "ey...", "user": { "id": 1, "role": "admin" } }`

### POST `/api/upload`
Uploads a certificate for OCR verification.
- **Auth Required**: Yes
- **Body**: `multipart/form-data` with `certificate` file field.
- **Response**: `{ "verdict": "VERIFIED", "matchedFields": [...], "fraudPrediction": {...} }`

### GET `/api/admin/analytics`
Fetches comprehensive fraud analytics and leaderboards.
- **Auth Required**: Yes (Admin only)
- **Response**: `{ "fraudScore": 42, "leaderboard": {...}, "topInstitutions": [...] }`

### GET `/api/admin/export`
Exports the entire certificate database as JSON.
- **Auth Required**: Yes (Admin only)
- **Response**: `[ { "cert_id": "C001", "student_name": "..." } ]`

### POST `/api/admin/blacklist`
Adds a certificate ID to the global blacklist.
- **Auth Required**: Yes (Admin only)
- **Body**: `{ "certId": "C001", "reason": "Confirmed forged seals" }`

### POST `/api/blockchain/issue`
Simulates mining and issuing a certificate to the blockchain.
- **Auth Required**: Yes (Admin only)
- **Body**: `{ "certId": "C101", "studentName": "John Doe" }`

### GET `/api/events/stream`
Server-Sent Events (SSE) endpoint for real-time live feed alerts.
- **Auth Required**: Yes (Query param: `?token=...`)
- **Response**: `text/event-stream` stream of verification events.
