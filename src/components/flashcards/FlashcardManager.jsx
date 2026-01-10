import React, { useEffect, useState } from "react";
import {
  Brain,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Clock,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../../components/common/Spinner";
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const res = await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardSets(res.data || []);
    } catch {
      toast.error("Failed to fetch flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchFlashcardSets();
  }, [documentId]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("New flashcard set generated");
      fetchFlashcardSets();
    } catch (err) {
      toast.error(err?.message || "Failed to generate flashcards");
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  const handleNextCard = async () => {
    if (!selectedSet) return;
    const card = selectedSet.cards[currentCardIndex];
    if (card) {
      await flashcardService.reviewFlashcard(card._id).catch(() => {});
    }
    setCurrentCardIndex((i) => (i + 1) % selectedSet.cards.length);
  };

  const handlePrevCard = () => {
    if (!selectedSet) return;
    setCurrentCardIndex(
      (i) => (i - 1 + selectedSet.cards.length) % selectedSet.cards.length
    );
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      const updatedSets = flashcardSets.map((set) => {
        if (set._id !== selectedSet._id) return set;
        const updatedCards = set.cards.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        );
        return { ...set, cards: updatedCards };
      });
      setFlashcardSets(updatedSets);
      setSelectedSet(updatedSets.find((s) => s._id === selectedSet._id));
      toast.success("Star status updated");
    } catch {
      toast.error("Failed to update star");
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Flashcard set deleted");
      if (selectedSet?._id === setToDelete._id) setSelectedSet(null);
      fetchFlashcardSets();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
    }
  };

  const FlashcardSetCard = ({ set }) => (
    <div
      onClick={() => handleSelectSet(set)}
      className="group relative cursor-pointer rounded-[2rem] border border-slate-100 bg-white p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1"
    >
      <button
        onClick={(e) => handleDeleteRequest(e, set)}
        className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all"
      >
        <Trash2 size={18} />
      </button>

      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
        <Brain size={28} />
      </div>

      <h3 className="text-xl font-black text-slate-900 tracking-tight">
        Flashcard Set
      </h3>
      <div className="flex items-center gap-2 mt-1 mb-6">
        <Clock size={12} className="text-slate-400" />
        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
          Created {moment(set.createdAt).format("MMM DD, YYYY")}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
          <Layers size={14} className="text-indigo-500" />
          <span className="text-sm font-black text-slate-700">
            {set.cards.length} cards
          </span>
        </div>
        <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );

  const renderSetList = () => {
    if (loading)
      return (
        <div className="py-20 flex justify-center">
          <Spinner />
        </div>
      );

    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Flashcard Decks
            </h2>
            <p className="text-slate-500 font-medium">
              Review AI-generated study cards
            </p>
          </div>
          <button
            disabled={generating}
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-white font-black hover:bg-indigo-600 transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-slate-200"
          >
            <Sparkles size={18} className="text-amber-400" />
            {generating ? "Crafting Cards..." : "Generate New Deck"}
          </button>
        </div>

        {!flashcardSets.length ? (
          <div className="flex flex-col items-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="mb-6 h-20 w-20 flex items-center justify-center rounded-[2rem] bg-white shadow-xl">
              <Brain size={40} className="text-indigo-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              No Flashcards Generated
            </h3>
            <p className="mt-2 max-w-sm text-center text-slate-500 font-medium leading-relaxed px-6">
              Ready to master this document? Generate a new deck to start active
              recall training.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {flashcardSets.map((set) => (
              <FlashcardSetCard key={set._id} set={set} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderFlashcardViewer = () => {
    const currentCard = selectedSet.cards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / selectedSet.cards.length) * 100;

    return (
      <div className="space-y-10 max-w-2xl mx-auto">
        {/* Viewer Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSet(null)}
            className="group flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Exit Study
          </button>

          <div className="flex items-center gap-2">
            <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-slate-400">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Card and Navigation */}
        <div className="flex flex-col items-center space-y-10">
          <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />

          <div className="flex items-center gap-8">
            <button
              onClick={handlePrevCard}
              disabled={selectedSet.cards.length <= 1}
              className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>

            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {currentCardIndex + 1}
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                of {selectedSet.cards.length}
              </span>
            </div>

            <button
              onClick={handleNextCard}
              disabled={selectedSet.cards.length <= 1}
              className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full">
      {selectedSet ? renderFlashcardViewer() : renderSetList()}

      {/* Modernized Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-[2.5rem] bg-white p-10 shadow-2xl border border-white animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-6">
              <Trash2 size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Delete Deck?
            </h3>
            <p className="mt-2 text-slate-500 font-medium leading-relaxed">
              This will permanently remove this set and its review history.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="w-full rounded-2xl bg-rose-500 py-4 text-sm font-black text-white hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-100"
              >
                {deleting ? "Removing..." : "Delete Permanently"}
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full rounded-2xl bg-slate-100 py-4 text-sm font-black text-slate-600 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardManager;
