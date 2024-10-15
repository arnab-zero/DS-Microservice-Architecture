const express = require('express');
const router = express.Router();
const multer = require('multer');
const MinioControllers = require('./minio.controller');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Define routes
router.post('/upload', MinioControllers.uploadFile);
router.get('/download/:fileName', MinioControllers.downloadFile);

export const MinioRouter = router;

