import React from "react";
import { Link } from "react-router-dom";
import { Home, FileText, ArrowLeft, Ghost, Sparkles } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Visual Illustration Area */}
        <div className="relative mb-12">
          {/* Decorative ambient blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

          <div className="relative inline-flex items-center justify-center">
            <h1 className="text-[12rem] font-black text-slate-900 leading-none tracking-tighter opacity-10">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 animate-bounce-slow">
                <Ghost
                  size={80}
                  className="text-indigo-600"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Lost in the Library?
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
            The page you're looking for has been archived, moved, or simply
            never existed in our database.
          </p>
        </div>

        {/* Action Bento Card */}
        <div className="bg-white rounded-[2.5rem] p-3 border border-slate-200/60 shadow-sm inline-flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <Home size={18} />
            Go to Dashboard
          </Link>

          <Link
            to="/documents"
            className="flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all active:scale-95"
          >
            <FileText size={18} />
            My Documents
          </Link>
        </div>

        {/* Subtle Footer Link */}
        <div className="mt-12">
          <Link
            to={-1}
            className="group inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Return to Previous Page
          </Link>
        </div>
      </div>

      {/* Floating Decorative Icons */}
      <div className="absolute top-20 left-20 text-slate-200 animate-pulse">
        <Sparkles size={40} />
      </div>
      <div className="absolute bottom-20 right-20 text-slate-200 animate-bounce-slow">
        <FileText size={48} />
      </div>
    </div>
  );
};

export default NotFoundPage;
