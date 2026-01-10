import React, { useState, useEffect } from "react";
import { Plus, Sparkles, Brain, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import QuizCard from "./QuizCard";

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await quizService.getQuizzesForDocument(documentId);
      setQuizzes(res.data || []);
    } catch {
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchQuizzes();
  }, [documentId]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await aiService.generateQuiz(documentId, { numQuestions });
      toast.success("Quiz generated successfully!");
      setIsGenerateModalOpen(false);
      fetchQuizzes();
    } catch (err) {
      toast.error(err?.message || "Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (quiz) => {
    setQuizToDelete(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!quizToDelete) return;
    setDeleting(true);
    try {
      await quizService.deleteQuiz(quizToDelete._id);
      toast.success("Quiz deleted");
      fetchQuizzes();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setQuizToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-3
                      bg-white/50 p-6 rounded-[2rem]
                      border border-indigo-100/50 backdrop-blur-sm"
      >
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Practice Quizzes
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            AI-powered assessments
          </p>
        </div>

        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl
                     bg-slate-900 px-5 py-3 text-sm
                     text-white font-black
                     hover:bg-violet-600 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          New Quiz
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : !quizzes.length ? (
        <div
          className="flex flex-col items-center py-16
                        bg-slate-50/50 rounded-[2rem]
                        border border-dashed border-indigo-200/50"
        >
          <div
            className="mb-4 h-16 w-16 flex items-center justify-center
                          rounded-2xl bg-white shadow text-indigo-200"
          >
            <Brain size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            No Quizzes Found
          </h3>
          <p className="mt-1 text-sm text-slate-500 text-center max-w-xs">
            Create your first quiz to start learning.
          </p>
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="mt-5 px-6 py-2.5
                       bg-white border border-indigo-100
                       rounded-xl font-black text-sm
                       text-indigo-600 hover:bg-indigo-50 transition-all"
          >
            Create Quiz
          </button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 gap-4
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-4"
        >
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* Generate Quiz Modal */}
      {isGenerateModalOpen && (
        <div
          className="fixed inset-0 z-[100]
                        flex items-center justify-center
                        bg-slate-900/40 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-sm
                          rounded-[2rem] bg-white p-8
                          shadow-2xl border border-white"
          >
            <div className="flex justify-between items-center mb-6">
              <div
                className="w-12 h-12 rounded-xl
                              bg-violet-50 flex items-center justify-center
                              text-violet-600"
              >
                <Sparkles size={24} />
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-slate-300 hover:text-slate-600"
              >
                <X size={22} />
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-900">
              AI Quiz Generator
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Choose number of questions
            </p>

            <form onSubmit={handleGenerateQuiz} className="space-y-5">
              <input
                type="number"
                min={1}
                max={20}
                value={numQuestions}
                onChange={(e) =>
                  setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full h-12 rounded-xl
                           border border-indigo-100
                           bg-slate-50 px-4 font-black
                           focus:outline-none focus:border-violet-400"
                required
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="flex-1 py-3 rounded-xl
                             font-black text-sm
                             bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="flex-[2] py-3 rounded-xl
                             font-black text-sm
                             text-white bg-violet-600 hover:bg-violet-700
                             disabled:opacity-50"
                >
                  {generating ? "Crafting..." : "Generate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal unchanged */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-[200]
                        flex items-center justify-center
                        bg-slate-900/40 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-sm
                          rounded-[2rem] bg-white p-8 shadow-2xl"
          >
            <div
              className="w-14 h-14 rounded-xl
                            bg-rose-50 flex items-center justify-center
                            text-rose-500 mb-5"
            >
              <Trash2 size={26} />
            </div>

            <h3 className="text-xl font-black">Delete Quiz?</h3>
            <p className="text-sm text-slate-500 mt-1">
              This action cannot be undone.
            </p>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="w-full py-3 rounded-xl
                           bg-rose-500 text-white font-black
                           hover:bg-rose-600"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full py-3 rounded-xl
                           bg-slate-100 font-black text-slate-600"
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

export default QuizManager;
