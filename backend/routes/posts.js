const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// GET /api/posts - Get all posts (for students) with teacher info
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const options = {
            order: [['created_at', 'DESC']]
        };
        if (limit) {
            options.limit = limit;
        }
        const posts = await Post.findAll(options);
        
        // Enrich posts with teacher info
        const enrichedPosts = await Promise.all(posts.map(async (post) => {
            const postData = post.toJSON();
            if (post.teacherId) {
                const teacher = await User.findByPk(post.teacherId, {
                    attributes: ['id', 'fullname', 'avatar', 'bio']
                });
                if (teacher) {
                    postData.teacherName = teacher.fullname;
                    postData.teacherAvatar = teacher.avatar;
                    postData.teacherBio = teacher.bio;
                }
            }
            return postData;
        }));
        
        res.json(enrichedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/posts/teacher/:teacherId
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { teacherId: req.params.teacherId },
            order: [['created_at', 'DESC']]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/posts
router.post('/', async (req, res) => {
    try {
        const post = await Post.create(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/posts/:id
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check 30 minute edit limit
        const now = new Date();
        const created = new Date(post.created_at);
        const diffMinutes = (now - created) / 1000 / 60;

        if (diffMinutes > 30) {
            return res.status(403).json({ message: 'Edit time limit exceeded (30 minutes)' });
        }

        const [updatedLines] = await Post.update(req.body, { where: { id: req.params.id } });

        if (updatedLines > 0) {
            const updatedPost = await Post.findByPk(req.params.id);
            res.json(updatedPost);
        } else {
            res.json(post); // No changes but success
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/posts/:id
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Post.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.json({ message: 'Post deleted successfully' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
