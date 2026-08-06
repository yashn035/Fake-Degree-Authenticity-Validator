import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDB } from './db/init.js';
import { seedDB } from './db/seed.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';
import featuresRoutes from './routes/features.js';
import authRoutes from './routes/auth.js';
import blockchainRoutes from './routes/blockchain.js';
import eventRoutes from './routes/events.js';
import alertRoutes from './routes/alerts.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/features', featuresRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api', adminRoutes);

// Initialize DB and start server
const startServer = async () => {
    try {
        await initDB();
        await seedDB();
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

startServer();
