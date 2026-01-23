const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// GET /api/sessions - Get all sessions (for students)
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.findAll({
            order: [['scheduledDate', 'ASC'], ['scheduledTime', 'ASC']]
        });
        res.json(sessions);
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
