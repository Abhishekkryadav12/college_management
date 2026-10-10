import React from 'react';
import { ComplaintStatus } from '../../types';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const configs = {
    Pending: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      dot: 'bg-amber-500',
      icon: <Clock className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />,
      label: 'Pending',
    },
    'In Progress': {
      bg: 'bg-blue-50 text-blue-800 border-blue-200/80',
      dot: 'bg-blue-600 animate-pulse',
      icon: <AlertCircle className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />,
      label: 'In Progress',
    },
    Resolved: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-500',
      icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />,
      label: 'Resolved',
    },
  };

  const config = configs[status] || configs.Pending;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  return (
    <span
      id={`badge-status-${status.toLowerCase().replace(/\s+/g, '-')}`}
      className={`inline-flex items-center rounded-full border shadow-xs transition-colors whitespace-nowrap ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
