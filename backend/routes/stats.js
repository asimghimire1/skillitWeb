const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Session = require('../models/Session');
const Content = require('../models/Content');
const User = require('../models/User');
const StudentContent = require('../models/StudentContent');
const StudentEnrollment = require('../models/StudentEnrollment');

// GET /api/stats/teacher/:teacherId
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const teacherId = req.params.teacherId;
        const sessions = await Session.findAll({ where: { teacherId } });
        const contents = await Content.findAll({ where: { teacherId } });

        // Calculate Stats
        const totalStudents = new Set(sessions.map(s => s.learnerId)).size;
        const activeSessions = sessions.filter(s => ['scheduled', 'in-progress'].includes(s.status)).length;
        const totalUploads = contents.length;

        // Calculate Earnings (Mock logic for now, assuming sessions have price and are completed)
        // In real app, check payment status. Here assume completed sessions are paid.
        const completedSessions = sessions.filter(s => s.status === 'completed');
        const monthlyEarnings = completedSessions.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);

        res.json({
            totalStudents,
            activeSessions,
            totalUploads,
            monthlyEarnings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/stats/student/:studentId
router.get('/student/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;

        // Get the user to fetch their actual credits
        const user = await User.findByPk(studentId);
        const credits = user ? (user.credits || 1000) : 1000;

        // Get actual enrollments and content
        const enrollments = await StudentEnrollment.findAll({ where: { studentId } });
        const studentContent = await StudentContent.findAll({ where: { studentId, status: 'active' } });

        // Calculate hours learned from completed sessions
        const completedEnrollments = enrollments.filter(e => e.status === 'completed');
        let hoursLearned = 0;
        for (const enrollment of completedEnrollments) {
            if (enrollment.sessionId) {
                const session = await Session.findByPk(enrollment.sessionId);
                if (session) {
                    hoursLearned += (session.duration || 60) / 60;
                }
            }
        }

        res.json({
            hoursLearned: Math.round(hoursLearned * 10) / 10,
            sessionsAttended: completedEnrollments.length,
            sessionsEnrolled: enrollments.length,
            contentWatched: studentContent.length,
            credits: credits,
            skillsMastered: 0,
            dayStreak: 0
        });
    } catch (error) {
        console.error('Get student stats error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/stats/teacher/:teacherId/earnings
router.get('/teacher/:teacherId/earnings', async (req, res) => {
    try {
        const teacherId = req.params.teacherId;

        // --- Content Earnings ---
        const contents = await Content.findAll({ where: { teacherId } });

        const contentBreakdown = await Promise.all(contents.map(async (c) => {
            const purchases = await StudentContent.findAll({
                where: { contentId: c.id, status: { [Op.ne]: 'refunded' } }
            });
            const buyerCount = purchases.length;
            const totalEarned = purchases.reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);
            return {
                id: c.id,
                title: c.title,
                type: 'content',
                category: c.category,
                price: parseFloat(c.price) || 0,
                buyerCount,
                totalEarned
            };
        }));

        // --- Session Earnings ---
        const sessions = await Session.findAll({ where: { teacherId } });

        const sessionBreakdown = await Promise.all(sessions.map(async (s) => {
            const enrollments = await StudentEnrollment.findAll({
                where: { sessionId: s.id, status: { [Op.ne]: 'cancelled' } }
            });
            const enrolleeCount = enrollments.length;
            const totalEarned = enrollments.reduce((sum, e) => sum + (parseFloat(e.amountPaid) || 0), 0);
            return {
                id: s.id,
                title: s.title,
                type: 'session',
                category: s.category,
                scheduledDate: s.scheduledDate,
                price: parseFloat(s.price) || 0,
                enrolleeCount,
                totalEarned
            };
        }));

        const contentEarnings = contentBreakdown.reduce((sum, c) => sum + c.totalEarned, 0);
        const sessionEarnings = sessionBreakdown.reduce((sum, s) => sum + s.totalEarned, 0);
        const totalEarnings = contentEarnings + sessionEarnings;

        res.json({
            totalEarnings,
            contentEarnings,
            sessionEarnings,
            contentBreakdown,
            sessionBreakdown
        });

    } catch (error) {
        console.error('Get earnings error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
