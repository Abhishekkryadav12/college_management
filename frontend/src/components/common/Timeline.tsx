import React from 'react';
import { ComplaintStatus, TimelineEvent } from '../../types';
import { Check, Clock, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface TimelineProps {
  status: ComplaintStatus;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  timelineEvents?: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({
  status,
  createdAt,
  updatedAt,
  resolvedAt,
  timelineEvents = [],
}) => {
  const stages: { key: string; label: string; description: string; stepNumber: number }[] = [
    { key: 'Submitted', label: 'Submitted', description: 'Grievance ticket created', stepNumber: 1 },
    { key: 'Pending', label: 'Pending Review', description: 'Admin verification queue', stepNumber: 2 },
    { key: 'In Progress', label: 'In Progress', description: 'Assigned to maintenance team', stepNumber: 3 },
    { key: 'Resolved', label: 'Resolved', description: 'Completed & closed', stepNumber: 4 },
  ];

  const getStageIndex = (currStatus: ComplaintStatus) => {
    switch (currStatus) {
      case 'Pending':
        return 1; // Submitted (0) completed, Pending (1) is active
      case 'In Progress':
        return 2; // Submitted & Pending completed, In Progress (2) is active
      case 'Resolved':
        return 3; // All stages completed
      default:
        return 0;
    }
  };

  const activeIndex = getStageIndex(status);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
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
    <div className="w-full">
      {/* Horizontal Progress Bar for Desktop / Tablet */}
      <div className="relative py-4">
        <div className="grid grid-cols-4 gap-2 relative">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-1/8 right-1/8 h-1 bg-slate-200 -z-0" />
          {/* Active Colored Line */}
          <div
            className="absolute top-5 left-1/8 h-1 bg-[#173B67] transition-all duration-300 -z-0"
            style={{
              width:
                status === 'Rejected'
                  ? '0%'
                  : activeIndex === 0
                  ? '0%'
                  : activeIndex === 1
                  ? '33%'
                  : activeIndex === 2
                  ? '66%'
                  : '75%',
            }}
          />

          {stages.map((stage, idx) => {
            const isCompleted = status !== 'Rejected' && (idx < activeIndex || (idx === 3 && status === 'Resolved'));
            const isCurrent = status !== 'Rejected' && idx === activeIndex && !(idx === 3 && status === 'Resolved');

            let circleBg = 'bg-white border-2 border-slate-300 text-slate-400';
            if (isCompleted) {
              circleBg = 'bg-[#15803D] border-2 border-[#15803D] text-white shadow-xs';
            } else if (isCurrent) {
              if (stage.key === 'Pending') {
                circleBg = 'bg-[#B45309] border-2 border-[#FEF3C7] text-white shadow-xs';
              } else if (stage.key === 'In Progress') {
                circleBg = 'bg-[#1D4ED8] border-2 border-[#DBEAFE] text-white shadow-xs';
              } else {
                circleBg = 'bg-[#15803D] border-2 border-[#DCFCE7] text-white shadow-xs';
              }
            }

            return (
              <div key={stage.key} className="flex flex-col items-center text-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-200 ${circleBg}`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : isCurrent ? (
                    stage.key === 'Pending' ? (
                      <Clock className="w-4 h-4" />
                    ) : stage.key === 'In Progress' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )
                  ) : (
                    <span>{stage.stepNumber}</span>
                  )}
                </div>
                <div className="mt-2.5">
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-[#173B67]'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                    {idx === 0
                      ? formatDate(createdAt)
                      : idx === 3 && status === 'Resolved'
                      ? formatDate(resolvedAt || updatedAt)
                      : stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {status === 'Rejected' && (
          <div className="mt-4 p-3 rounded-xl bg-[#FEE2E2] border border-[#FECACA] flex items-center gap-2.5 text-xs text-[#B91C1C]">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#B91C1C]" />
            <span className="font-semibold">This grievance has been reviewed and closed as Rejected.</span>
          </div>
        )}
      </div>

      {/* Detailed Activity Log List */}
      {timelineEvents.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Audit & Status Updates Log
          </h4>
          <div className="space-y-3">
            {timelineEvents.map((evt, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-xs bg-slate-50/80 p-3 rounded-lg border border-slate-100"
              >
                <div className="w-2 h-2 rounded-full bg-[#173B67] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800">
                      {evt.status === 'Resolved'
                        ? 'Complaint Marked as Resolved'
                        : evt.status === 'Rejected'
                        ? 'Complaint Marked as Rejected'
                        : evt.status === 'In Progress'
                        ? 'Investigating / Work Order Dispatched'
                        : 'Ticket Registered'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{formatDate(evt.timestamp)}</span>
                  </div>
                  {evt.note && <p className="text-slate-600 mt-1 leading-relaxed">{evt.note}</p>}
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">Logged by: {evt.updatedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
