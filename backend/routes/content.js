const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const path = require('path');
const fs = require('fs');

const upload = require('../middleware/upload');

// POST /api/content
router.post('/', upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
    try {
        const contentData = req.body;

        // Handle main file upload
        if (req.files && req.files['file']) {
            const file = req.files['file'][0];
            // Determine type based on mimetype
            const type = file.mimetype.startsWith('video/') ? 'video' : 'image';
            contentData.type = type;

            if (type === 'video') {
                contentData.videoUrl = `/uploads/${file.filename}`;
            } else {
                contentData.thumbnail = `/uploads/${file.filename}`;
            }
        }

        // Handle separate thumbnail if provided
        if (req.files && req.files['thumbnail']) {
            const thumb = req.files['thumbnail'][0];
            contentData.thumbnail = `/uploads/${thumb.filename}`;
        }

        const content = await Content.create(contentData);
        res.status(201).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/content/teacher/:teacherId
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const contents = await Content.findByTeacher(req.params.teacherId);
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
