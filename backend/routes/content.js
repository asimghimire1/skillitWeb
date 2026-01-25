const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const upload = require('../middleware/upload');

// GET /api/content - Get all content (for students) with teacher info
router.get('/', async (req, res) => {
    try {
        // Get all content - let the frontend filter if needed
        const contents = await Content.findAll({
            order: [['created_at', 'DESC']]
        });
        
        console.log(`[Content API] Found ${contents.length} content items`);
        
        if (contents.length === 0) {
            console.log('[Content API] No content in database');
            return res.json([]);
        }
        
        // Enrich content with teacher info
        const enrichedContents = await Promise.all(contents.map(async (content) => {
            const contentData = content.toJSON();
            console.log(`[Content API] Processing content: ${contentData.id} - ${contentData.title}`);
            if (content.teacherId) {
                const teacher = await User.findByPk(content.teacherId, {
                    attributes: ['id', 'fullname', 'profilePicture', 'bio']
                });
                if (teacher) {
                    contentData.teacherName = teacher.fullname;
                    contentData.teacherFullname = teacher.fullname;
                    contentData.teacherAvatar = teacher.profilePicture;
                    contentData.teacherBio = teacher.bio;
                }
            }
            return contentData;
        }));
        
        console.log(`[Content API] Returning ${enrichedContents.length} enriched content items`);
        res.json(enrichedContents);
    } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/content/debug - Debug endpoint to see raw content count
router.get('/debug', async (req, res) => {
    try {
        const contents = await Content.findAll();
        res.json({
            count: contents.length,
            items: contents.map(c => ({
                id: c.id,
                title: c.title,
                teacherId: c.teacherId,
                status: c.status,
                visibility: c.visibility,
                created_at: c.created_at
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/content
router.post('/', upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
    try {
        const contentData = req.body;

        // Ensure content is published by default when uploaded
        if (!contentData.status) {
            contentData.status = 'published';
        }
        if (!contentData.visibility) {
            contentData.visibility = 'public';
        }

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
        const contents = await Content.findAll({ where: { teacherId: req.params.teacherId } });
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/content/:id
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Content.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.json({ message: 'Content deleted successfully' });
        } else {
            res.status(404).json({ message: 'Content not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/content/:id
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Content.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedContent = await Content.findByPk(req.params.id);
            res.json(updatedContent);
        } else {
            res.status(404).json({ message: 'Content not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/content/:id/unlock - Unlock content for student
router.post('/:id/unlock', async (req, res) => {
    try {
        const { id } = req.params;
        const { studentId, type, amountPaid, bidId } = req.body;
        const StudentContent = require('../models/StudentContent');

        // Check if already unlocked
        const existing = await StudentContent.findOne({
            where: { studentId, contentId: id }
        });

        if (existing) {
            return res.status(400).json({ 
                success: false, 
                message: 'You already have access to this content' 
            });
        }

        // Get content details
        const content = await Content.findByPk(id);
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }

        // Handle payment for paid content
        const contentPrice = content.price || 0;
        const isFree = contentPrice === 0;
        
        if (!isFree && type !== 'bid') {
            const user = await User.findByPk(studentId);
            if (!user || (user.credits || 0) < contentPrice) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Insufficient credits' 
                });
            }
            // Deduct credits
            await user.update({ credits: (user.credits || 0) - contentPrice });
        }

        // Create student content record
        const studentContent = await StudentContent.create({
            studentId,
            contentId: id,
            type: isFree ? 'free' : (type || 'paid'),
            amountPaid: amountPaid || (isFree ? 0 : contentPrice),
            bidId: bidId || null
        });

        // Update content enrollment count
        await content.update({ 
            enrollments: (content.enrollments || 0) + 1 
        });

        res.json({ 
            success: true, 
            message: 'Content unlocked successfully',
            studentContent
        });
    } catch (error) {
        console.error('Unlock content error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
