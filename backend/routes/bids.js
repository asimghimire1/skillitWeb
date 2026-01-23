const express = require('express');
const router = express.Router();

// GET /api/bids/student/:studentId
// Returns student's bids
router.get('/student/:studentId', async (req, res) => {
    try {
        // For now, return empty array (can be enhanced with real bid tracking)
        // In a real app, you would query the Bid model
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/bids/teacher/:teacherId
// Returns bids for teacher's sessions
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        // For now, return empty array
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
