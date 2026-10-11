import express from 'express';
import mongoose from 'mongoose';
import { Complaint } from '../models/Complaint.js';

const router = express.Router();

// Helper to format complaint for frontend
const formatComplaint = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    id: obj.complaintId || (obj._id ? obj._id.toString() : ''),
  };
};

// GET /api/complaints - Get complaints (optionally filtered by studentId)
router.get('/', async (req, res) => {
  try {
    const { studentId } = req.query;
    const filter = studentId
      ? { studentId: new RegExp(`^${studentId.trim()}$`, 'i') }
      : {};

    const rawComplaints = await Complaint.find(filter).sort({ createdAt: -1 });
    const complaints = rawComplaints.map(formatComplaint);

    console.log(
      `📋 [Get Complaints] Returning ${complaints.length} complaints (${studentId ? `student: ${studentId}` : 'admin: all'})`
    );
    res.json(complaints);
  } catch (error) {
    console.error('❌ [Get Complaints] Error fetching complaints:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/complaints/:id - Get single complaint by ObjectId or complaintId
router.get('/:id', async (req, res) => {
  try {
    const targetId = req.params.id;
    const query = mongoose.Types.ObjectId.isValid(targetId)
      ? { $or: [{ _id: targetId }, { complaintId: targetId }] }
      : { complaintId: targetId };

    const complaint = await Complaint.findOne(query);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(formatComplaint(complaint));
  } catch (error) {
    console.error('❌ [Get Single Complaint] Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/complaints - Create new complaint
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    if (!data.title || !data.category || !data.location || !data.description || !data.studentId) {
      console.warn('⚠️ [Create Complaint] Missing required fields:', {
        title: !!data.title,
        category: !!data.category,
        location: !!data.location,
        description: !!data.description,
        studentId: !!data.studentId,
      });
      return res.status(400).json({ message: 'Missing required complaint fields' });
    }

    const generatedId =
      data.complaintId ||
      data.id ||
      `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const initialTimeline =
      Array.isArray(data.timeline) && data.timeline.length > 0
        ? data.timeline
        : [
            {
              status: 'Pending',
              timestamp: new Date(),
              note: 'Complaint submitted by student. Pending review by campus administration.',
              updatedBy: data.studentName || 'Student',
            },
          ];

    const complaint = new Complaint({
      complaintId: generatedId,
      studentId: data.studentId.trim(),
      studentName: data.studentName ? data.studentName.trim() : 'Student',
      studentEmail: data.studentEmail ? data.studentEmail.trim().toLowerCase() : '',
      department: data.department || 'General',
      yearSemester: data.yearSemester || 'N/A',
      title: data.title.trim(),
      category: data.category,
      location: data.location.trim(),
      priority: data.priority || 'Medium',
      description: data.description.trim(),
      imageUrl: data.imageUrl,
      imageName: data.imageName,
      status: 'Pending',
      adminRemarks: '',
      timeline: initialTimeline,
    });

    await complaint.save();
    console.log(
      `✅ [Create Complaint] Saved to MongoDB: ID ${complaint.complaintId} by student ${complaint.studentId}`
    );
    res.status(201).json(formatComplaint(complaint));
  } catch (error) {
    console.error('❌ [Create Complaint] Database save failed:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/complaints/:id - Update complaint status / resolution
router.put('/:id', async (req, res) => {
  try {
    const targetId = req.params.id;
    const { status, adminRemarks, resolutionNote, officerName } = req.body;

    const query = mongoose.Types.ObjectId.isValid(targetId)
      ? { $or: [{ _id: targetId }, { complaintId: targetId }] }
      : { complaintId: targetId };

    const complaint = await Complaint.findOne(query);
    if (!complaint) {
      console.warn(`⚠️ [Update Complaint] Complaint not found: ${targetId}`);
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (status) complaint.status = status;
    if (adminRemarks !== undefined) complaint.adminRemarks = adminRemarks;
    if (resolutionNote !== undefined) complaint.resolutionNote = resolutionNote;
    if (status === 'Resolved') complaint.resolvedAt = new Date();
    if (officerName) complaint.assignedDepartmentOfficer = officerName;

    const timelineNote =
      status === 'Resolved'
        ? resolutionNote || adminRemarks || 'Issue verified and marked resolved by administration.'
        : adminRemarks || `Status updated to ${status}.`;

    complaint.timeline.push({
      status: status || complaint.status,
      timestamp: new Date(),
      note: timelineNote,
      updatedBy: officerName || 'Admin Officer',
    });

    await complaint.save();
    console.log(
      `✅ [Update Complaint] Updated ID ${complaint.complaintId || complaint._id} status to ${complaint.status}`
    );
    res.json(formatComplaint(complaint));
  } catch (error) {
    console.error('❌ [Update Complaint] Update failed:', error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
