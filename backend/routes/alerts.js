import express from 'express';
import { alertService } from '../services/alertService.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorizeAdmin, (req, res) => {
    res.json(alertService.getAlerts());
});

router.post('/:id/resolve', authenticate, authorizeAdmin, (req, res) => {
    alertService.resolveAlert(req.params.id);
    res.json({ success: true });
});

export default router;
