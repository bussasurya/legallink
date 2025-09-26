// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');

// @route   POST api/auth/register
router.post('/register', async (req, res) => {
    const { 
        firstName, lastName, email, password, role, phone, city, state, zipCode,
        govId, barCouncilId, primaryPracticeArea, additionalPracticeAreas, yearsOfExperience 
    } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 3600000;
        user = new User({
            firstName, lastName, email, password, role, phone, city, state, zipCode,
            govId: role === 'client' ? govId : undefined,
            barCouncilId: role === 'lawyer' ? barCouncilId : undefined,
            primaryPracticeArea: role === 'lawyer' ? primaryPracticeArea : undefined,
            additionalPracticeAreas: role === 'lawyer' ? additionalPracticeAreas : undefined,
            yearsOfExperience: role === 'lawyer' ? yearsOfExperience : undefined,
            verificationToken,
            tokenExpiry,
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        await sendVerificationEmail(user.email, verificationToken);
        res.status(201).json({ msg: 'Registration successful. Please check your email to verify your account.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/verify/:token
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token, tokenExpiry: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ msg: 'Verification token is invalid or has expired.' });
        }
        user.emailVerified = true;
        user.verificationToken = undefined;
        user.tokenExpiry = undefined;
        await user.save();
        res.json({ msg: 'Email verified successfully. You can now log in.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ msg: 'Invalid credentials' }); }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(400).json({ msg: 'Invalid credentials' }); }

        if (user.role !== 'admin' && !user.emailVerified) {
            return res.status(401).json({ msg: 'Please verify your email before logging in.' });
        }

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: payload.user });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/resend-verification
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User with this email does not exist.' });
        }
        if (user.emailVerified) {
            return res.status(400).json({ msg: 'This account has already been verified.' });
        }
        user.verificationToken = crypto.randomBytes(32).toString('hex');
        user.tokenExpiry = Date.now() + 3600000;
        await user.save();
        await sendVerificationEmail(user.email, user.verificationToken);
        res.json({ msg: 'A new verification email has been sent to your email address.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;