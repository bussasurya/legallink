// backend/routes/message.js

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Consultation = require('../models/Consultation');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getIo } = require('../socket');

// --- Setup Multer for file uploads ---
const uploadDir = path.join(__dirname, '../uploads/chat_files');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `msg-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });
// ------------------------------------------

// @route   GET /api/messages/:consultationId
// @desc    Get all messages for a consultation
// @access  Private
router.get('/:consultationId', auth, async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.consultationId);
        if (!consultation) {
            return res.status(404).json({ msg: 'Consultation not found.' });
        }
        if (consultation.client.toString() !== req.user.id && consultation.lawyer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized.' });
        }

        const messages = await Message.find({ consultation: req.params.consultationId })
            .populate('sender', 'firstName lastName role')
            .sort({ timestamp: 1 });
        
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/messages/:consultationId
// @desc    Post a new message (now handles text AND files)
// @access  Private
router.post(
    '/:consultationId', 
    auth, 
    upload.single('file'), // Use multer to check for a single file named 'file'
    async (req, res) => {
    
    const { content, receiverId } = req.body;

    if (!content && !req.file) {
        return res.status(400).json({ msg: 'Message content is empty.' });
    }

    try {
        const consultation = await Consultation.findById(req.params.consultationId);
        if (!consultation) {
            return res.status(404).json({ msg: 'Consultation not found.' });
        }
        
        if (consultation.status !== 'Paid') {
             return res.status(400).json({ msg: 'Messaging is only enabled for paid consultations.' });
        }

        let fileUrl = null;
        let fileName = null;

        if (req.file) {
            fileUrl = req.file.path.replace(/\\/g, '/');
            fileName = req.file.originalname;
        }

        const newMessage = new Message({
            consultation: req.params.consultationId,
            sender: req.user.id,
            receiver: receiverId,
            content: content || '',
            fileUrl: fileUrl,
            fileName: fileName,
        });

        const savedMessage = await newMessage.save();
        
        const populatedMessage = await Message.findById(savedMessage._id).populate('sender', 'firstName lastName role');

        const io = getIo();
        io.to(receiverId).emit('new_message', populatedMessage);
        
        res.json(populatedMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;