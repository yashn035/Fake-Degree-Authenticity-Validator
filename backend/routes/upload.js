import express from 'express';
import multer from 'multer';
import { handleUpload } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (PNG, JPG, etc.) are supported.'), false);
    }
};

const upload = multer({ storage, fileFilter });

// Handle multer errors
const uploadMiddleware = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
};

router.post('/', authenticate, uploadMiddleware, handleUpload);

export default router;
