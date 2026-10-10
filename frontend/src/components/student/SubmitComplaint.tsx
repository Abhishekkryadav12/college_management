import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ComplaintCategory, Priority } from '../../types';
import { CATEGORIES, PRIORITIES, addComplaint } from '../../services/storageService';
import {
  Building2,
  Zap,
  Droplets,
  Utensils,
  School,
  GraduationCap,
  HelpCircle,
  Upload,
  Image as ImageIcon,
  X,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  FileText,
  Flame,
} from 'lucide-react';

interface SubmitComplaintProps {
  onNavigate: (view: string) => void;
  onComplaintSubmitted?: (complaintId: string) => void;
}

export const SubmitComplaint: React.FC<SubmitComplaintProps> = ({ onNavigate, onComplaintSubmitted }) => {
  const { studentUser } = useAuth();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Hostel');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [description, setDescription] = useState('');

  // Image Upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      error('Invalid File', 'Please select an image file (PNG, JPG, JPEG, WebP).');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      error('File Too Large', 'Maximum image size is 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageName(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentUser) {
      error('Session Expired', 'Please sign in to submit a complaint.');
      return;
    }

    if (!title.trim()) {
      error('Required Field', 'Please enter a descriptive complaint title.');
      return;
    }

    if (!location.trim()) {
      error('Required Field', 'Please specify the exact campus/hostel location.');
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      error('More Details Required', 'Please describe the issue in at least 10 characters.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      try {
        const newTicket = addComplaint({
          title,
          category,
          location,
          priority,
          description,
          imageUrl: imagePreview || undefined,
          imageName: imageName || undefined,
          student: studentUser,
        });

        setSubmitting(false);
        success('Complaint Submitted Successfully!', `Ticket ID: ${newTicket.id} registered under status: Pending.`);

        if (onComplaintSubmitted) {
          onComplaintSubmitted(newTicket.id);
        }
        onNavigate('my-complaints');
      } catch (err) {
        setSubmitting(false);
        error('Submission Failed', 'Could not save complaint. Please try again.');
      }
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header & Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            id="btn-back-to-dash"
            onClick={() => onNavigate('student-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Submit a Campus Grievance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Provide comprehensive details to help the maintenance and administrative teams resolve your issue quickly.
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Submitter Summary Banner */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-900">Reporting Student:</span>
              <span className="text-blue-800">{studentUser?.fullName}</span>
              <span className="text-blue-500">•</span>
              <span className="font-mono text-blue-800">{studentUser?.studentId}</span>
            </div>
            <span className="text-blue-700 font-medium">{studentUser?.department}</span>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Complaint Title / Subject <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-complaint-title"
              type="text"
              required
              placeholder="e.g. Ceiling fan not working / Water leakage in 2nd floor restroom"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Complaint Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.label;
                const icons: Record<string, React.ReactNode> = {
                  Hostel: <Building2 className="w-4 h-4" />,
                  Electricity: <Zap className="w-4 h-4" />,
                  Water: <Droplets className="w-4 h-4" />,
                  Mess: <Utensils className="w-4 h-4" />,
                  Classroom: <School className="w-4 h-4" />,
                  'Faculty-related Issues': <GraduationCap className="w-4 h-4" />,
                  Other: <HelpCircle className="w-4 h-4" />,
                };

                return (
                  <button
                    key={cat.label}
                    type="button"
                    id={`btn-category-${cat.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setCategory(cat.label)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={isSelected ? 'text-blue-600' : 'text-slate-500'}>
                        {icons[cat.label]}
                      </div>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <span className="text-xs font-bold mt-1 leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Exact Location / Room Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="input-complaint-location"
                  type="text"
                  required
                  placeholder="e.g. Hostel Block C - Room 304 / Lab 3"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Specify hostel wing, floor, room number, or lab name.</p>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Priority Level <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {PRIORITIES.map((p) => {
                  const isSelected = priority === p.label;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      id={`btn-priority-${p.label.toLowerCase()}`}
                      onClick={() => setPriority(p.label)}
                      className={`py-2 px-1 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? p.label === 'Urgent'
                            ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20'
                            : p.label === 'High'
                            ? 'bg-orange-50 border-orange-500 text-orange-800 ring-2 ring-orange-500/20'
                            : p.label === 'Medium'
                            ? 'bg-sky-50 border-sky-500 text-sky-800 ring-2 ring-sky-500/20'
                            : 'bg-slate-100 border-slate-500 text-slate-800 ring-2 ring-slate-400/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {PRIORITIES.find((p) => p.label === priority)?.desc}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="input-complaint-description"
              rows={4}
              required
              placeholder="Explain the problem clearly, when it started, and how it impacts you..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Optional Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Attach Supporting Photo (Optional)
            </label>

            {!imagePreview ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="p-3 rounded-full bg-blue-50 text-blue-600 mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Drag and drop an image, or{' '}
                    <label
                      htmlFor="image-file-input"
                      className="text-blue-600 hover:underline cursor-pointer font-bold"
                    >
                      browse files
                    </label>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, JPEG up to 4MB</p>
                  <input
                    id="image-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="relative p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800 truncate max-w-xs">{imageName || 'Attached image'}</p>
                    <p className="text-[11px] text-emerald-600 font-medium">Ready to upload</p>
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-remove-attached-image"
                  onClick={removeImage}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              id="btn-cancel-submit"
              onClick={() => onNavigate('student-dashboard')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-submit-complaint-final"
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Submitting Grievance...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
