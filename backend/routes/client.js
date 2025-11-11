// backend/routes/client.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Consultation = require('../models/Consultation');
const auth = require('../middleware/auth');

// @route   POST /api/client/analyze-case
// @desc    Analyzes a case description using Hugging Face
// @access  Public
router.post('/analyze-case', async (req, res) => {
    const { description } = req.body;
    const apiToken = process.env.HUGGINGFACE_API_TOKEN;

    // This is the correct Hugging Face API endpoint for this model
    const apiUrl = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli";

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
                "inputs": description,
                "parameters": { "candidate_labels": legalCategories },
            },
            {
                headers: { Authorization: `Bearer ${apiToken}` }
            }
        );

        // --- CRITICAL FIX: ---
        // The response from this API is an ARRAY, not an object.
        // We must check the first element of the array.
        if (!hfResponse.data || !Array.isArray(hfResponse.data) || hfResponse.data.length === 0 || !hfResponse.data[0].label) {
            console.error('Invalid response from Hugging Face:', hfResponse.data);
            throw new Error('AI model did not return a valid category.');
        }

        // Get the category with the highest score from the first element
        const category = hfResponse.data[0].label;
        // -----------------------------------------------------------

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
        res.status(500).json({ msg: 'Error analyzing your case. The AI model may be loading, please try again in a moment.' });
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
        console.error("--- ERROR FETCHING CLIENT CONSULTATIONS ---", err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;