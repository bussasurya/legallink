// backend/models/Message.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    consultation: {
        type: Schema.Types.ObjectId,
        ref: 'Consultation',
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String, // Text content is no longer required
    },
    fileUrl: {
        type: String, // The path to the uploaded file (e.g., /uploads/chat/...)
    },
    fileName: {
        type: String, // The original name of the file (e.g., "evidence.pdf")
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    read: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('Message', messageSchema);