// backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Updated to match the form
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['client', 'lawyer', 'admin'], required: true },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    
    // Client-Specific Field
    govId: { type: String },

    // Lawyer-Specific Fields
    barCouncilId: { type: String, unique: true, sparse: true },
    primaryPracticeArea: { type: String },
    additionalPracticeAreas: [{ type: String }],
    yearsOfExperience: { type: Number },
    
    // Verification Fields
    isVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    tokenExpiry: { type: Date },
    documents: [{
        docName: { type: String },
        filePath: { type: String },
    }],
});

module.exports = mongoose.model('User', userSchema);