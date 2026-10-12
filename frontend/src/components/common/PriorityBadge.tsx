import React from 'react';
import { Priority } from '../../types';
import { Flame, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md', showIcon = true }) => {
  const configs = {
    Low: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: <ArrowDown className="w-3 h-3 text-slate-500" />,
      label: 'Low',
    },
    Medium: {
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      icon: <ArrowUp className="w-3 h-3 text-sky-600" />,
      label: 'Medium',
    },
    High: {
      bg: 'bg-orange-50 text-orange-800 border-orange-200',
      icon: <AlertTriangle className="w-3 h-3 text-orange-600" />,
      label: 'High',
    },
    Urgent: {
      bg: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]',
      icon: <Flame className="w-3 h-3 text-[#B91C1C]" />,
      label: 'Urgent',
    },
  };

  const config = configs[priority] || configs.Medium;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-0.5 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1 text-sm font-semibold gap-2',
  };

  return (
    <span
      id={`badge-priority-${priority.toLowerCase()}`}
      className={`inline-flex items-center rounded-md border whitespace-nowrap shadow-xs ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
