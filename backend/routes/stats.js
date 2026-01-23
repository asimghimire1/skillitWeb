const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Content = require('../models/Content');

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
        
        // For now, return default stats (can be enhanced later with real tracking)
        res.json({
            hoursLearned: 0,
            sessionsAttended: 0,
            contentWatched: 0,
            credits: 1000, // Default starting credits
            skillsMastered: 0,
            dayStreak: 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
