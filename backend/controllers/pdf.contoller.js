import multer from 'multer';
import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { pdf } from 'pdf-to-img';

// Setup multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to convert PDF to images
const pdfToImages = async (pdfBuffer) => {
    const tempFilePath = path.join(os.tmpdir(), 'uploaded_pdf.pdf');
    fs.writeFileSync(tempFilePath, pdfBuffer);
    await fs.promises.mkdir('uploads', { recursive: true });
    try {
        const document = await pdf(tempFilePath, { scale: 5 });
        const imagePaths = [];
        let counter = 1;

        for await (const image of document) {
            const imagePath = path.join('uploads', `page${counter}.png`);
            await fs.promises.writeFile(imagePath, image);
            imagePaths.push(imagePath);
            counter++;
        }

        fs.unlinkSync(tempFilePath); // Clean up temp PDF
        return imagePaths; // Return paths of converted images
    } catch (error) {
        console.error('Error converting PDF to images:', error);
        throw error;
    }
};

// Controller for uploading and processing the PDF
const uploadPdf = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const imagePaths = await pdfToImages(req.file.buffer);
        const textResults = [];

        for (const imagePath of imagePaths) {
            const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
            textResults.push(text);
            fs.unlinkSync(imagePath); // Delete image after extracting text
        }

        res.json({ pages: textResults });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing the PDF.');
    }
};

export { uploadPdf, upload };
