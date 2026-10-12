import React from 'react';

interface StatCardProps {
  id?: string;
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'blue' | 'amber' | 'emerald' | 'rose' | 'purple' | 'slate';
  onClick?: () => void;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  onClick,
  trend,
}) => {
  const colorStyles = {
    blue: {
      borderHover: 'hover:border-blue-300',
      iconBg: 'bg-[#DBEAFE] text-[#1D4ED8]',
      accent: 'text-[#1D4ED8]',
    },
    amber: {
      borderHover: 'hover:border-amber-300',
      iconBg: 'bg-[#FEF3C7] text-[#B45309]',
      accent: 'text-[#B45309]',
    },
    emerald: {
      borderHover: 'hover:border-emerald-300',
      iconBg: 'bg-[#DCFCE7] text-[#15803D]',
      accent: 'text-[#15803D]',
    },
    rose: {
      borderHover: 'hover:border-rose-300',
      iconBg: 'bg-[#FEE2E2] text-[#B91C1C]',
      accent: 'text-[#B91C1C]',
    },
    purple: {
      borderHover: 'hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-700',
      accent: 'text-purple-700',
    },
    slate: {
      borderHover: 'hover:border-slate-400',
      iconBg: 'bg-[#F4F7FB] text-[#173B67]',
      accent: 'text-[#173B67]',
    },
  };

  const style = colorStyles[color];

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative overflow-hidden bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs transition-all ${
        style.borderHover
      } ${onClick ? 'cursor-pointer hover:shadow-sm' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight font-heading text-slate-900">
            {value}
          </h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
          {trend && (
            <p className="text-[11px] text-slate-500 mt-2 font-medium flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#173B67]" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${style.iconBg} shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
