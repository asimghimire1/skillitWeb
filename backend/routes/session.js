const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');
const StudentEnrollment = require('../models/StudentEnrollment');

// GET /api/sessions - Get all sessions (for students)
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.findAll({
            order: [['scheduledDate', 'ASC'], ['scheduledTime', 'ASC']]
        });
        
        // Enrich sessions with teacher info
        const enrichedSessions = await Promise.all(sessions.map(async (session) => {
            const sessionData = session.toJSON();
            if (session.teacherId) {
                const teacher = await User.findByPk(session.teacherId, {
                    attributes: ['id', 'fullname', 'profilePicture', 'bio']
                });
                if (teacher) {
                    sessionData.teacherName = teacher.fullname;
                    sessionData.teacherAvatar = teacher.profilePicture;
                    sessionData.teacherBio = teacher.bio;
                }
            }
            return sessionData;
        }));
        
        res.json(enrichedSessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/sessions
router.post('/', async (req, res) => {
    try {
        const session = await Session.create(req.body);
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/sessions/teacher/:teacherId
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const sessions = await Session.findAll({ where: { teacherId: req.params.teacherId } });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/sessions/:id/enroll - Enroll student in session
router.post('/:id/enroll', async (req, res) => {
    try {
        const { id } = req.params;
        const { studentId, type, amountPaid, bidId } = req.body;

        // Check if already enrolled
        const existing = await StudentEnrollment.findOne({
            where: { studentId, sessionId: id }
        });

        if (existing) {
            return res.status(400).json({ 
                success: false, 
                message: 'You are already enrolled in this session' 
            });
        }

        // Get session details
        const session = await Session.findByPk(id);
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        // Check max participants
        if (session.maxParticipants && session.enrolledCount >= session.maxParticipants) {
            return res.status(400).json({ 
                success: false, 
                message: 'Session is full' 
            });
        }

        // Handle payment for paid sessions
        const sessionPrice = session.price || 0;
        const isFree = sessionPrice === 0;
        
        if (!isFree && type !== 'bid') {
            const user = await User.findByPk(studentId);
            if (!user || (user.credits || 0) < sessionPrice) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Insufficient credits' 
                });
            }
            // Deduct credits
            await user.update({ credits: (user.credits || 0) - sessionPrice });
        }

        // Create enrollment
        const enrollment = await StudentEnrollment.create({
            studentId,
            sessionId: id,
            type: isFree ? 'free' : (type || 'paid'),
            amountPaid: amountPaid || (isFree ? 0 : sessionPrice),
            bidId: bidId || null
        });

        // Update session enrolled count
        await session.update({ 
            enrolledCount: (session.enrolledCount || 0) + 1 
        });

        res.json({ 
            success: true, 
            message: 'Successfully enrolled in session',
            enrollment
        });
    } catch (error) {
        console.error('Enroll session error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/sessions/:id
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Session.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedSession = await Session.findByPk(req.params.id);
            res.json(updatedSession);
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/sessions/:id
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Session.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.json({ message: 'Session deleted successfully' });
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
