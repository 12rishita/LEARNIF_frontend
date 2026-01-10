import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  FileText,
  X,
  Calendar,
  BookOpen,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import { useNavigate } from "react-router-dom";

const DocumentListPage = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to fetch documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`'${selectedDoc.title}' deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const uploaded = new Date(dateString);
    const diff = now - uploaded;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50/50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Library
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your learning materials and study sets
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Upload New
        </button>
      </div>

      {/* Document Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {documents.length === 0 ? (
          <div className="text-center col-span-full py-32 bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold text-lg">
              Your library is empty
            </p>
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc._id}
              onClick={() => navigate(`/documents/${doc._id}`)}
              className="group relative bg-white border border-slate-200/60 rounded-[2rem] p-6 
              transition-all duration-500 hover:border-indigo-400/50 hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.12)]
              cursor-pointer flex flex-col h-[280px] justify-between overflow-hidden"
            >
              {/* Top Row: Icon & Time/Delete Group */}
              <div className="flex justify-between items-start relative z-10">
                <div className="p-3 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-100 group-hover:rotate-6 transition-transform duration-300">
                  <FileText size={22} />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    <Calendar size={12} />
                    {getRelativeTime(doc.createdAt)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRequest(doc);
                    }}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Title and Metadata */}
              <div className="relative z-10 mt-4">
                <h3 className="text-xl font-extrabold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                  {doc.title}
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  {doc.fileSize
                    ? `${Math.round(doc.fileSize / 1024)} KB`
                    : "0 KB"}{" "}
                  • PDF Document
                </span>
              </div>

              {/* Bottom Row: Badges */}
              <div className="flex flex-wrap gap-2 mt-auto relative z-10 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-xl">
                  <BookOpen size={12} className="text-indigo-600" />
                  <span className="text-[11px] font-bold text-indigo-600">
                    {doc.flashcardCount ?? 0} Cards
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl">
                  <Layers size={12} className="text-amber-600" />
                  <span className="text-[11px] font-bold text-amber-600">
                    {doc.quizCount ?? 0} Quizzes
                  </span>
                </div>
              </div>

              {/* Decorative Background Glow */}
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-indigo-100/60 transition-colors duration-500" />
            </div>
          ))
        )}
      </div>

      {/* Modern Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-slate-900/40 flex items-center justify-center p-4">
          <form
            onSubmit={handleUpload}
            className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-300"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Upload Document
                </h2>
                <p className="text-slate-500 font-medium text-sm">
                  Add a PDF to start generating cards
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Biology Midterm"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-4 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Source File
                </label>
                <div
                  onClick={() => document.getElementById("pdfInput").click()}
                  className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
                >
                  <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText size={28} />
                  </div>
                  <p className="text-slate-600 font-bold">
                    {uploadFile
                      ? uploadFile.name
                      : "Click to select or drag PDF"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    PDF files up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <input
              id="pdfInput"
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileChange}
            />

            <div className="flex gap-3 mt-10">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-[2] px-6 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all"
              >
                {uploading ? "Uploading..." : "Start Upload"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] backdrop-blur-md bg-slate-900/20 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl border border-slate-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
              <Trash2 size={28} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Are you sure?
            </h2>
            <p className="text-slate-500 font-medium mb-8">
              This will permanently delete{" "}
              <span className="text-slate-900 font-bold">
                "{selectedDoc?.title}"
              </span>{" "}
              and all associated data.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-100 transition-all"
              >
                {deleting ? "Deleting..." : "Yes, Delete Document"}
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
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

export default DocumentListPage;
