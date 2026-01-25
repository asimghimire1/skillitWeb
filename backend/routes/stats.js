const express = require('express');
const router = express.Router();
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

module.exports = router;
