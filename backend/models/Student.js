import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  yearSemester: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: 'student' }
}, {
  timestamps: true
});

export const Student = mongoose.model('Student', studentSchema);
