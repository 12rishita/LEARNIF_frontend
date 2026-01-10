import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import Tabs from "../../components/common/Tabs";
import ChatInterface from "../../components/chat/ChatInterface";
import AiActions from "../../components/ai/AiActions";
import FlashcardManager from "../../components/flashcards/FlashcardManager";
import QuizManager from "../../components/quizzes/QuizManager";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error("Failed to fetch document details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentDetails();
  }, [id]);

  const getPdfUrl = () => {
    if (!document?.data?.filePath) return null;
    // return `http://localhost:8000${document.data.filePath}`;
    return `https://mindforge-ai-backend.onrender.com${document.data.filePath}`;
  };

  const renderContent = () => {
    if (!document?.data?.filePath) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            PDF content is currently unavailable.
          </p>
        </div>
      );
    }

    const pdfUrl = getPdfUrl();

    return (
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200/60 transition-all">
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <FileText size={18} className="text-indigo-600" />
            </div>
            <span className="text-sm font-black text-slate-700 uppercase tracking-wider">
              Document Viewer
            </span>
          </div>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl transition-all"
          >
            Open Fullscreen{" "}
            <ExternalLink
              size={14}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>
        </div>

        <div className="relative bg-slate-200/20 p-1">
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            className="w-full h-[75vh] rounded-b-[1.8rem] shadow-inner bg-white"
            style={{ colorScheme: "light" }}
          />
        </div>
      </div>
    );
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: <ChatInterface /> },
    { name: "AI Actions", label: "AI Actions", content: <AiActions /> },
    {
      name: "Flashcards",
      label: "Flashcards",
      content: <FlashcardManager documentId={id} />,
    },
    {
      name: "Quizzes",
      label: "Quizzes",
      content: <QuizManager documentId={id} />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Spinner />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <p className="text-slate-500 font-bold text-lg">
            Document not found.
          </p>
          <Link
            to="/documents"
            className="text-indigo-600 font-medium mt-4 inline-block hover:underline"
          >
            Return to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <Link
              to="/documents"
              className="group inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors mb-4"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Library
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              {document.data?.title || "Document"}
              <Sparkles className="text-amber-400" size={24} />
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Analyze, learn, and generate study materials
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="px-4 py-2 bg-emerald-50 rounded-xl">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                Status: Processed
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Tabs Section */}
        <div className="bg-transparent">
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
