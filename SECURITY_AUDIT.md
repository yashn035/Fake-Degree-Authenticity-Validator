# Security Audit Report

## Implemented Security Measures
* **Authentication**: JSON Web Tokens (JWT) are used for all protected routes, with a strict 24-hour expiration policy.
* **Password Security**: All user passwords are cryptographically hashed using `bcryptjs` with a salt round of 10.
* **Role-Based Access Control (RBAC)**: The `authorizeAdmin` middleware explicitly rejects any request to the `/api/admin/*` namespace if the user's role is not `admin`.
* **SQL Injection Protection**: All SQLite database queries use parameterized prepared statements (e.g. `WHERE cert_id = ?`). No string concatenation is used.
* **CORS Protection**: The Express backend enforces Cross-Origin Resource Sharing policies to only accept requests from authorized frontend origins.
* **Payload Validation**: File uploads are securely parsed using `multer` in memory buffers to prevent path traversal attacks.

## Recommended Future Hardening
While the current MVP is highly secure, a production deployment should implement:
1. **Rate Limiting**: Install `express-rate-limit` to prevent brute-force attacks on the `/login` endpoint.
2. **Helmet.js**: Install `helmet` to automatically enforce strict HTTP headers (HSTS, X-Frame-Options).
3. **Database Encryption**: Upgrade from SQLite to an encrypted Postgres RDS instance.
