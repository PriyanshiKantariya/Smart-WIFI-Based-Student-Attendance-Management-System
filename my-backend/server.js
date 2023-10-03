const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const DB_URL = 'mongodb://localhost:27017/attendance';

app.use(bodyParser.json());

// Mongoose model
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    date: String,
    status: String
});

const SubjectSchema = new Schema({
    subjectID: String,
    attendance: [AttendanceSchema]
});

const StudentSchema = new Schema({
    username: String,
    subjects: [SubjectSchema]
});

const Student = mongoose.model('Student', StudentSchema, 'studatten');

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB via Mongoose.');

        app.listen(3000, () => {
            console.log('Server started on http://localhost:3000');
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

app.post('/recordAttendance', async (req, res) => {
    try {
        const { username, subjectID, status } = req.body;
        console.log(username);
        console.log(subjectID);
        console.log(status);

        const student = await Student.findOne({ username, 'subjects.subjectID': subjectID });

        if (student) {
            const subject = student.subjects.find(sub => sub.subjectID === subjectID);
            subject.attendance.push({ date: new Date().toISOString(), status });

            await student.save();

            res.json({ success: true });
        } else {
            res.json({ success: false, message: "Student or subject not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
