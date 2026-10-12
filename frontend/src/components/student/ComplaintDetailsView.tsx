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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#173B67] transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
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
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Header Ribbon */}
        <div className="p-6 sm:p-7 bg-[#173B67] text-white">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-bold text-white bg-white/15 px-3 py-1 rounded-lg border border-white/20">
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

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 mt-4 pt-4 border-t border-white/15">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-200" />
              {complaint.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-200" />
              Submitted: {formatDate(complaint.createdAt)}
            </span>
            {complaint.resolvedAt && (
              <span className="flex items-center gap-1.5 text-[#DCFCE7] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#DCFCE7]" />
                Resolved: {formatDate(complaint.resolvedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Visual Status Progress Flow */}
          <div className="bg-[#F4F7FB] p-5 rounded-xl border border-slate-200">
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
              <MessageSquare className="w-4 h-4 text-[#173B67]" />
              Complaint Statement
            </h3>
            <div className="p-4 bg-[#F4F7FB] rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {complaint.description}
            </div>
          </div>

          {/* Supporting Evidence Image if any */}
          {complaint.imageUrl && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#173B67]" />
                Attached Photographic Evidence
              </h3>
              <div className="p-3 bg-[#F4F7FB] rounded-xl border border-slate-200 inline-block">
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
            <div className="p-5 rounded-xl border bg-[#F4F7FB] border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#173B67]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B67]">
                  Administrative Remarks
                </h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {complaint.adminRemarks || 'Ticket is queued. Administrative review remarks will appear here.'}
              </p>
              {complaint.assignedDepartmentOfficer && (
                <p className="text-[11px] text-[#173B67] font-semibold pt-1 border-t border-slate-200">
                  Assigned Unit: {complaint.assignedDepartmentOfficer}
                </p>
              )}
            </div>

            {/* Resolution Certificate Note */}
            <div
              className={`p-5 rounded-xl border space-y-2 ${
                complaint.status === 'Resolved'
                  ? 'bg-[#DCFCE7] border-[#BBF7D0] text-[#15803D]'
                  : complaint.status === 'Rejected'
                  ? 'bg-[#FEE2E2] border-[#FECACA] text-[#B91C1C]'
                  : 'bg-[#F4F7FB] border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileCheck
                  className={`w-4 h-4 ${
                    complaint.status === 'Resolved'
                      ? 'text-[#15803D]'
                      : complaint.status === 'Rejected'
                      ? 'text-[#B91C1C]'
                      : 'text-slate-400'
                  }`}
                />
                <h4
                  className={`text-xs font-bold uppercase tracking-wider ${
                    complaint.status === 'Resolved'
                      ? 'text-[#15803D]'
                      : complaint.status === 'Rejected'
                      ? 'text-[#B91C1C]'
                      : 'text-slate-500'
                  }`}
                >
                  {complaint.status === 'Rejected' ? 'Rejection Notice' : 'Resolution Note'}
                </h4>
              </div>
              <p className="text-xs leading-relaxed">
                {complaint.resolutionNote ||
                  (complaint.status === 'Resolved'
                    ? 'Maintenance activity verified and ticket successfully closed.'
                    : complaint.status === 'Rejected'
                    ? 'This ticket was closed as Rejected following administrative review.'
                    : 'Resolution details and technician notes will be posted upon completion.')}
              </p>
              {complaint.resolvedAt && (
                <p className="text-[11px] font-semibold pt-1 border-t border-current/20">
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
