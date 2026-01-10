import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Sparkles,
  Layout,
} from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";

import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import Flashcard from "../../components/flashcards/Flashcard";

const FlashcardPage = () => {
  const { setId } = useParams();
  const navigate = useNavigate();

  const [flashcardSet, setFlashcardSet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const res = await flashcardService.getFlashcardsForDocument(setId);
      const set = res?.data?.[0];

      if (!set || !set.cards?.length) {
        setFlashcards([]);
        setFlashcardSet(null);
        return;
      }

      setFlashcardSet(set);
      setFlashcards(set.cards);
      setCurrentCardIndex(0);
    } catch (err) {
      toast.error("Failed to load flashcards");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (setId) fetchFlashcards();
  }, [setId]);

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setFlashcards((prev) =>
        prev.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        )
      );
      toast.success("Card updated");
    } catch {
      toast.error("Failed to update star");
    }
  };

  const handleReview = async () => {
    const card = flashcards[currentCardIndex];
    if (!card) return;
    try {
      await flashcardService.reviewFlashcard(card._id);
    } catch (err) {
      console.error("Review logging failed", err);
    }
  };

  const handleNext = async () => {
    await handleReview();
    setCurrentCardIndex((i) => (i + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setCurrentCardIndex((i) => (i - 1 + flashcards.length) % flashcards.length);
  };

  const handleConfirmDelete = async () => {
    if (!flashcardSet?._id) return;
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(flashcardSet._id);
      toast.success("Set deleted successfully");
      navigate("/documents");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Spinner />
      </div>
    );

  if (!flashcards.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Layout className="text-slate-300" size={32} />
          </div>
          <p className="text-slate-500 font-bold text-lg">
            No flashcards available
          </p>
          <Link
            to="/documents"
            className="text-indigo-600 font-medium mt-2 inline-block"
          >
            Go to Documents
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];
  const progressPercent = ((currentCardIndex + 1) / flashcards.length) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link
              to="/documents"
              className="group inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors mb-4"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Documents
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Study Session
              <Sparkles className="text-indigo-500" size={24} />
            </h1>
          </div>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-xl font-bold text-sm transition-colors"
          >
            <Trash2 size={18} />
            Delete Set
          </button>
        </div>

        {/* Study Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Your Progress
            </span>
            <span className="text-sm font-black text-indigo-600 tabular-nums">
              {currentCardIndex + 1}{" "}
              <span className="text-slate-300 mx-1">/</span> {flashcards.length}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Flashcard Focus Area */}
        <div className="flex flex-col items-center gap-10">
          <div className="w-full relative group">
            {/* Ambient Shadow Effect */}
            <div className="absolute -inset-4 bg-indigo-500/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Flashcard
              flashcard={currentCard}
              onToggleStar={handleToggleStar}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4 items-center bg-white p-3 rounded-[2rem] border border-slate-200/60 shadow-sm">
            <button
              onClick={handlePrev}
              disabled={flashcards.length <= 1}
              className="p-4 rounded-2xl hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={24} className="text-slate-600" />
            </button>

            <div className="h-8 w-[1px] bg-slate-100 mx-2" />

            <button
              onClick={handleNext}
              disabled={flashcards.length <= 1}
              className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              {currentCardIndex === flashcards.length - 1
                ? "Finish & Restart"
                : "Next Card"}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Modernized Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2.5rem] bg-white p-10 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
              <Trash2 className="text-rose-500" size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">
              Delete this set?
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              Are you sure? This will permanently remove all flashcards in this
              set. This action cannot be undone.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-sm hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all"
              >
                {deleting ? "Deleting..." : "Delete Set"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardPage;
