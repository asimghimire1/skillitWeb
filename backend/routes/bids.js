const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const User = require('../models/User');
const Session = require('../models/Session');
const Content = require('../models/Content');
const StudentEnrollment = require('../models/StudentEnrollment');
const StudentContent = require('../models/StudentContent');

// GET /api/bids/student/:studentId
// Returns student's bids with session/content and teacher info
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const bids = await Bid.findAll({
            where: { learnerId: studentId },
            order: [['created_at', 'DESC']]
        });

        // Enrich bids with session/content and teacher info
        const enrichedBids = await Promise.all(bids.map(async (bid) => {
            const bidData = bid.toJSON();
            
            // Get teacher info
            if (bid.teacherId) {
                const teacher = await User.findByPk(bid.teacherId, {
                    attributes: ['id', 'fullname', 'profilePicture']
                });
                if (teacher) {
                    bidData.teacherName = teacher.fullname;
                    bidData.teacherAvatar = teacher.profilePicture;
                }
            }

            // Get session info if sessionId exists
            if (bid.sessionId) {
                const session = await Session.findByPk(bid.sessionId);
                if (session) {
                    bidData.sessionTitle = session.title;
                    bidData.sessionDate = session.scheduledDate;
                    bidData.sessionTime = session.scheduledTime;
                }
            }

            // Get content info if contentId exists
            if (bid.contentId) {
                const content = await Content.findByPk(bid.contentId);
                if (content) {
                    bidData.contentTitle = content.title;
                    bidData.contentThumbnail = content.thumbnail;
                }
            }

            return bidData;
        }));

        res.json(enrichedBids);
    } catch (error) {
        console.error('Get student bids error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/bids/teacher/:teacherId
// Returns bids for teacher's sessions/content with student info
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;
        const bids = await Bid.findAll({
            where: { teacherId },
            order: [['created_at', 'DESC']]
        });

        // Enrich bids with student and session/content info
        const enrichedBids = await Promise.all(bids.map(async (bid) => {
            const bidData = bid.toJSON();
            
            // Get student info
            if (bid.learnerId) {
                const student = await User.findByPk(bid.learnerId, {
                    attributes: ['id', 'fullname', 'profilePicture', 'email']
                });
                if (student) {
                    bidData.studentName = student.fullname;
                    bidData.studentAvatar = student.profilePicture;
                    bidData.studentEmail = student.email;
                }
            }

            // Get session info
            if (bid.sessionId) {
                const session = await Session.findByPk(bid.sessionId);
                if (session) {
                    bidData.sessionTitle = session.title;
                    bidData.originalPrice = session.price;
                }
            }

            // Get content info
            if (bid.contentId) {
                const content = await Content.findByPk(bid.contentId);
                if (content) {
                    bidData.contentTitle = content.title;
                    bidData.originalPrice = content.price;
                }
            }

            return bidData;
        }));

        res.json(enrichedBids);
    } catch (error) {
        console.error('Get teacher bids error:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/bids - Create a new bid
router.post('/', async (req, res) => {
    try {
        const bidData = req.body;
        const bid = await Bid.create(bidData);
        res.status(201).json({ success: true, bid });
    } catch (error) {
        console.error('Create bid error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/bids/:id - Update bid (for counter offers, accept, reject)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const [updated] = await Bid.update(updateData, { where: { id } });
        
        if (updated) {
            const updatedBid = await Bid.findByPk(id);
            res.json({ success: true, bid: updatedBid });
        } else {
            res.status(404).json({ success: false, message: 'Bid not found' });
        }
    } catch (error) {
        console.error('Update bid error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/bids/:id - Cancel/delete a bid
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Bid.destroy({ where: { id } });
        
        if (deleted) {
            res.json({ success: true, message: 'Bid cancelled successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Bid not found' });
        }
    } catch (error) {
        console.error('Delete bid error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/bids/:id/counter - Make a counter offer
router.post('/:id/counter', async (req, res) => {
    try {
        const { id } = req.params;
        const { counterPrice, counterMessage } = req.body;

        const bid = await Bid.findByPk(id);
        if (!bid) {
            return res.status(404).json({ success: false, message: 'Bid not found' });
        }

        await bid.update({
            status: 'counter',
            counterOffer: JSON.stringify({ price: counterPrice, message: counterMessage })
        });

        res.json({ success: true, bid });
    } catch (error) {
        console.error('Counter offer error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/bids/:id/accept - Accept a bid
router.post('/:id/accept', async (req, res) => {
    try {
        const { id } = req.params;
        const bid = await Bid.findByPk(id);
        
        if (!bid) {
            return res.status(404).json({ success: false, message: 'Bid not found' });
        }

        await bid.update({ status: 'accepted' });

        // If it's a session bid, create the session enrollment
        if (bid.sessionId) {
            const session = await Session.findByPk(bid.sessionId);
            await StudentEnrollment.create({
                studentId: bid.learnerId,
                sessionId: bid.sessionId,
                status: 'enrolled',
                type: 'bid',
                amountPaid: bid.proposedPrice,
                bidId: bid.id
            });
            // Update enrolled count
            if (session) {
                await session.update({ enrolledCount: (session.enrolledCount || 0) + 1 });
            }
        }

        // If it's a content bid, unlock content for student
        if (bid.contentId) {
            await StudentContent.create({
                studentId: bid.learnerId,
                contentId: bid.contentId,
                type: 'bid',
                amountPaid: bid.proposedPrice,
                bidId: bid.id
            });
        }

        res.json({ success: true, message: 'Bid accepted', bid });
    } catch (error) {
        console.error('Accept bid error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/bids/:id/reject - Reject a bid
router.post('/:id/reject', async (req, res) => {
    try {
        const { id } = req.params;
        const bid = await Bid.findByPk(id);
        
        if (!bid) {
            return res.status(404).json({ success: false, message: 'Bid not found' });
        }

        await bid.update({ status: 'rejected' });
        res.json({ success: true, message: 'Bid rejected', bid });
    } catch (error) {
        console.error('Reject bid error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/bids/:id/respond - Student responds to counter offer (accept/reject)
router.post('/:id/respond', async (req, res) => {
    try {
        const { id } = req.params;
        const { accept } = req.body;

        const bid = await Bid.findByPk(id);
        if (!bid) {
            return res.status(404).json({ success: false, message: 'Bid not found' });
        }

        if (accept) {
            // Student accepts the counter offer
            let counterData = {};
            try {
                counterData = JSON.parse(bid.counterOffer);
            } catch (e) {
                counterData = { price: bid.proposedPrice };
            }

            await bid.update({ 
                status: 'accepted',
                proposedPrice: counterData.price || bid.proposedPrice
            });

            // Create enrollment or content unlock
            if (bid.sessionId) {
                const session = await Session.findByPk(bid.sessionId);
                await StudentEnrollment.create({
                    studentId: bid.learnerId,
                    sessionId: bid.sessionId,
                    status: 'enrolled',
                    type: 'bid',
                    amountPaid: counterData.price || bid.proposedPrice,
                    bidId: bid.id
                });
                if (session) {
                    await session.update({ enrolledCount: (session.enrolledCount || 0) + 1 });
                }
            }

            if (bid.contentId) {
                await StudentContent.create({
                    studentId: bid.learnerId,
                    contentId: bid.contentId,
                    type: 'bid',
                    amountPaid: counterData.price || bid.proposedPrice,
                    bidId: bid.id
                });
            }

            res.json({ success: true, message: 'Counter offer accepted', bid });
        } else {
            // Student rejects the counter offer
            await bid.update({ status: 'rejected' });
            res.json({ success: true, message: 'Counter offer rejected', bid });
        }
    } catch (error) {
        console.error('Respond to counter error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/bids/:id/teacher-respond - Teacher responds to bid (accept/reject/counter)
router.post('/:id/teacher-respond', async (req, res) => {
    try {
        const { id } = req.params;
        const { action, counterPrice, counterMessage } = req.body;

        const bid = await Bid.findByPk(id);
        if (!bid) {
            return res.status(404).json({ success: false, message: 'Bid not found' });
        }

        if (action === 'accept') {
            await bid.update({ status: 'accepted' });

            // Create enrollment or content unlock
            if (bid.sessionId) {
                const session = await Session.findByPk(bid.sessionId);
                await StudentEnrollment.create({
                    studentId: bid.learnerId,
                    sessionId: bid.sessionId,
                    status: 'enrolled',
                    type: 'bid',
                    amountPaid: bid.proposedPrice,
                    bidId: bid.id
                });
                if (session) {
                    await session.update({ enrolledCount: (session.enrolledCount || 0) + 1 });
                }
            }

            if (bid.contentId) {
                await StudentContent.create({
                    studentId: bid.learnerId,
                    contentId: bid.contentId,
                    type: 'bid',
                    amountPaid: bid.proposedPrice,
                    bidId: bid.id
                });
            }

            res.json({ success: true, message: 'Bid accepted', bid });
        } else if (action === 'reject') {
            await bid.update({ status: 'rejected' });
            res.json({ success: true, message: 'Bid rejected', bid });
        } else if (action === 'counter') {
            await bid.update({
                status: 'counter',
                counterOffer: JSON.stringify({ price: counterPrice, message: counterMessage })
            });
            res.json({ success: true, message: 'Counter offer sent', bid });
        } else {
            res.status(400).json({ success: false, message: 'Invalid action' });
        }
    } catch (error) {
        console.error('Teacher respond error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
