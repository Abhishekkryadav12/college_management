import express from 'express';
import { Student } from '../models/Student.js';
import { Admin } from '../models/Admin.js';

const router = express.Router();

// ---- STUDENT AUTH ----
router.post('/register', async (req, res) => {
  try {
    const { fullName, studentId, email, password, department, yearSemester, phone } = req.body;
    
    if (!fullName || !studentId || !email || !password || !department || !yearSemester) {
      console.warn(`⚠️ [Student Register] Missing required fields for email: "${email || 'unknown'}"`);
      return res.status(400).json({ success: false, message: 'Missing required registration fields' });
    }

    // Check if exists
    const existing = await Student.findOne({ $or: [{ email: email.trim().toLowerCase() }, { studentId: studentId.trim().toUpperCase() }] });
    if (existing) {
      console.warn(`⚠️ [Student Register] Account already exists for email: "${email}" or ID: "${studentId}"`);
      return res.status(400).json({ success: false, message: 'Student with this email or Roll Number already exists' });
    }

    const student = new Student({
      fullName: fullName.trim(),
      studentId: studentId.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      password,
      department,
      yearSemester,
      phone: phone ? phone.trim() : undefined,
    });
    await student.save();
    
    console.log(`✅ [Student Register] New student registered successfully: ${student.fullName} (${student.email})`);
    res.status(201).json({ success: true, message: 'Registration successful', user: student });
  } catch (error) {
    console.error('❌ [Student Register] Error occurred:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const student = await Student.findOne({
      email: email.trim().toLowerCase(),
      password,
    });

    if (!student) {
      console.warn(`⚠️ [Student Login] Invalid credentials for email: "${email}"`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log(`✅ [Student Login] Login successful: ${student.fullName} (${student.email})`);
    res.json({ success: true, message: 'Login successful', user: student });
  } catch (error) {
    console.error('❌ [Student Login] Error occurred:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---- ADMIN AUTH ----
router.post('/admin/register', async (req, res) => {
  try {
    const { fullName, adminUsername, email, phone, password } = req.body;
    
    if (!fullName || !adminUsername || !email || !password) {
      console.warn(`⚠️ [Admin Register] Missing required fields for admin: "${adminUsername || 'unknown'}"`);
      return res.status(400).json({ success: false, message: 'Missing required admin fields' });
    }

    const existing = await Admin.findOne({
      $or: [{ email: email.trim().toLowerCase() }, { adminUsername: adminUsername.trim() }],
    });
    if (existing) {
      console.warn(`⚠️ [Admin Register] Admin already exists: "${email}" or "${adminUsername}"`);
      return res.status(400).json({ success: false, message: 'Admin with this email or username already exists' });
    }

    const admin = new Admin({
      fullName: fullName.trim(),
      adminUsername: adminUsername.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      password,
    });
    await admin.save();
    
    console.log(`✅ [Admin Register] Admin registered successfully: ${admin.fullName} (${admin.adminUsername})`);
    res.status(201).json({ success: true, message: 'Admin registration successful', user: admin });
  } catch (error) {
    console.error('❌ [Admin Register] Error occurred:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Username/Email and password are required' });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const admin = await Admin.findOne({
      $or: [{ email: cleanIdentifier }, { adminUsername: identifier.trim() }],
      password,
    });

    if (!admin) {
      console.warn(`⚠️ [Admin Login] Invalid credentials for identifier: "${identifier}"`);
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    console.log(`✅ [Admin Login] Admin login successful: ${admin.fullName} (${admin.adminUsername})`);
    res.json({ success: true, message: 'Admin login successful', user: admin });
  } catch (error) {
    console.error('❌ [Admin Login] Error occurred:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
