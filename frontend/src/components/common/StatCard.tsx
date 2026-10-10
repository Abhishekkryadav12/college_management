import React from 'react';
import { motion } from 'motion/react';

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
      bg: 'from-blue-50/70 to-indigo-50/30 border-blue-100/80 hover:border-blue-300',
      iconBg: 'bg-blue-600 text-white shadow-blue-200',
      value: 'text-blue-950',
    },
    amber: {
      bg: 'from-amber-50/70 to-orange-50/30 border-amber-100/80 hover:border-amber-300',
      iconBg: 'bg-amber-500 text-white shadow-amber-200',
      value: 'text-amber-950',
    },
    emerald: {
      bg: 'from-emerald-50/70 to-teal-50/30 border-emerald-100/80 hover:border-emerald-300',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-200',
      value: 'text-emerald-950',
    },
    rose: {
      bg: 'from-rose-50/70 to-red-50/30 border-rose-100/80 hover:border-rose-300',
      iconBg: 'bg-rose-600 text-white shadow-rose-200',
      value: 'text-rose-950',
    },
    purple: {
      bg: 'from-purple-50/70 to-violet-50/30 border-purple-100/80 hover:border-purple-300',
      iconBg: 'bg-purple-600 text-white shadow-purple-200',
      value: 'text-purple-950',
    },
    slate: {
      bg: 'from-slate-50 to-slate-100/40 border-slate-200/80 hover:border-slate-300',
      iconBg: 'bg-slate-700 text-white shadow-slate-200',
      value: 'text-slate-900',
    },
  };

  const style = colorStyles[color];

  return (
    <motion.div
      id={id}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={onClick}
      className={`relative overflow-hidden bg-gradient-to-br ${style.bg} p-5 rounded-2xl border shadow-xs transition-all ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{title}</p>
          <h3 className={`text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight font-heading ${style.value}`}>
            {value}
          </h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
          {trend && (
            <p className="text-[11px] text-slate-500 mt-2 font-medium flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl shadow-md ${style.iconBg} shrink-0`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};
