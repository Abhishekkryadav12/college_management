import React from 'react';
import { ComplaintStatus } from '../../types';
import { Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const configs: Record<
    string,
    { bg: string; text: string; border: string; icon: React.ReactNode; label: string }
  > = {
    Pending: {
      bg: '#FEF3C7',
      text: '#B45309',
      border: '#FDE68A',
      icon: <Clock className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />,
      label: 'Pending',
    },
    'In Progress': {
      bg: '#DBEAFE',
      text: '#1D4ED8',
      border: '#BFDBFE',
      icon: <AlertCircle className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />,
      label: 'In Progress',
    },
    Resolved: {
      bg: '#DCFCE7',
      text: '#15803D',
      border: '#BBF7D0',
      icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />,
      label: 'Resolved',
    },
    Rejected: {
      bg: '#FEE2E2',
      text: '#B91C1C',
      border: '#FECACA',
      icon: <XCircle className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />,
      label: 'Rejected',
    },
  };

  const config = configs[status] || configs.Pending;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  const safeStatus = (status || 'pending').toLowerCase().replace(/\s+/g, '-');

  return (
    <span
      id={`badge-status-${safeStatus}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
      }}
      className={`inline-flex items-center rounded-full border shadow-xs transition-colors whitespace-nowrap ${sizeClasses[size]}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
