// backend/routes/consultation.js

const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const Counter = require('../models/Counter'); // Import the Counter model
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
// This upload is only for the booking details step
const upload = multer({ storage });

// @route   POST /api/consultations
// @desc    Create a new consultation request
router.post('/', auth, async (req, res) => {
    const { lawyerId, caseDescription, caseCategory, caseSubType } = req.body;
    
    if (!caseDescription || !caseCategory) {
        return res.status(400).json({ msg: "Please provide all required fields." });
    }

    try {
        // --- LOGIC TO PREVENT DUPLICATE BOOKINGS ---
        const existingActiveCase = await Consultation.findOne({
            client: req.user.id,
            lawyer: lawyerId,
            status: { $in: ['Pending', 'Accepted', 'Paid'] }
        });

        if (existingActiveCase) {
            return res.status(400).json({ msg: 'You already have an active case with this lawyer.' });
        }

        // --- LOGIC TO GENERATE UNIQUE CASE ID ---
        const counter = await Counter.findOneAndUpdate(
            { _id: 'consultationId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        
        const caseId = `CASE-${String(counter.seq).padStart(6, '0')}`;
        // ----------------------------------------

        const newConsultation = new Consultation({
            client: req.user.id,
            lawyer: lawyerId,
            caseId: caseId, // Add the new unique ID
            caseCategory: caseCategory,
            caseSubType: caseSubType,
            caseDescription: caseDescription,
            caseDocuments: [] // Files will be added later
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

// @route   PUT /api/consultations/:id
// @desc    Update status (Lawyer)
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

// @route   GET /api/consultations/:id
// @desc    Get a single consultation by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id)
            .populate('lawyer', 'firstName lastName specialization email phone primaryPracticeArea')
            // --- CRITICAL FIX: Added 'email' and 'phone' to the client populate ---
            .populate('client', 'firstName lastName email phone');
            
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

// @route   PUT /api/consultations/dismiss/:id
// @desc    Dismiss from lawyer's view
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

// @route   DELETE /api/consultations/client/:id
// @desc    Delete a consultation (Client)
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

// @route   GET /api/consultations/check/:lawyerId
// @desc    Check for existing active requests
router.get('/check/:lawyerId', auth, async (req, res) => {
    try {
        const existingConsultation = await Consultation.findOne({
            client: req.user.id,
            lawyer: req.params.lawyerId,
            status: { $in: ['Pending', 'Accepted', 'Paid'] }
        });
        res.json({ exists: !!existingConsultation });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/consultations/:id/details
// @desc    Add detailed info and documents (Step 1 of booking)
router.put(
    '/:id/details', 
    auth, 
    upload.array('caseDocuments', 5),
    async (req, res) => {
        try {
            const consultation = await Consultation.findById(req.params.id);
            if (!consultation || consultation.client.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized.' });
            }
            if (consultation.status !== 'Accepted') {
                return res.status(400).json({ msg: 'You can only add details to an accepted consultation.' });
            }
            
            consultation.bookingDetails = {
                clientName: req.body.clientName,
                clientEmail: req.body.clientEmail,
                clientPhone: req.body.clientPhone,
                caseSubType: req.body.caseSubType,
                caseTitle: req.body.caseTitle,
                detailedDescription: req.body.detailedDescription,
            };

            if (req.files) {
                const newDocs = req.files.map(file => ({
                    docName: file.originalname,
                    filePath: file.path.replace(/\\/g, '/')
                }));
                consultation.bookingDetails.caseDocuments = [...(consultation.bookingDetails.caseDocuments || []), ...newDocs];
            }

            await consultation.save();
            res.json(consultation);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT /api/consultations/:id/schedule
// @desc    Save the scheduled slot (Step 2 of booking)
router.put('/:id/schedule', auth, async (req, res) => {
    const { date, time } = req.body;
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation || consultation.client.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized for this consultation.' });
        }
        
        consultation.bookedSlot = { date, time };
        await consultation.save();
        
        res.json(consultation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/consultations/:id/confirm-payment
// @desc    Mock Payment Route (Step 3 of booking)
router.put('/:id/confirm-payment', auth, async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation || consultation.client.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized.' });
        }
        
        consultation.status = 'Paid';
        await consultation.save();
        
        res.json({ msg: 'Payment confirmed! Your meeting is booked.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/consultations/:id/cancel
// @desc    Client cancels an accepted (but not paid) request
// @access  Private (Client)
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);

        if (!consultation) {
            return res.status(404).json({ msg: 'Consultation not found.' });
        }
        
        if (consultation.client.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized.' });
        }

        if (consultation.status !== 'Accepted') {
             return res.status(400).json({ msg: 'This case is not in a state that can be cancelled.' });
        }
        
        consultation.status = 'Rejected'; 
        await consultation.save();
        
        res.json({ msg: 'Consultation has been cancelled.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/consultations/:id/complete
// @desc    Mark a consultation as 'Completed'
// @access  Private (Client)
router.put('/:id/complete', auth, async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);
        
        if (!consultation || consultation.client.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized.' });
        }

        if (consultation.status !== 'Paid' && consultation.status !== 'Accepted') {
             return res.status(400).json({ msg: 'This case is not active.' });
        }
        
        consultation.status = 'Completed';
        await consultation.save();
        
        res.json({ msg: 'Case has been marked as completed.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;