import express from 'express';
import { blockchainService } from '../services/blockchainService.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/issue', authenticate, authorizeAdmin, (req, res) => {
    try {
        const { certId, studentName, course, institution, year, marks } = req.body;
        if (!certId || !studentName) {
            return res.status(400).json({ error: 'certId and studentName are required' });
        }
        const block = blockchainService.addCertificateBlock(req.body);
        res.json({ success: true, block });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to issue certificate on blockchain' });
    }
});

router.get('/verify/:certId', (req, res) => {
    const result = blockchainService.verifyCertificateOnChain(req.params.certId);
    res.json(result);
});

router.get('/chain', (req, res) => {
    res.json(blockchainService.getChain());
});

export default router;
