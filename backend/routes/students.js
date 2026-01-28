const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Content = require('../models/Content');
const Session = require('../models/Session');
const StudentContent = require('../models/StudentContent');
const StudentEnrollment = require('../models/StudentEnrollment');

// GET /api/students/:studentId/balance
// Returns student's wallet balance
router.get('/:studentId/balance', async (req, res) => {
    try {
        const { studentId } = req.params;
        const user = await User.findByPk(studentId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        res.json({ credits: user.credits || 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/students/:studentId/credits
// Add credits to student's wallet
router.post('/:studentId/credits', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        const user = await User.findByPk(studentId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const newBalance = (user.credits || 0) + amount;
        await user.update({ credits: newBalance });

        res.json({ 
            success: true, 
            credits: newBalance,
            message: `NPR ${amount} added successfully` 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/students/:studentId/credits/deduct
// Deduct credits from student's wallet
router.post('/:studentId/credits/deduct', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        const user = await User.findByPk(studentId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        if ((user.credits || 0) < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient credits' });
        }

        const newBalance = (user.credits || 0) - amount;
        await user.update({ credits: newBalance });

        res.json({ 
            success: true, 
            credits: newBalance,
            message: `NPR ${amount} deducted successfully` 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/students/:studentId/enrollments
// Returns student's enrolled sessions with session details
router.get('/:studentId/enrollments', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const enrollments = await StudentEnrollment.findAll({
            where: { studentId }
        });

        // Enrich with session and teacher data
        const enrichedEnrollments = await Promise.all(enrollments.map(async (enrollment) => {
            const enrollmentData = enrollment.toJSON();
            
            if (enrollment.sessionId) {
                const session = await Session.findByPk(enrollment.sessionId);
                if (session) {
                    enrollmentData.session = session.toJSON();
                    enrollmentData.sessionTitle = session.title;
                    enrollmentData.scheduledDate = session.scheduledDate;
                    enrollmentData.scheduledTime = session.scheduledTime;
                    enrollmentData.duration = session.duration;
                    enrollmentData.meetingLink = session.meetingLink;
                    
                    // Get teacher info
                    if (session.teacherId) {
                        const teacher = await User.findByPk(session.teacherId, {
                            attributes: ['id', 'fullname', 'avatar']
                        });
                        if (teacher) {
                            enrollmentData.teacherName = teacher.fullname;
                            enrollmentData.teacherAvatar = teacher.avatar;
                        }
                    }
                }
            }
            
            return enrollmentData;
        }));

        res.json(enrichedEnrollments);
    } catch (error) {
        console.error('Get enrollments error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/students/:studentId/content
// Returns student's joined/unlocked content with content details
router.get('/:studentId/content', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const studentContent = await StudentContent.findAll({
            where: { studentId, status: 'active' }
        });

        // Enrich with content and teacher data
        const enrichedContent = await Promise.all(studentContent.map(async (sc) => {
            const scData = sc.toJSON();
            
            if (sc.contentId) {
                const content = await Content.findByPk(sc.contentId);
                if (content) {
                    scData.content = content.toJSON();
                    scData.contentTitle = content.title;
                    scData.thumbnail = content.thumbnail;
                    scData.videoUrl = content.videoUrl;
                    scData.type = content.type;
                    scData.category = content.category;
                    
                    // Get teacher info
                    if (content.teacherId) {
                        const teacher = await User.findByPk(content.teacherId, {
                            attributes: ['id', 'fullname', 'avatar']
                        });
                        if (teacher) {
                            scData.teacherName = teacher.fullname;
                            scData.teacherAvatar = teacher.avatar;
                        }
                    }
                }
            }
            
            return scData;
        }));
        
        res.json(enrichedContent);
    } catch (error) {
        console.error('Get student content error:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/students/:studentId/content/join
// Join content (free, paid, or bid)
router.post('/:studentId/content/join', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { contentId, type, amountPaid, bidId } = req.body;

        // Check if already joined
        const existing = await StudentContent.findOne({
            where: { studentId, contentId }
        });

        if (existing) {
            return res.status(400).json({ 
                success: false, 
                message: 'You already have access to this content' 
            });
        }

        // Get content details
        const content = await Content.findByPk(contentId);
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }

        // Handle payment for paid content
        if (type === 'paid' && content.price > 0) {
            const user = await User.findByPk(studentId);
            if (!user || (user.credits || 0) < content.price) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Insufficient credits' 
                });
            }
            // Deduct credits
            await user.update({ credits: (user.credits || 0) - content.price });
        }

        // Create student content record
        const studentContentRecord = await StudentContent.create({
            studentId,
            contentId,
            type: type || 'free',
            amountPaid: amountPaid || (type === 'paid' ? content.price : 0),
            bidId: bidId || null
        });

        // Update content enrollment count
        await content.update({ 
            enrollments: (content.enrollments || 0) + 1 
        });

        res.json({ 
            success: true, 
            message: 'Successfully joined content',
            data: studentContentRecord
        });
    } catch (error) {
        console.error('Join content error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
