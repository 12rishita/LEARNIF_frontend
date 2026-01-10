import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react";
import moment from "moment";

const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return "TB";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      onClick={handleNavigate}
      className="flex items-center justify-between p-4 bg-white border rounded-xl cursor-pointer hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <FileText className="text-slate-400" />
        <div>
          <p className="text-sm font-medium text-slate-900">{document.title}</p>
          <p className="text-xs text-slate-500">
            {formatFileSize(document.size)} •{" "}
            {moment(document.createdAt).fromNow()}
          </p>
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="text-red-500 hover:text-red-600"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default DocumentCard;
