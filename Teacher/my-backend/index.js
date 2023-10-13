// index.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/teacher', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json());

// TODO: Add routes

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
