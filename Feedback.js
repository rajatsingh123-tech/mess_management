const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        trim: true
    },
    hostelRoomNumber: {
        type: String,
        required: true,
        trim: true
    },
    foodRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedbackText: {
        type: String,
        required: true,
        trim: true
    },
    sentiment: {
        type: String,
        enum: ['Positive', 'Negative', 'Neutral'],
        default: 'Neutral'
    },
    menuItem: {  // NEW - to track which menu item feedback is about
        type: String,
        default: 'General'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);