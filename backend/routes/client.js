// backend/routes/client.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Consultation = require('../models/Consultation'); // Import Consultation model
const auth = require('../middleware/auth'); // To protect the new route

// @route   POST /api/client/analyze-case
// @desc    Analyzes a case description using Hugging Face
// @access  Public
router.post('/analyze-case', async (req, res) => {
    const { description } = req.body;
    const apiToken = process.env.HUGGINGFACE_API_TOKEN;
    const apiUrl = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";

    if (!description) {
        return res.status(400).json({ msg: 'Please provide a case description.' });
    }
    if (!apiToken) {
        return res.status(500).json({ msg: 'Hugging Face API token is not configured on the server.' });
    }

    const legalCategories = ["Family Law", "Criminal Law", "Corporate Law", "Real Estate Law", "General Consultation", "Consumer Protection Law"];

    try {
        const hfResponse = await axios.post(apiUrl, 
            {
                inputs: description,
                parameters: { candidate_labels: legalCategories },
            },
            {
                headers: { Authorization: `Bearer ${apiToken}` }
            }
        );

        if (!hfResponse.data || !Array.isArray(hfResponse.data.labels) || hfResponse.data.labels.length === 0) {
            console.error('Invalid response from Hugging Face:', hfResponse.data);
            throw new Error('AI model did not return a valid category.');
        }

        const category = hfResponse.data.labels[0];

        const matchingLawyers = await User.find({
            role: 'lawyer',
            isVerified: true,
            primaryPracticeArea: category,
        }).select('-password -documents');

        res.json({
            suggestedCategory: category,
            matchingLawyers: matchingLawyers,
        });

    } catch (err) {
        console.error("--- CASE ANALYSIS FAILED ---");
        if (err.response) {
            console.error("API Response Error Data:", err.response.data);
        } else {
            console.error("Error Message:", err.message);
        }
        res.status(500).json({ msg: 'There was an error analyzing your case. The AI model may be loading, please try again in a moment.' });
    }
});


// @route   GET /api/client/my-consultations
// @desc    Get all consultation requests made by the logged-in client
// @access  Private
router.get('/my-consultations', auth, async (req, res) => {
    try {
        const consultations = await Consultation.find({ client: req.user.id })
            .populate('lawyer', 'firstName lastName'); // Get the lawyer's name
        
        res.json(consultations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;