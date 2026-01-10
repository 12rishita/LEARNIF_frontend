import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Sparkles,
  ChevronRight,
  Trash2,
  Calendar,
} from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({ flashcardSet, onDelete }) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    navigate(`/flashcards/${flashcardSet.documentId._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(flashcardSet);
  };

  const totalCards = flashcardSet.cards?.length || 0;
  const reviewedCount =
    flashcardSet.cards?.filter((card) => card.lastReviewed)?.length || 0;
  const progressPercentage =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <div
      onClick={handleStudyNow}
      className="group relative bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-6
      transition-all duration-500 hover:border-indigo-400/50 hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)]
      cursor-pointer flex flex-col justify-between h-full overflow-hidden"
    >
      {/* Decorative Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-100/30 rounded-full blur-3xl group-hover:bg-indigo-200/40 transition-colors duration-500" />

      {/* Top Header Section */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        {/* Left: Icon */}
        <div className="p-3.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-white shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform duration-300">
          <BookOpen size={22} />
        </div>

        {/* Right: Time and Delete Button aligned together */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100/80 px-3 py-1.5 rounded-lg">
            <Calendar size={12} />
            {moment(flashcardSet.createdAt).fromNow()}
          </div>

          <button
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
            title="Delete Set"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Content Middle */}
      <div className="space-y-3 relative z-10">
        <h3 className="text-xl font-extrabold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
          {flashcardSet?.documentId?.title || "Untitled Set"}
        </h3>

        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-indigo-50 rounded-md">
            <span className="text-xs font-bold text-indigo-600">
              {totalCards} cards
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {reviewedCount === totalCards
              ? "🎉 Fully mastered"
              : `${reviewedCount} mastered`}
          </span>
        </div>
      </div>

      {/* Bottom Progress & Button */}
      <div className="mt-8 space-y-5 relative z-10">
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">
              Current Progress
            </span>
            <span className="text-sm font-black text-indigo-600">
              {progressPercentage}%
            </span>
          </div>
          <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <button
          className="w-full py-4 px-4 
          bg-slate-900 text-white rounded-2xl font-bold
          flex items-center justify-center gap-2
          group-hover:bg-indigo-600 shadow-sm
          transition-all duration-300
          active:scale-[0.96]"
        >
          <Sparkles
            size={18}
            className="text-amber-400 fill-amber-400 group-hover:animate-pulse"
          />
          <span>Study Now</span>
          <ChevronRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default FlashcardSetCard;
