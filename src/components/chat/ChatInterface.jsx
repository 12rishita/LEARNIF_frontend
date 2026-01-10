import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles, User, Bot } from "lucide-react";
import { useParams } from "react-router-dom";

import aiService from "../../services/aiService";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRenderer";

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);

        setHistory(response?.data?.messages || []);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        setHistory([]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, message);

      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks: response.data.relevantChunks,
      };

      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={index}
        className={`flex items-end gap-3 mb-6 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold
          ${
            isUser
              ? "bg-slate-900 text-white"
              : "bg-indigo-100 text-indigo-600 border border-indigo-200"
          }`}
        >
          {isUser ? (
            user?.username?.charAt(0)?.toUpperCase() || <User size={14} />
          ) : (
            <Bot size={16} />
          )}
        </div>

        {/* Message bubble */}
        <div
          className={`relative p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed
            ${
              isUser
                ? "bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-100"
                : "bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm"
            }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
          ) : (
            <div className="prose prose-slate prose-sm max-w-none">
              <MarkdownRenderer content={msg.content} />
            </div>
          )}
        </div>
      </div>
    );
  };

  //  Initial loading UI
  if (initialLoading) {
    return (
      <div className="flex flex-col h-full min-h-[400px] items-center justify-center bg-white/50 backdrop-blur-sm border border-slate-100 rounded-[2rem]">
        <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-indigo-600 animate-pulse" />
        </div>
        <Spinner />
        <p className="text-xs mt-4 font-black text-slate-400 uppercase tracking-widest">
          Initializing AI Context...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[75vh] bg-slate-50/30 rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-inner">
      {/* Messages */}
      <div className="flex-1 overflow-y-hidden p-6">
        {history.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-10">
            <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              AI Document Assistant
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              I've analyzed your document. Ask me to summarize, explain
              concepts, or find specific details.
            </p>
          </div>
        )}

        {Array.isArray(history) && history.map(renderMessage)}

        {loading && (
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
              <Bot size={16} className="animate-spin-slow" />
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
              <span
                className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white/80 backdrop-blur-md border-t border-slate-100">
        <form
          onSubmit={handleSendMessage}
          className="relative flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-[1.5rem] border border-slate-200/50 focus-within:border-indigo-300 transition-all shadow-sm"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-sm font-medium text-slate-700"
            placeholder="Ask anything about the document..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="p-3 bg-indigo-600 text-white rounded-[1rem] hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-lg shadow-indigo-100"
          >
            <Send size={18} strokeWidth={2.5} />
          </button>
        </form>
        <p className="text-[10px] text-center mt-3 text-slate-400 font-bold uppercase tracking-wider">
          AI may provide inaccurate info. Verify key facts.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
