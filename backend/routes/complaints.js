import express from 'express';
import { Complaint } from '../models/Complaint.js';

const router = express.Router();

// Get all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create complaint
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const complaint = new Complaint({
      ...data,
      timeline: [{
        status: 'Pending',
        timestamp: new Date(),
        note: 'Complaint submitted.',
        updatedBy: data.studentName || 'System'
      }]
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update complaint status
router.put('/:id', async (req, res) => {
  try {
    const { status, adminRemarks, resolutionNote, officerName } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Not found' });

    complaint.status = status;
    if (adminRemarks !== undefined) complaint.adminRemarks = adminRemarks;
    if (resolutionNote !== undefined) complaint.resolutionNote = resolutionNote;
    if (status === 'Resolved') complaint.resolvedAt = new Date();
    if (officerName) complaint.assignedDepartmentOfficer = officerName;

    complaint.timeline.push({
      status,
      timestamp: new Date(),
      note: resolutionNote || adminRemarks || `Status updated to ${status}`,
      updatedBy: officerName || 'Admin'
    });

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
