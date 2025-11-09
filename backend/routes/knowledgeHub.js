// backend/routes/knowledgeHub.js

const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const IPCSection = require('../models/IPCSection');
const auth = require('../middleware/auth'); // We use auth to allow admin-only posting

// @route   GET /api/knowledge-hub/articles
// @desc    Get all articles, grouped by category
// @access  Public
router.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find().sort({ category: 1, title: 1 });
        
        // Group articles by category
        const groupedArticles = articles.reduce((acc, article) => {
            const category = article.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(article);
            return acc;
        }, {});

        res.json(groupedArticles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/knowledge-hub/articles/:id
// @desc    Get a single article by its ID
// @access  Public
router.get('/articles/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ msg: 'Article not found' });
        }
        res.json(article);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/knowledge-hub/ipc/search
// @desc    Search for IPC sections
// @access  Public
router.get('/ipc/search', async (req, res) => {
    try {
        const query = req.query.q; // Get search query from ?q=...
        
        if (!query) {
            return res.status(400).json({ msg: 'Search query is required' });
        }

        // Create a regex to search case-insensitively
        const searchRegex = new RegExp(query, 'i');

        // Search in section number, title, or description
        const sections = await IPCSection.find({
            $or: [
                { section: searchRegex },
                { title: searchRegex },
                { description: searchRegex }
            ]
        }).limit(20); // Limit to 20 results

        res.json(sections);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/knowledge-hub/articles
// @desc    Create a new article (Admin only)
// @access  Private (Admin)
router.post('/articles', auth, async (req, res) => {
    // We can add adminAuth middleware here later
    if (req.user.role !== 'admin') {
        return res.status(401).json({ msg: 'Not authorized' });
    }
    
    try {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            author: req.user.id
        });
        const article = await newArticle.save();
        res.json(article);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;