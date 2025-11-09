// backend/models/Availability.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeSlotSchema = new Schema({
    startTime: { type: String, required: true }, // e.g., "10:00"
    endTime: { type: String, required: true },   // e.g., "13:00"
}, { _id: false });

const availabilitySchema = new Schema({
    lawyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // Each lawyer has only one availability document
    },
    schedule: {
        monday: [timeSlotSchema],
        tuesday: [timeSlotSchema],
        wednesday: [timeSlotSchema],
        thursday: [timeSlotSchema],
        friday: [timeSlotSchema],
        saturday: [timeSlotSchema],
        sunday: [timeSlotSchema],
    },
    consultationFee: {
        type: Number, // Fee in the smallest currency unit (e.g., paisa)
        required: true,
        default: 50000, // Default to ₹500
    }
});

module.exports = mongoose.model('Availability', availabilitySchema);