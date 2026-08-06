import express from 'express';
import { getVerifications, getTrends, resetSystem, getVerificationById, getBlacklistEntries, addBlacklistEntry, removeBlacklistEntry, getAnalytics } from '../controllers/adminController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeAdmin);

router.get('/analytics', getAnalytics);
router.get('/verifications', getVerifications);
router.get('/verifications/:certId', getVerificationById);
router.get('/trends', getTrends);
router.post('/reset', resetSystem);

router.get('/blacklist', getBlacklistEntries);
router.post('/blacklist', addBlacklistEntry);
router.delete('/blacklist/:certId', removeBlacklistEntry);

export default router;
