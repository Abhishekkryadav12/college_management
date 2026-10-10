import React from 'react';
import { Inbox, FileQuestion, SearchX, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  type?: 'no-complaints' | 'no-results' | 'no-data';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-complaints',
  title,
  description,
  actionText,
  onAction,
}) => {
  const defaults = {
    'no-complaints': {
      icon: <Inbox className="w-10 h-10 text-blue-500 stroke-[1.5]" />,
      title: 'No complaints logged yet',
      description: 'Everything is running smoothly! You have not registered any grievances so far.',
    },
    'no-results': {
      icon: <SearchX className="w-10 h-10 text-amber-500 stroke-[1.5]" />,
      title: 'No matching complaints found',
      description: 'Try adjusting your search query, status filters, or selected category.',
    },
    'no-data': {
      icon: <FileQuestion className="w-10 h-10 text-slate-400 stroke-[1.5]" />,
      title: 'No records available',
      description: 'There are currently no items to display in this view.',
    },
  };

  const current = defaults[type];

  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs my-4">
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs mb-4">
        {current.icon}
      </div>
      <h3 className="text-base font-bold text-slate-900">{title || current.title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
        {description || current.description}
      </p>

      {actionText && onAction && (
        <button
          id="btn-empty-state-action"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};
