import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizService";
import Spinner from "../../components/common/Spinner";

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        setQuiz(response.data);
      } catch (error) {
        toast.error("Failed to fetch quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = quiz.questions.map((q, index) => ({
        questionIndex: index,
        selectedAnswer:
          selectedAnswers[q._id] !== undefined
            ? q.options[selectedAnswers[q._id]]
            : null,
      }));

      await quizService.submitQuiz(quizId, formattedAnswers);
      toast.success("Quiz submitted successfully!");
      navigate(`/quizzes/${quizId}/results`);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Spinner />
      </div>
    );

  if (!quiz || !quiz.questions?.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p className="text-slate-500 font-bold">Quiz not found.</p>
      </div>
    );

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const progressPercent =
    ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const alphabet = ["A", "B", "C", "D", "E"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-5">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-3">
            <div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                {quiz.title || "Assessment"}
                <Sparkles className="text-indigo-500" size={18} />
              </h1>
              <p className="text-slate-500 text-sm">Select the best answer.</p>
            </div>
            <span className="text-xs font-black text-indigo-600 uppercase">
              Q {currentQuestionIndex + 1}/{quiz.questions.length}
            </span>
          </div>

          <div className="h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 mb-5">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion._id] === index;

              return (
                <label
                  key={index}
                  className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition
                    ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-slate-200 bg-slate-50 hover:bg-white"
                    }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={isSelected}
                    onChange={() =>
                      handleOptionChange(currentQuestion._id, index)
                    }
                  />

                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm
                      ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-white border text-slate-400"
                      }`}
                  >
                    {alphabet[index]}
                  </div>

                  <span className="flex-1 font-semibold text-slate-700">
                    {option}
                  </span>

                  {isSelected && (
                    <CheckCircle2 className="text-indigo-600" size={18} />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center bg-white p-2 rounded-2xl border border-slate-200">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((p) => p - 1)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-slate-500 font-bold disabled:opacity-30"
          >
            <ChevronLeft size={18} />
            Prev
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={
                submitting || selectedAnswers[currentQuestion._id] === undefined
              }
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Finish"}
              <Send size={16} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex((p) => p + 1)}
              disabled={selectedAnswers[currentQuestion._id] === undefined}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
            >
              Next
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTakePage;
