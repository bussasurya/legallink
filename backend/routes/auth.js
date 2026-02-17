// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');

// @route   POST api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, role, govId, ...lawyerData } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 3600000; // 1 hour

        user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            govId: role === 'client' ? govId : undefined,
            emailVerified: false,
            verificationToken,
            tokenExpiry,
            ...lawyerData
        });

        await user.save();

        // Create the full, public verification URL
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        
        // Pass the full URL to the email service
        await sendVerificationEmail(user.email, verificationUrl);

        res.status(201).json({ msg: 'Registration successful. Please check your email to verify your account.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/verify/:token
// @desc    Verify email address
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            verificationToken: req.params.token,
            tokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?message=Link expired or invalid.`);
        }

        user.emailVerified = true;
        user.verificationToken = undefined;
        user.tokenExpiry = undefined;
        await user.save();

        res.redirect(`${process.env.FRONTEND_URL}/login?message=Email verified successfully! You can now log in.`);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/login
// @desc    Login user and get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (!user.emailVerified) {
            return res.status(401).json({ msg: 'Please verify your email to log in.' });
        }

        if (user.role === 'lawyer' && !user.isVerified) {
            return res.status(401).json({ msg: 'Your profile is pending admin verification.' });
        }

        // --- CRITICAL FIX: The payload MUST have a 'user' object ---
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' } // 5 hour expiry
        );

        res.json({
            token,
            user: { ...payload.user, firstName: user.firstName } // Send user details back
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/resend-verification
// @desc    Resend verification email
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found.' });
        }
        if (user.emailVerified) {
            return res.status(400).json({ msg: 'This account is already verified.' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 3600000; // 1 hour

        user.verificationToken = verificationToken;
        user.tokenExpiry = tokenExpiry;
        await user.save();

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        await sendVerificationEmail(user.email, verificationUrl);

        res.json({ msg: 'A new verification email has been sent.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;