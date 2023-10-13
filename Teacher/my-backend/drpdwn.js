const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5002;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/teacher', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

// Define a Mongoose model for the dropdown values
const ClassValue = mongoose.model('DropdownValue', {
  value: String,
},'class');

const SubjectValue = mongoose.model('SubjectValue', {
  value: String,
},'subject');

const RoomValue = mongoose.model('RoomValue', {
  value: String,
},'room');

// Endpoint to fetch all dropdown values
app.get('/get-class-values', async (req, res) => {
  try {
    const values = await ClassValue.find();
    res.status(200).send({ success: true, data: values });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

app.get('/get-subject-values', async (req, res) => {
  try {
    const values = await SubjectValue.find();
    res.status(200).send({ success: true, data: values });
  } catch (error) {
    console.error("Error in /get-subject-values:", error);
    res.status(500).send({ success: false, error: error.message });
  
  }
});

app.get('/get-room-values', async (req, res) => {
  try {
    const values = await RoomValue.find();
    res.status(200).send({ success: true, data: values });
  } catch (error) {
    console.error("Error in /get-subject-values:", error);
    res.status(500).send({ success: false, error: error.message });
  
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
