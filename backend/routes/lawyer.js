// backend/routes/lawyer.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Consultation = require('../models/Consultation');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${req.user.id}-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// --- PRIVATE LAWYER ROUTES ---

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/upload-documents', auth, upload.fields([{ name: 'idProof', maxCount: 1 }, { name: 'degree', maxCount: 1 }]), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) { return res.status(404).json({ msg: 'User not found' }); }
        user.documents = [
            { docName: 'ID Proof', filePath: req.files.idProof[0].path },
            { docName: 'Degree', filePath: req.files.degree[0].path }
        ];
        await user.save();
        res.json({ msg: 'Documents uploaded successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/consultations', auth, async (req, res) => {
    try {
        const consultations = await Consultation.find({ lawyer: req.user.id, lawyerDismissed: false })
            .populate('client', ['firstName', 'lastName']);
        res.json(consultations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- PUBLIC LAWYER ROUTES ---

router.get('/verified', async (req, res) => {
    try {
        const lawyers = await User.find({ role: 'lawyer', isVerified: true }).select('-password -documents');
        res.json(lawyers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/category/:categoryName', async (req, res) => {
    try {
        const lawyers = await User.find({
            role: 'lawyer',
            isVerified: true,
            primaryPracticeArea: req.params.categoryName
        }).select('-password -documents');
        res.json(lawyers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const lawyer = await User.findOne({ 
            _id: req.params.id, 
            role: 'lawyer', 
            isVerified: true 
        }).select('-password -documents -email -phone');
        if (!lawyer) {
            return res.status(404).json({ msg: 'Lawyer not found or not verified.' });
        }
        res.json(lawyer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;