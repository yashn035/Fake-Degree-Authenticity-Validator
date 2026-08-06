import express from 'express';
import { eventService } from '../services/eventService.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stream', authenticate, authorizeAdmin, (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send initial events
    res.write(`data: ${JSON.stringify(eventService.recentEvents)}\n\n`);

    const onVerification = (event) => {
        res.write(`data: ${JSON.stringify([event])}\n\n`);
    };

    eventService.on('verification', onVerification);

    req.on('close', () => {
        eventService.off('verification', onVerification);
        res.end();
    });
});

export default router;
