const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const analyzeSentiment = require('../utils/sentimentAnalysis');

// POST /api/feedback - Save new feedback
router.post('/', async (req, res) => {
    try {
        const { studentName, hostelRoomNumber, foodRating, feedbackText, menuItem } = req.body;
        
        if (!studentName || !hostelRoomNumber || !foodRating || !feedbackText) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        
        const sentiment = analyzeSentiment(feedbackText, foodRating);
        
        const newFeedback = new Feedback({
            studentName,
            hostelRoomNumber,
            foodRating: parseInt(foodRating),
            feedbackText,
            sentiment,
            menuItem: menuItem || 'General'
        });
        
        const savedFeedback = await newFeedback.save();
        
        res.status(201).json({
            message: 'Feedback submitted successfully!',
            feedback: savedFeedback
        });
        
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/feedback - Get all feedback
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        
        let averageRating = 0;
        if (feedbacks.length > 0) {
            const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.foodRating, 0);
            averageRating = (totalRating / feedbacks.length).toFixed(2);
        }
        
        res.status(200).json({
            success: true,
            count: feedbacks.length,
            averageRating: averageRating,
            feedbacks: feedbacks
        });
        
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/feedback/:id - Delete feedback (NEW)
router.delete('/:id', async (req, res) => {
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
        
        if (!deletedFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        
        res.status(200).json({ 
            success: true,
            message: 'Feedback deleted successfully' 
        });
        
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ 
            message: 'Server error while deleting feedback',
            error: error.message 
        });
    }
});

// DELETE /api/feedback/delete-all - Delete all feedback (optional)
router.delete('/delete-all', async (req, res) => {
    try {
        await Feedback.deleteMany({});
        res.status(200).json({ 
            success: true,
            message: 'All feedback deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting all feedback:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;