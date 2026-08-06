import express from 'express';
import multer from 'multer';
import { getVerifications, getTrends, resetSystem, getVerificationById, getBlacklistEntries, addBlacklistEntry, removeBlacklistEntry, getAnalytics, bulkUpload, getAuditLogsController, getLegacyQueue, resolveLegacyCertificate } from '../controllers/adminController.js';
import db from '../models/Certificate.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);
router.use(authorizeAdmin);

router.get('/analytics', getAnalytics);
router.get('/verifications', getVerifications);
router.get('/verifications/:certId', getVerificationById);
router.get('/trends', getTrends);
router.post('/reset', resetSystem);

router.get('/blacklist', getBlacklistEntries);
router.get('/export', (req, res) => {
    db.all('SELECT * FROM certificates', (err, rows) => {
        if (err) return res.status(500).json({ error: 'Failed to export' });
        res.json(rows);
    });
});

router.get('/legacy-queue', getLegacyQueue);
router.post('/legacy/:id/resolve', resolveLegacyCertificate);

router.get('/audit', getAuditLogsController);
router.post('/blacklist', addBlacklistEntry);
router.delete('/blacklist/:certId', removeBlacklistEntry);

router.post('/bulk-upload', upload.single('file'), bulkUpload);

export default router;
