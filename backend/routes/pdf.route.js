import express from 'express';
import { uploadPdf, upload } from '../controllers/pdf.contoller.js';

const router = express.Router();

// Endpoint for uploading and processing the PDF
router.post('/upload', upload.single('pdf'), uploadPdf);

// Serve static files from the uploads directory
router.use('/uploads', express.static('uploads'));

export default router;
