import React, { useState } from 'react';
import { Complaint } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { Timeline } from '../common/Timeline';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Building,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  ShieldCheck,
  MessageSquare,
  FileCheck,
  ImageIcon,
} from 'lucide-react';

interface ComplaintDetailsViewProps {
  complaint: Complaint;
  onBack: () => void;
}

export const ComplaintDetailsView: React.FC<ComplaintDetailsViewProps> = ({ complaint, onBack }) => {
  const [showImageFull, setShowImageFull] = useState(false);

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Bar with Back Button & Print */}
      <div className="flex items-center justify-between gap-4">
        <button
          id="btn-back-from-details"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-print-complaint"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Ticket Receipt
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Header Ribbon */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-bold text-blue-300 bg-blue-900/60 px-3 py-1 rounded-lg border border-blue-700/60">
                {complaint.id}
              </span>
              <StatusBadge status={complaint.status} size="lg" />
            </div>

            <div className="flex items-center gap-2">
              <CategoryBadge category={complaint.category} size="md" />
              <PriorityBadge priority={complaint.priority} size="lg" />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-white mt-3 leading-tight">
            {complaint.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-4 pt-4 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              {complaint.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" />
              Submitted: {formatDate(complaint.createdAt)}
            </span>
            {complaint.resolvedAt && (
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Resolved: {formatDate(complaint.resolvedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Visual Status Progress Flow */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Grievance Progress Life-Cycle
            </h3>
            <Timeline
              status={complaint.status}
              createdAt={complaint.createdAt}
              updatedAt={complaint.updatedAt}
              resolvedAt={complaint.resolvedAt}
              timelineEvents={complaint.timeline}
            />
          </div>

          {/* Grievance Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Complaint Statement
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {complaint.description}
            </div>
          </div>

          {/* Supporting Evidence Image if any */}
          {complaint.imageUrl && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                Attached Photographic Evidence
              </h3>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
                <img
                  src={complaint.imageUrl}
                  alt={complaint.imageName || 'Attached Evidence'}
                  onClick={() => setShowImageFull(true)}
                  className="max-h-64 rounded-xl border border-slate-200 cursor-pointer hover:opacity-95 transition-opacity"
                />
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  {complaint.imageName || 'Attachment preview'} (Click to expand)
                </p>
              </div>
            </div>
          )}

          {/* Administrative Remarks & Resolution Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Admin Remarks */}
            <div className="p-5 rounded-2xl border bg-blue-50/50 border-blue-100 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Administrative Remarks
                </h4>
              </div>
              <p className="text-xs text-blue-950 leading-relaxed font-normal">
                {complaint.adminRemarks || 'Ticket is queued. Administrative review remarks will appear here.'}
              </p>
              {complaint.assignedDepartmentOfficer && (
                <p className="text-[11px] text-blue-700 font-semibold pt-1 border-t border-blue-200/60">
                  Assigned Unit: {complaint.assignedDepartmentOfficer}
                </p>
              )}
            </div>

            {/* Resolution Certificate Note */}
            <div
              className={`p-5 rounded-2xl border space-y-2 ${
                complaint.status === 'Resolved'
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileCheck
                  className={`w-4 h-4 ${
                    complaint.status === 'Resolved' ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                />
                <h4
                  className={`text-xs font-bold uppercase tracking-wider ${
                    complaint.status === 'Resolved' ? 'text-emerald-900' : 'text-slate-500'
                  }`}
                >
                  Resolution Note
                </h4>
              </div>
              <p className="text-xs leading-relaxed">
                {complaint.resolutionNote ||
                  (complaint.status === 'Resolved'
                    ? 'Maintenance activity verified and ticket successfully closed.'
                    : 'Resolution details and technician notes will be posted upon completion.')}
              </p>
              {complaint.resolvedAt && (
                <p className="text-[11px] text-emerald-700 font-semibold pt-1 border-t border-emerald-200/60">
                  Closed on: {formatDate(complaint.resolvedAt)}
                </p>
              )}
            </div>
          </div>

          {/* Student Submitter Metadata */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Student: {complaint.studentName}</span>
              <span>•</span>
              <span className="font-mono">{complaint.studentId}</span>
            </div>
            <div>
              <span>{complaint.department}</span>
              <span className="mx-1">•</span>
              <span>{complaint.yearSemester}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox for Image */}
      {showImageFull && complaint.imageUrl && (
        <div
          onClick={() => setShowImageFull(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={complaint.imageUrl}
            alt="Full view"
            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
};
