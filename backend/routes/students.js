const express = require('express');
const router = express.Router();

// GET /api/students/:studentId/enrollments
// Returns student's enrolled sessions
router.get('/:studentId/enrollments', async (req, res) => {
    try {
        // For now, return empty array (can be enhanced with real enrollment tracking)
        // In a real app, you would have an Enrollment model
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/students/:studentId/content
// Returns student's unlocked content
router.get('/:studentId/content', async (req, res) => {
    try {
        // For now, return empty array (can be enhanced with real content unlock tracking)
        // In a real app, you would have an UnlockedContent model
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
