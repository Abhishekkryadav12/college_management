import React from 'react';
import { ComplaintCategory } from '../../types';
import { Building2, Zap, Droplets, Utensils, School, GraduationCap, HelpCircle } from 'lucide-react';

interface CategoryBadgeProps {
  category: ComplaintCategory;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm' }) => {
  const getIcon = (cat: ComplaintCategory) => {
    switch (cat) {
      case 'Hostel':
        return <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
      case 'Electricity':
        return <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case 'Water':
        return <Droplets className="w-3.5 h-3.5 text-cyan-600 shrink-0" />;
      case 'Mess':
        return <Utensils className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'Classroom':
        return <School className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case 'Faculty-related Issues':
        return <GraduationCap className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" />;
    }
  };

  const getStyle = (cat: ComplaintCategory) => {
    switch (cat) {
      case 'Hostel':
        return 'bg-indigo-50 text-indigo-900 border-indigo-200/80';
      case 'Electricity':
        return 'bg-amber-50 text-amber-900 border-amber-200/80';
      case 'Water':
        return 'bg-cyan-50 text-cyan-900 border-cyan-200/80';
      case 'Mess':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200/80';
      case 'Classroom':
        return 'bg-blue-50 text-blue-900 border-blue-200/80';
      case 'Faculty-related Issues':
        return 'bg-purple-50 text-purple-900 border-purple-200/80';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200/80';
    }
  };

  return (
    <span
      id={`badge-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium whitespace-nowrap ${getStyle(category)} ${
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      }`}
    >
      {getIcon(category)}
      <span>{category}</span>
    </span>
  );
};
