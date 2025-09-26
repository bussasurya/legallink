// backend/models/Consultation.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    lawyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    caseDescription: {
        type: String,
        required: true,
    },
    caseDocuments: [{
        docName: { type: String },
        filePath: { type: String },
    }],
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
        default: 'Pending',
    },
    lawyerDismissed: {
        type: Boolean,
        default: false,
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Consultation', consultationSchema);