const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const feedbackRoutes = require('./routes/feedbackRoutes');
const menuRoutes = require('./routes/menuRoutes');  // NEW

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas successfully!');
    })
    .catch((error) => {
        console.error('❌ MongoDB Connection Error:', error);
    });

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/menu', menuRoutes);  // NEW

app.get('/', (req, res) => {
    res.send('Hostel Mess Feedback System API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});