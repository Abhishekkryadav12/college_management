import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String },
  updatedBy: { type: String }
});

const complaintSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  department: { type: String, required: true },
  yearSemester: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  priority: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  imageName: { type: String },
  status: { type: String, default: 'Pending' },
  adminRemarks: { type: String, default: '' },
  timeline: [timelineSchema],
  resolvedAt: { type: Date },
  resolutionNote: { type: String },
  assignedDepartmentOfficer: { type: String }
}, {
  timestamps: true
});

export const Complaint = mongoose.model('Complaint', complaintSchema);
