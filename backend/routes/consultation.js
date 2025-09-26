// backend/routes/consultation.js

const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getIo } = require('../socket');

const uploadDir = path.join(__dirname, '../uploads/cases');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `case-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.post('/', auth, upload.array('caseDocuments', 5), async (req, res) => {
    const { lawyerId, caseDescription } = req.body;
    try {
        const newConsultation = new Consultation({
            client: req.user.id,
            lawyer: lawyerId,
            caseDescription,
            caseDocuments: req.files ? req.files.map(file => ({ docName: file.originalname, filePath: file.path.replace(/\\/g, '/') })) : []
        });
        await newConsultation.save();
        const io = getIo();
        io.to(lawyerId).emit('new_consultation', { msg: `You have a new consultation request.` });
        res.status(201).json(newConsultation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation) return res.status(404).json({ msg: 'Consultation not found.' });
        if (consultation.lawyer.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized.' });
        consultation.status = status;
        await consultation.save();
        res.json(consultation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id)
            .populate('lawyer', 'firstName lastName specialization email phone')
            .populate('client', 'firstName lastName');
        if (!consultation) return res.status(404).json({ msg: 'Consultation not found.' });
        if (consultation.client._id.toString() !== req.user.id && consultation.lawyer._id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized.' });
        }
        res.json(consultation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/dismiss/:id', auth, async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation) return res.status(404).json({ msg: 'Consultation not found.' });
        if (consultation.lawyer.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized.' });
        consultation.lawyerDismissed = true;
        await consultation.save();
        res.json({ msg: 'Consultation dismissed from view.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/client/:id', auth, async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation) return res.status(404).json({ msg: 'Consultation not found.' });
        if (consultation.client.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this request.' });
        }
        await consultation.deleteOne();
        res.json({ msg: 'Consultation request permanently deleted.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- THIS ROUTE WAS LIKELY MISSING ---
// @route   GET /api/consultations/check/:lawyerId
// @desc    Check if a pending consultation exists with a lawyer
router.get('/check/:lawyerId', auth, async (req, res) => {
    try {
        const existingConsultation = await Consultation.findOne({
            client: req.user.id,
            lawyer: req.params.lawyerId,
            status: 'Pending'
        });
        res.json({ exists: !!existingConsultation });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;