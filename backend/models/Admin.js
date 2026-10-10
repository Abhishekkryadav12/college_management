import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  adminUsername: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, {
  timestamps: true
});

export const Admin = mongoose.model('Admin', adminSchema);
