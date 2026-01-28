const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET /api/notifications/:userId - Get all notifications for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.findAll({
            where: { userId },
            order: [['created_at', 'DESC']],
            limit: 50
        });
        res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/notifications/:userId/unread-count - Get unread notification count
router.get('/:userId/unread-count', async (req, res) => {
    try {
        const { userId } = req.params;
        const count = await Notification.count({
            where: { userId, isRead: false }
        });
        res.json({ count });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.update({ isRead: true }, { where: { id } });
        res.json({ success: true });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/notifications/:userId/read-all - Mark all notifications as read
router.put('/:userId/read-all', async (req, res) => {
    try {
        const { userId } = req.params;
        await Notification.update({ isRead: true }, { where: { userId, isRead: false } });
        res.json({ success: true });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.destroy({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/notifications - Create a notification (internal use)
router.post('/', async (req, res) => {
    try {
        const notification = await Notification.create(req.body);
        res.status(201).json({ success: true, notification });
    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
