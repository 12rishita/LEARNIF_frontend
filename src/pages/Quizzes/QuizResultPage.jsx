import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Target,
  BookOpen,
} from "lucide-react";

import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";

const normalize = (text) =>
  text?.includes(":") ? text.split(":")[1].trim() : text?.trim();

const getScoreRingColor = (score) => {
  if (score >= 80) return "border-emerald-400 text-emerald-600";
  if (score >= 60) return "border-orange-400 text-orange-500";
  return "border-rose-400 text-rose-600";
};

const getMessageColor = (score) => {
  if (score >= 80) return "text-emerald-700";
  if (score >= 60) return "text-orange-600";
  return "text-rose-600";
};

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await quizService.getQuizResults(quizId);
        setData(res.data);
      } catch {
        toast.error("Failed to fetch quiz results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!data) return null;

  const { quiz, results } = data;
  const total = results.length;
  const correct = results.filter((r) => r.isCorrect).length;
  const incorrect = total - correct;
  const score = quiz.score;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20">
      <PageHeader title="Quiz Performance" />

      {/* Back button */}
      <div className="flex justify-end mb-8">
        <Link
          to={`/documents/${quiz.document?._id}`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Document
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-14">
        {/* Score Card */}
        <div className="border-2 rounded-3xl p-8 flex flex-col items-center justify-center">
          <div className="relative">
            {/* Optional: soft outer ring */}
            <div className="absolute inset-0 rounded-full border-[10px] border-slate-100" />
            <div
              className={`relative w-32 h-32 flex items-center justify-center rounded-full border-[10px] ${getScoreRingColor(
                score
              )}`}
            >
              <span className="text-4xl font-bold">{score}%</span>
            </div>
          </div>
          <p className={`mt-6 text-lg font-semibold ${getMessageColor(score)}`}>
            {score >= 80
              ? "Excellent!"
              : score >= 60
              ? "Good Job!"
              : "Keep practicing!"}
          </p>
          <p className="text-sm text-slate-600">
            You answered {correct} out of {total} correctly
          </p>
        </div>

        {/* TOTAL QUESTIONS */}
        <div className="border-2 rounded-3xl p-8 bg-blue-50 text-center">
          <Target className="mx-auto mb-4 text-blue-600" />
          <p className="text-sm font-semibold text-slate-600">
            TOTAL QUESTIONS
          </p>
          <p className="text-3xl font-bold mt-2">{total}</p>
        </div>

        {/* CORRECT */}
        <div className="border-2 rounded-3xl p-8 bg-emerald-50 text-center">
          <CheckCircle2 className="mx-auto mb-4 text-emerald-600" />
          <p className="text-sm font-semibold text-slate-600">CORRECT</p>
          <p className="text-3xl font-bold mt-2">{correct}</p>
        </div>

        {/* INCORRECT */}
        <div className="border-2 rounded-3xl p-8 bg-rose-50 text-center">
          <XCircle className="mx-auto mb-4 text-rose-600" />
          <p className="text-sm font-semibold text-slate-600">INCORRECT</p>
          <p className="text-3xl font-bold mt-2">{incorrect}</p>
        </div>
      </div>

      {/* Question review */}
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-5 h-5" />
        <h3 className="text-xl font-semibold">Question-by-Question Review</h3>
      </div>

      <div className="space-y-10">
        {results.map((q, i) => {
          const correctText = normalize(q.correctAnswer);
          const userText = normalize(q.selectedAnswer);

          return (
            <div key={i} className="border-2 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-4">
                <div className="px-3 py-1 rounded-lg bg-slate-100 text-sm font-medium">
                  {i + 1}
                </div>
                {!q.isCorrect && (
                  <span className="flex items-center gap-1 text-sm font-medium text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                    <XCircle className="w-4 h-4" />
                    Incorrect
                  </span>
                )}
              </div>

              <p className="font-medium mb-6">{q.question}</p>

              <div className="grid md:grid-cols-2 gap-4">
                {q.options.map((opt, idx) => {
                  const isCorrect = normalize(opt) === correctText;
                  const isUser = normalize(opt) === userText;

                  return (
                    <div
                      key={idx}
                      className={`px-4 py-4 rounded-xl border-2 flex justify-between items-center
                        ${
                          isCorrect
                            ? "bg-emerald-50 border-emerald-300"
                            : isUser
                            ? "bg-rose-50 border-rose-300"
                            : "bg-slate-50 border-slate-200"
                        }`}
                    >
                      <span className="text-sm font-medium">{opt}</span>
                      {isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      {!isCorrect && isUser && (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm">
                  <span className="font-semibold block mb-1">EXPLANATION</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResultPage;
