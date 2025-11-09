// backend/routes/availability.js

const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const auth = require('../middleware/auth');

// @route   GET /api/availability
// @desc    Get the logged-in lawyer's own availability
// @access  Private (Lawyer)
router.get('/', auth, async (req, res) => {
    try {
        let availability = await Availability.findOne({ lawyer: req.user.id });

        if (!availability) {
            // If no schedule exists, create a default one
            availability = new Availability({
                lawyer: req.user.id,
                schedule: {
                    monday: [], tuesday: [], wednesday: [],
                    thursday: [], friday: [], saturday: [], sunday: []
                },
                consultationFee: 50000 // Default fee (e.g., ₹500.00)
            });
            await availability.save();
        }
        res.json(availability);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/availability
// @desc    Create or update a lawyer's availability
// @access  Private (Lawyer)
router.post('/', auth, async (req, res) => {
    const { schedule, consultationFee } = req.body;
    try {
        const availabilityFields = {
            lawyer: req.user.id,
            schedule,
            consultationFee,
        };

        const availability = await Availability.findOneAndUpdate(
            { lawyer: req.user.id },
            { $set: availabilityFields },
            { new: true, upsert: true }
        );

        res.json(availability);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/availability/:lawyerId
// @desc    Get a specific lawyer's availability for booking
// @access  Private (Client)
router.get('/:lawyerId', auth, async (req, res) => {
    try {
        const availability = await Availability.findOne({ lawyer: req.params.lawyerId });
        if (!availability) {
            return res.status(404).json({ msg: 'This lawyer has not set their availability yet.' });
        }
        res.json(availability);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;