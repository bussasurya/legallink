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
    
    // --- NEW UNIQUE ID FIELD ---
    caseId: {
        type: String,
        unique: true,
        required: true
    },
    // --------------------------

    caseCategory: {
        type: String,
        required: true,
    },
    caseSubType: {
        type: String,
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
        enum: ['Pending', 'Accepted', 'Rejected', 'Paid', 'Completed'],
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
    
    bookingDetails: {
        clientName: { type: String },
        clientEmail: { type: String },
        clientPhone: { type: String },
        caseSubType: { type: String },
        caseTitle: { type: String },
        detailedDescription: { type: String },
        caseDocuments: [{
            docName: { type: String },
            filePath: { type: String },
        }],
    },

    bookedSlot: {
        date: { type: String },
        time: { type: String },
    },
});

module.exports = mongoose.model('Consultation', consultationSchema);