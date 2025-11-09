// backend/models/Counter.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This schema will store a single counter that increments
const counterSchema = new Schema({
    _id: { 
        type: String, 
        required: true 
    },
    seq: { 
        type: Number, 
        default: 0 
    }
});

module.exports = mongoose.model('Counter', counterSchema);