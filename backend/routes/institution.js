import express from 'express';
import db from '../models/Certificate.js';
import { logAudit } from '../models/AuditLog.js';

const router = express.Router();

// Simple API Key middleware for universities
const requireApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    // In production, check against an institutions table. Hardcoded for demo.
    if (!apiKey || apiKey !== 'UNIV-jharkhand-2026-key') {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
    }
    next();
};

router.use(requireApiKey);

// POST /api/v1/institution/certificates
// Allows universities to push a verified record directly to the database
router.post('/certificates', (req, res) => {
    const { cert_id, student_name, institution, course, year, marks, issue_date } = req.body;
    
    if (!cert_id || !student_name || !institution) {
        return res.status(400).json({ error: 'Missing required fields: cert_id, student_name, institution' });
    }

    db.run(
        `INSERT INTO certificates (cert_id, student_name, institution, course, year, marks, issue_date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [cert_id, student_name, institution, course || '', year || '', marks || '', issue_date || ''],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Certificate ID already exists in system' });
                }
                return res.status(500).json({ error: 'Failed to insert certificate' });
            }
            
            // Log the API push
            const ip = req.ip || req.headers['x-forwarded-for'] || 'Unknown';
            logAudit(cert_id, ip, 'API_SYNC', `Certificate pushed via API by ${institution}`);
            
            res.status(201).json({ 
                message: 'Certificate successfully synced to state registry',
                id: this.lastID
            });
        }
    );
});

export default router;
