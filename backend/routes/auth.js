import express from 'express';
import { Student } from '../models/Student.js';
import { Admin } from '../models/Admin.js';

const router = express.Router();

// ---- STUDENT AUTH ----
router.post('/register', async (req, res) => {
  try {
    const { fullName, studentId, email, password, department, yearSemester, phone } = req.body;
    
    // Check if exists
    const existing = await Student.findOne({ $or: [{ email }, { studentId }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Student already exists' });
    }

    const student = new Student({ fullName, studentId, email, password, department, yearSemester, phone });
    await student.save();
    
    res.json({ success: true, message: 'Registration successful', user: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({
      email,
      password
    });

    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({ success: true, message: 'Login successful', user: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---- ADMIN AUTH ----
router.post('/admin/register', async (req, res) => {
  try {
    const { fullName, adminUsername, email, phone, password } = req.body;
    
    const existing = await Admin.findOne({ $or: [{ email }, { adminUsername }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    const admin = new Admin({ fullName, adminUsername, email, phone, password });
    await admin.save();
    
    res.json({ success: true, message: 'Admin registration successful', user: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const admin = await Admin.findOne({
      $or: [{ email: identifier }, { adminUsername: identifier }],
      password
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    res.json({ success: true, message: 'Admin login successful', user: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
