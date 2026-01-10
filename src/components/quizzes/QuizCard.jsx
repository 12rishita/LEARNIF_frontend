import React from "react";
import { Link } from "react-router-dom";
import { Play, BarChart2, Trash2, Award, Clock, Sparkles } from "lucide-react";
import moment from "moment";

const QuizCard = ({ quiz, onDelete }) => {
  const isCompleted = quiz?.userAnswers?.length > 0;

  return (
    <div
      className="group relative rounded-[2.5rem]
      border border-indigo-200 bg-white p-8
      transition-all duration-300
      hover:border-indigo-400
      hover:shadow-2xl hover:shadow-indigo-200/50
      hover:-translate-y-1
      flex flex-col h-full"
    >
      {/* Delete Action */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full
        text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all"
      >
        <Trash2 size={18} />
      </button>

      {/* Header Info */}
      <div className="flex items-start justify-between mb-6">
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${
            isCompleted
              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
              : "bg-indigo-50 border-indigo-200 text-indigo-600"
          }`}
        >
          {isCompleted ? <Award size={14} /> : <Sparkles size={14} />}
          <span className="text-[10px] font-black uppercase tracking-[0.1em]">
            {isCompleted ? `Score: ${quiz.score}%` : "Ready to Start"}
          </span>
        </div>
      </div>

      {/* Title and Date */}
      <div className="flex-1">
        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
          {quiz.title}
        </h3>

        <div className="flex items-center gap-2">
          <Clock size={12} className="text-slate-400" />
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
            {moment(quiz.createdAt).format("MMM DD, YYYY")}
          </p>
        </div>
      </div>

      {/* Stats and Action */}
      <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
        <div className="flex items-center gap-2">
          <div className="px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <span className="text-sm font-black text-slate-700">
              {quiz.questions.length} Questions
            </span>
          </div>
        </div>

        {isCompleted ? (
          <Link to={`/quizzes/${quiz._id}`} className="block">
            <button
              className="w-full h-14 inline-flex items-center justify-center gap-2
              rounded-2xl border-2 border-indigo-200
              bg-white text-slate-900 font-black
              hover:bg-indigo-50 hover:border-indigo-300
              transition-all active:scale-95"
            >
              <BarChart2 size={18} strokeWidth={2.5} />
              Review Performance
            </button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`} className="block">
            <button
              className="w-full h-14 inline-flex items-center justify-center gap-2
              rounded-2xl bg-slate-900 text-white font-black
              hover:bg-indigo-600 transition-all active:scale-95
              shadow-lg shadow-slate-200"
            >
              <Play size={18} fill="currentColor" />
              Take Quiz Now
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
