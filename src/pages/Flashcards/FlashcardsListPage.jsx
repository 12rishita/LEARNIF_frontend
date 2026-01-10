import React, { useState, useEffect } from "react";
import flashcardService from "../../services/flashcardService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import FlashcardSetCard from "../../components/flashcards/FlashcardSetCard";
import toast from "react-hot-toast";

const FlashcardsListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await flashcardService.getAllFlashcardSets();

        const sets = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];

        setFlashcardSets(sets);
      } catch (error) {
        toast.error("Failed to fetch flashcard sets.");
        console.error(error);
        setFlashcardSets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSets();
  }, []);

  const handleDeleteRequest = (set) => {
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);

      setFlashcardSets((prev) => prev.filter((s) => s._id !== setToDelete._id));

      toast.success("Flashcard set deleted successfully");
    } catch (error) {
      toast.error("Failed to delete flashcard set");
      console.error(error);
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <PageHeader title="Flashcard Sets" />

      {flashcardSets.length === 0 ? (
        <EmptyState
          title="No Flashcard Sets Found"
          description="You haven't generated any flashcards yet. Go to a document to create some."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {flashcardSets.map((set) => (
            <FlashcardSetCard
              key={set._id}
              flashcardSet={set}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.25)]">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-rose-500"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-3xl font-black text-slate-900 mb-3">
              Delete Deck?
            </h3>

            {/* Description */}
            <p className="text-lg text-slate-500 leading-relaxed">
              This will permanently remove this set and its review history.
            </p>

            {/* Actions */}
            <div className="mt-10 space-y-4">
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="w-full py-5 rounded-full
                     bg-rose-500 text-white text-lg font-black
                     hover:bg-rose-600
                     transition-all active:scale-[0.98]"
              >
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full py-5 rounded-full
                     bg-slate-100 text-slate-600 text-lg font-black
                     hover:bg-slate-200
                     transition-all active:scale-[0.98]"
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

export default FlashcardsListPage;
