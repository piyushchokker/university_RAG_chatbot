const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { insertDocument, getAllDocuments, getDocumentById, deleteDocument } = require('../database/db');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'krmangalam-university-secret-key-2024';
const RAG_API_URL = process.env.RAG_API_URL || 'http://localhost:5000';

// Create uploads directory structure if it doesn't exist
const uploadsBaseDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsBaseDir)) {
    fs.mkdirSync(uploadsBaseDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const school = req.body.school || 'base';
        const course = req.body.course || 'general';
        
        // Create hierarchical directory structure
        // For base: uploads/base/course/
        // For schools: uploads/school/course/
        let uploadPath;
        if (school === 'base') {
            uploadPath = path.join(uploadsBaseDir, 'base', course);
        } else {
            uploadPath = path.join(uploadsBaseDir, school, course);
        }
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-originalname.pdf
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${uniqueSuffix}-${name}${ext}`);
    }
});

// File filter - only allow PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}

// Upload document endpoint
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
    try {
        // Check if user is registrar
        if (req.user.userType !== 'registrar') {
            return res.status(403).json({
                success: false,
                message: 'Only registrars can upload documents'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const { school, course, documentTitle, documentType, academicYear, description } = req.body;

        // Validation
        if (!school || !course || !documentTitle || !documentType) {
            // Delete uploaded file if validation fails
            if (req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'School, course, document title, and document type are required'
            });
        }

        // Prepare document data
        const documentData = {
            registrar_id: req.user.id,
            school: school,
            course: course,
            document_title: documentTitle,
            document_type: documentType,
            academic_year: academicYear || null,
            description: description || null,
            filename: req.file.filename,
            original_filename: req.file.originalname,
            file_path: req.file.path,
            file_size: req.file.size,
            mime_type: req.file.mimetype
        };

        // Insert into database
        const documentId = await insertDocument(documentData);

        // Trigger vectorization in background (don't wait for it)
        processDocumentAsync(documentData.file_path, school, course).catch(err => {
            console.error('Error processing document for vectorization:', err);
        });

        res.json({
            success: true,
            message: 'Document uploaded successfully. Vectorization in progress.',
            document: {
                id: documentId,
                ...documentData
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        
        // Delete uploaded file if database insert fails
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        
        res.status(500).json({
            success: false,
            message: 'Error uploading document',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get all documents (for registrar)
router.get('/', verifyToken, async (req, res) => {
    try {
        let documents;
        
        if (req.user.userType === 'registrar') {
            // Registrars can see their own documents
            documents = await getAllDocuments(req.user.id);
        } else {
            // Students can see all documents (for future RAG queries)
            documents = await getAllDocuments();
        }

        res.json({
            success: true,
            documents: documents
        });

    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching documents',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get document by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const document = await getDocumentById(req.params.id);
        
        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        res.json({
            success: true,
            document: document
        });

    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching document',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Delete document
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        // Check if user is registrar
        if (req.user.userType !== 'registrar') {
            return res.status(403).json({
                success: false,
                message: 'Only registrars can delete documents'
            });
        }

        // Get document first to get file path
        const document = await getDocumentById(req.params.id);
        
        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Check if registrar owns the document
        if (document.registrar_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own documents'
            });
        }

        // Delete from database
        const deleted = await deleteDocument(req.params.id, req.user.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Document not found or could not be deleted'
            });
        }

        // Delete file from filesystem
        if (document.file_path && fs.existsSync(document.file_path)) {
            try {
                fs.unlinkSync(document.file_path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
                // Continue even if file deletion fails
            }
        }

        res.json({
            success: true,
            message: 'Document deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting document',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Async function to process document for vectorization
async function processDocumentAsync(filePath, school, course) {
    try {
        const response = await axios.post(`${RAG_API_URL}/process-document`, {
            file_path: filePath,
            school: school,
            course: course,
            chunk_size: 1000,
            chunk_overlap: 100
        }, {
            timeout: 60000 // 60 second timeout for processing
        });
        
        if (response.data.success) {
            console.log(`✅ Document vectorized: ${filePath} (${response.data.chunks_created} chunks)`);
        } else {
            console.error(`❌ Vectorization failed: ${response.data.message}`);
        }
    } catch (error) {
        console.error('Error calling RAG API for vectorization:', error.message);
        // Don't throw - this is background processing
    }
}

module.exports = router;

