import React from "react";
import { FileText, Plus } from "lucide-react";

const EmptyState = ({ onActionClick, title, description, buttonText }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white py-16 px-6 text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200">
        <FileText className="h-8 w-8 text-indigo-600" strokeWidth={2} />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>

      <p className="mb-8 max-w-sm text-sm leading-relaxed text-slate-500">
        {description}
      </p>

      {buttonText && onActionClick && (
        <button
          onClick={onActionClick}
          className="group relative inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 text-white shadow-lg"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            {buttonText}
          </span>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      )}
    </div>
  );
};

export default EmptyState;
