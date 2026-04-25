import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  FileText,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";

const toolConfig = {
  quizzes: {
    title: "Quiz Practice",
    subtitle: "Choose a document and jump straight into quiz generation and review.",
    icon: BrainCircuit,
    accent: "from-emerald-500 to-teal-500",
    badge: "Practice Mode",
    tab: "Quizzes",
    emptyTitle: "No documents ready for quizzes",
    emptyDescription: "Upload a PDF first, then come back to generate quizzes from it.",
    cta: "Open Quizzes",
  },
  "ai-bot": {
    title: "AI Bot",
    subtitle: "Pick a document to chat with your notes, ask questions, and explain concepts.",
    icon: MessageSquare,
    accent: "from-indigo-500 to-cyan-500",
    badge: "Chat Mode",
    tab: "Chat",
    emptyTitle: "No documents ready for AI chat",
    emptyDescription: "Upload a document first so the AI bot has context to talk about.",
    cta: "Open AI Bot",
  },
};

const StudyToolLaunchPage = ({ tool = "quizzes" }) => {
  const config = toolConfig[tool] || toolConfig.quizzes;
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await documentService.getDocuments();
        setDocuments(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to fetch documents.");
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const readyDocuments = useMemo(
    () => documents.filter((doc) => doc.status === "ready"),
    [documents]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Spinner />
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 shadow-sm">
              <Sparkles size={14} className="text-amber-500" />
              {config.badge}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {config.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
              {config.subtitle}
            </p>
          </div>

          <Link
            to="/documents"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition-all hover:text-indigo-600"
          >
            <FileText size={18} />
            Go to Library
          </Link>
        </div>

        {!readyDocuments.length ? (
          <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/70 px-8 py-24 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 text-slate-300">
              <Icon size={38} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              {config.emptyTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed text-slate-500">
              {config.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {readyDocuments.map((doc) => (
              <Link
                key={doc._id}
                to={`/documents/${doc._id}?tab=${encodeURIComponent(config.tab)}`}
                className="group relative overflow-hidden rounded-[2.25rem] border border-slate-200/70 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.12)]"
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${config.accent} text-white shadow-lg`}
                >
                  <Icon size={24} />
                </div>

                <h3 className="text-2xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                  {doc.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  {doc.flashcardCount ?? 0} flashcards • {doc.quizCount ?? 0} quizzes
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Ready
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700 transition-colors group-hover:text-indigo-600">
                    {config.cta}
                    <ArrowRight size={16} />
                  </span>
                </div>

                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-50 transition-colors duration-300 group-hover:bg-indigo-50" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyToolLaunchPage;
