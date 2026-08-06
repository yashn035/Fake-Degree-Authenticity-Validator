import express from 'express';
import multer from 'multer';
import { generateVerificationReport } from '../services/pdfService.js';
import { generateQR } from '../services/qrService.js';
import { embedWatermark } from '../services/watermarkService.js';
import { authenticate } from '../middleware/auth.js';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(authenticate);

router.post('/generate-report', async (req, res) => {
    try {
        const pdfBytes = await generateVerificationReport(req.body);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('PDF Gen Error:', error);
        res.status(500).json({ error: 'Failed to generate PDF report' });
    }
});

router.post('/generate-qr', async (req, res) => {
    try {
        const { certId } = req.body;
        // In dev, use the referer or a default host
        const baseUrl = req.headers.origin || 'http://localhost:5173';
        const qrCode = await generateQR(certId, baseUrl);
        res.json({ qrCode });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

router.post('/apply-watermark', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file' });
        
        const buffer = fs.readFileSync(req.file.path);
        const watermarked = await embedWatermark(buffer);
        
        fs.unlinkSync(req.file.path);
        
        res.setHeader('Content-Type', 'image/png');
        res.send(watermarked);
    } catch (error) {
        res.status(500).json({ error: 'Failed to watermark' });
    }
});

export default router;
