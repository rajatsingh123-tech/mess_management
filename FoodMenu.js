const mongoose = require('mongoose');

const foodMenuSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true,
        enum: ['January', 'February', 'March', 'April', 'May', 'June', 
               'July', 'August', 'September', 'October', 'November', 'December']
    },
    year: {
        type: Number,
        required: true
    },
    menuItems: [{
        day: {
            type: String,
            required: true,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        breakfast: {
            type: String,
            required: true
        },
        lunch: {
            type: String,
            required: true
        },
        dinner: {
            type: String,
            required: true
        }
    }],
    createdBy: {
        type: String,
        default: 'Admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FoodMenu', foodMenuSchema);