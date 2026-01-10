import { useState } from "react";
import { Star, RotateCcw, HelpCircle, CheckCircle2 } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="relative h-80 w-full group"
      style={{ perspective: "2000px" }}
    >
      <div
        className="relative h-full w-full cursor-pointer transition-all duration-700 transform-gpu"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        <div
          className="absolute inset-0 rounded-[2.5rem] border-2 border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <HelpCircle size={14} className="text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                Question
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all active:scale-90
                ${
                  flashcard.isStarred
                    ? "bg-amber-400 text-white shadow-lg shadow-amber-100"
                    : "bg-slate-50 text-slate-300 hover:text-slate-500 border border-slate-100"
                }`}
            >
              <Star
                size={18}
                fill={flashcard.isStarred ? "currentColor" : "none"}
                strokeWidth={2.5}
              />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center py-6">
            <p className="text-center text-xl font-bold text-slate-800 leading-snug tracking-tight">
              {flashcard.question}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 group-hover:text-indigo-400 transition-colors">
            <RotateCcw size={14} className="animate-spin-slow" />
            <span>Click to flip</span>
          </div>
        </div>

        {/* BACK SIDE (Answer) */}
        <div
          className="absolute inset-0 h-full w-full rounded-[2.5rem] bg-indigo-600 p-8 shadow-2xl shadow-indigo-200 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <CheckCircle2 size={14} className="text-emerald-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                Answer
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all
                ${
                  flashcard.isStarred
                    ? "bg-white text-amber-500 shadow-xl"
                    : "bg-white/10 text-white/50 hover:bg-white/20 border border-white/10"
                }`}
            >
              <Star
                size={18}
                fill={flashcard.isStarred ? "currentColor" : "none"}
                strokeWidth={2.5}
              />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center py-6 overflow-y-auto custom-scrollbar">
            <p className="text-center text-lg font-medium text-white/95 leading-relaxed">
              {flashcard.answer}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <RotateCcw size={14} />
            <span>Click to return</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
