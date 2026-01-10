import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Lightbulb,
  X,
  Zap,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

import aiService from "../../services/aiService";
import MarkdownRenderer from "../common/MarkdownRenderer";

const AIActions = () => {
  const { id: documentId } = useParams();

  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    try {
      const { summary } = await aiService.generateSummary(documentId);
      setModalTitle("Executive Summary");
      setModalContent(summary);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to generate summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!concept.trim()) {
      toast.error("Please enter a concept to explain.");
      return;
    }

    setLoadingAction("explain");
    try {
      const { explanation } = await aiService.explainConcept(
        documentId,
        concept
      );
      setModalTitle(`Deep Dive: ${concept}`);
      setModalContent(explanation);
      setIsModalOpen(true);
      setConcept("");
    } catch (error) {
      toast.error("Failed to explain concept.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Sparkles size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              AI Insights
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Advanced Document Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="p-8 space-y-4">
        {/* Summarize Tile */}
        <button
          onClick={handleGenerateSummary}
          disabled={loadingAction === "summary"}
          className="w-full group relative p-6 bg-slate-50 hover:bg-white rounded-[2rem] border-2 border-transparent hover:border-indigo-100 transition-all duration-300 text-left overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                <BookOpen size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-slate-800 tracking-tight">
                  Generate Summary
                </h4>
                <p className="text-sm text-slate-500 font-medium">
                  Condense the entire document into key points.
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 transition-colors">
              {loadingAction === "summary" ? (
                <Zap size={18} className="animate-spin" />
              ) : (
                <ChevronRight size={18} />
              )}
            </div>
          </div>
        </button>

        {/* Concept Tile */}
        <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Lightbulb size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-black text-slate-800 tracking-tight">
                Explain Concept
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                Targeted AI explanations for specific terms.
              </p>
            </div>
          </div>

          <form onSubmit={handleExplainConcept} className="flex gap-2">
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. Quantum Computing"
              className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all"
            />
            <button
              type="submit"
              disabled={loadingAction === "explain" || !concept.trim()}
              className="px-6 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 disabled:opacity-30 transition-all active:scale-95"
            >
              {loadingAction === "explain" ? "..." : "Explain"}
            </button>
          </form>
        </div>
      </div>

      {/* Result Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] max-w-2xl w-full shadow-2xl overflow-hidden border border-white animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {modalTitle}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="prose prose-slate prose-p:font-medium max-w-none">
                <MarkdownRenderer content={modalContent} />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-10 py-6 border-t border-slate-50 text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm transition-all active:scale-95 hover:bg-indigo-600"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIActions;
