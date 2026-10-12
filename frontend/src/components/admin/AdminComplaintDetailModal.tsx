import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintStatus } from '../../types';
import { updateComplaintStatus } from '../../services/storageService';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { Timeline } from '../common/Timeline';
import { useToast } from '../../context/ToastContext';
import { triggerSuccessCelebration } from '../../utils/celebration';
import {
  User,
  Mail,
  Building,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  ImageIcon,
  FileCheck,
  Send,
  Phone,
  Maximize2,
} from 'lucide-react';

interface AdminComplaintDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  onUpdated: () => void;
}

export const AdminComplaintDetailModal: React.FC<AdminComplaintDetailModalProps> = ({
  isOpen,
  onClose,
  complaint,
  onUpdated,
}) => {
  const { success, error } = useToast();

  const [status, setStatus] = useState<ComplaintStatus>('Pending');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [assignedUnit, setAssignedUnit] = useState('');
  const [saving, setSaving] = useState(false);
  const [showImageFull, setShowImageFull] = useState(false);

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status);
      setAdminRemarks(complaint.adminRemarks || '');
      setResolutionNote(complaint.resolutionNote || '');
      setAssignedUnit(complaint.assignedDepartmentOfficer || '');
    }
  }, [complaint]);

  if (!complaint) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updated = await updateComplaintStatus(
        complaint.id,
        status,
        adminRemarks.trim(),
        status === 'Resolved' ? resolutionNote.trim() : undefined,
        assignedUnit.trim()
      );

      setSaving(false);

      if (updated) {
        if (status === 'Resolved' && complaint.status !== 'Resolved') {
          triggerSuccessCelebration();
          success('Complaint Resolved!', `Ticket ${complaint.id} closed and marked as Resolved.`);
        } else {
          success('Status Updated', `Ticket ${complaint.id} set to ${status}.`);
        }
        onUpdated();
        onClose();
      }
    } catch (err: any) {
      setSaving(false);
      console.error('Update status error:', err);
      error('Update Failed', err.message || 'Could not update complaint record on server.');
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Ticket ${complaint.id}`}
      subtitle="Review grievance evidence, assign maintenance technicians, and update status."
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Student & Ticket Quick Ribbon */}
        <div className="p-4 bg-[#173B67] text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-white bg-white/15 px-2 py-0.5 rounded border border-white/20">
                {complaint.id}
              </span>
              <StatusBadge status={complaint.status} size="sm" />
              <PriorityBadge priority={complaint.priority} size="sm" />
              <CategoryBadge category={complaint.category} size="sm" />
            </div>
            <h3 className="text-base font-bold text-white pt-1">{complaint.title}</h3>
          </div>

          <div className="text-xs text-slate-200 text-left sm:text-right shrink-0">
            <p className="font-semibold text-white">{complaint.studentName}</p>
            <p className="font-mono text-slate-300">{complaint.studentId}</p>
            <p className="text-[11px] text-slate-300">{complaint.department}</p>
          </div>
        </div>

        {/* Status Lifecycle Timeline */}
        <div className="bg-[#F4F7FB] p-4 rounded-xl border border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Current Resolution Stage
          </h4>
          <Timeline
            status={complaint.status}
            createdAt={complaint.createdAt}
            updatedAt={complaint.updatedAt}
            resolvedAt={complaint.resolvedAt}
            timelineEvents={complaint.timeline}
          />
        </div>

        {/* Complete Student Profile Information */}
        <div className="p-4 bg-[#F4F7FB] rounded-xl border border-slate-200 text-xs">
          <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-1.5 text-xs">
            <User className="w-3.5 h-3.5 text-[#173B67]" />
            Student Submitter Details
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-slate-400 block text-[11px]">Full Name</span>
              <span className="font-bold text-slate-800">{complaint.studentName || 'Student'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Roll Number / ID</span>
              <span className="font-mono font-bold text-slate-800">{complaint.studentId || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Department</span>
              <span className="font-semibold text-slate-800">{complaint.department || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Year / Semester</span>
              <span className="text-slate-700">{complaint.yearSemester || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">College Email</span>
              <a href={`mailto:${complaint.studentEmail}`} className="text-[#173B67] hover:underline font-medium truncate block">
                {complaint.studentEmail || 'N/A'}
              </a>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Contact Phone</span>
              <span className="text-slate-700 font-mono">
                {complaint.studentPhone || 'Not provided'}
              </span>
            </div>
          </div>
        </div>

        {/* Complaint Location and Grievance Statement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#F4F7FB] rounded-xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#173B67]" />
              Exact Location & Submission Time
            </h4>
            <p className="text-slate-800 font-semibold">{complaint.location}</p>
            <p className="text-slate-500">Submitted: {formatDate(complaint.createdAt)}</p>
          </div>

          <div className="p-4 bg-[#F4F7FB] rounded-xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900">Grievance Statement</h4>
            <p className="text-slate-700 leading-relaxed max-h-28 overflow-y-auto whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>
        </div>

        {/* Attached Photo if available */}
        {complaint.imageUrl ? (
          <div className="p-4 bg-[#F4F7FB] rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#173B67]" />
                Attached Evidence Photo ({complaint.imageName || 'Complaint Photo'})
              </h4>
              <button
                type="button"
                onClick={() => setShowImageFull(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#173B67] hover:underline cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
                View Full Image
              </button>
            </div>
            <div className="relative group inline-block">
              <img
                src={complaint.imageUrl}
                alt="Evidence"
                onClick={() => setShowImageFull(true)}
                className="max-h-56 rounded-lg border border-slate-300 shadow-2xs cursor-pointer group-hover:opacity-95 transition-all"
              />
              <div
                onClick={() => setShowImageFull(true)}
                className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center text-white text-xs font-bold transition-opacity cursor-pointer gap-1.5"
              >
                <Maximize2 className="w-4 h-4" />
                Click to enlarge
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-slate-300" />
            <span>No supporting photo attached with this grievance.</span>
          </div>
        )}

        {/* Administrative Action Form */}
        <form
          onSubmit={handleUpdate}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-[#173B67]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Administrative Status Control
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Update Status <span className="text-rose-500">*</span>
              </label>
              <select
                id="admin-select-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67] cursor-pointer"
              >
                <option value="Pending">Pending Review</option>
                <option value="In Progress">In Progress (Work Order Dispatched)</option>
                <option value="Resolved">Resolved (Closed Ticket)</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Assigned Unit / Technician */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Maintenance Unit / Officer
              </label>
              <input
                id="admin-input-assigned-unit"
                type="text"
                placeholder="e.g. Electrical Maintenance / Hostel Warden"
                value={assignedUnit}
                onChange={(e) => setAssignedUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67]"
              />
            </div>
          </div>

          {/* Admin Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Remarks & Progress Updates
            </label>
            <textarea
              id="admin-input-remarks"
              rows={2}
              placeholder="e.g. Technician dispatched with replacement part. Estimated resolution by 4 PM."
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B67]"
            />
          </div>

          {/* Resolution Note (Show highlight if Resolved is picked) */}
          {status === 'Resolved' && (
            <div className="p-3 bg-[#DCFCE7] border border-[#BBF7D0] rounded-xl space-y-1">
              <label className="block text-xs font-bold text-[#15803D]">
                Final Resolution Summary / Verification Note <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="admin-input-resolution-note"
                rows={2}
                required
                placeholder="e.g. Capacitor replaced, tested and verified working in order."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-[#BBF7D0] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15803D]"
              />
            </div>
          )}

          {/* Rejected Note highlight if Rejected is picked */}
          {status === 'Rejected' && (
            <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-xl space-y-1">
              <label className="block text-xs font-bold text-[#B91C1C]">
                Rejection Reason (Will be visible to student)
              </label>
              <p className="text-[11px] text-[#B91C1C]">
                Please explain in Admin Remarks why this complaint is not actionable or outside campus maintenance scope.
              </p>
            </div>
          )}

          {/* Submit Update Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              id="btn-admin-cancel-modal"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-admin-submit-update"
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173B67] hover:bg-[#132f53] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Updating Record...' : 'Save & Update Complaint'}
            </button>
          </div>
        </form>
      </div>

      {/* Lightbox */}
      {showImageFull && complaint.imageUrl && (
        <div
          onClick={() => setShowImageFull(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 cursor-pointer"
        >
          <div className="w-full max-w-4xl flex items-center justify-between text-white pb-3 px-2 text-xs">
            <span className="font-bold flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              {complaint.imageName || 'Attached Evidence Photo'}
            </span>
            <span className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-white font-semibold transition-colors">
              Click anywhere or press Esc to close ✕
            </span>
          </div>
          <img
            src={complaint.imageUrl}
            alt="Full view"
            className="max-h-[82vh] max-w-full rounded-xl shadow-2xl object-contain border border-white/20"
          />
        </div>
      )}
    </Modal>
  );
};
