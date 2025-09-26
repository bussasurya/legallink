// backend/routes/admin.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   GET api/admin/test
// @desc    Tests the admin route to ensure it's loading correctly
// @access  Public (for now)
router.get('/test', (req, res) => res.json({ msg: 'Admin Route is working' }));


// @route   GET api/admin/lawyers
// @desc    Get all lawyers for verification
// @access  Private (Admin only)
router.get('/lawyers', auth, adminAuth, async (req, res) => {
    try {
        // Find all users with the role 'lawyer'
        const lawyers = await User.find({ role: 'lawyer' }).select('-password');
        res.json(lawyers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/verify-lawyer/:id
// @desc    Approve or reject a lawyer's verification
// @access  Private (Admin only)
router.put('/verify-lawyer/:id', auth, adminAuth, async (req, res) => {
    const { isVerified } = req.body; // Expecting { isVerified: true } or { isVerified: false }

    try {
        const lawyer = await User.findById(req.params.id);

        if (!lawyer || lawyer.role !== 'lawyer') {
            return res.status(404).json({ msg: 'Lawyer not found' });
        }

        lawyer.isVerified = isVerified;
        await lawyer.save();

        res.json({ msg: 'Lawyer verification status updated.', lawyer });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;