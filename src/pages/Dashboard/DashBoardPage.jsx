import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Clock,
  FileText,
  Flame,
  MessageSquare,
  Target,
  TrendingUp,
} from "lucide-react";

import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";

const formatMinutes = (minutes = 0) => {
  if (minutes >= 60) {
    return `${(minutes / 60).toFixed(1)}h`;
  }
  return `${Math.round(minutes)}m`;
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const getHeatmapClass = (intensity) => {
  if (intensity >= 4) return "bg-indigo-600";
  if (intensity === 3) return "bg-indigo-500";
  if (intensity === 2) return "bg-indigo-300";
  if (intensity === 1) return "bg-indigo-100";
  return "bg-slate-100";
};

const StatCard = ({ label, value, hint, icon: Icon, accent }) => (
  <div className="group relative overflow-hidden rounded-[2.25rem] border border-slate-200/70 bg-white p-7 shadow-sm">
    <div
      className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`}
    />
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          {label}
        </p>
        <p className="mt-3 text-4xl font-black tracking-tight text-slate-900">
          {value}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-500">{hint}</p>
      </div>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 transition-transform group-hover:scale-105">
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const LineChart = ({ data }) => {
  const width = 520;
  const height = 220;
  const padding = 28;
  const maxValue = Math.max(...data.map((point) => point.studyMinutes), 1);

  const points = data.map((point, index) => {
    const x =
      padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y =
      height -
      padding -
      (point.studyMinutes / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900">
            Weekly Learning Trend
          </h3>
          <p className="text-sm font-medium text-slate-500">
            Daily time spent studying documents
          </p>
        </div>
        <div className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-blue-700">
          {formatMinutes(data.reduce((sum, point) => sum + point.studyMinutes, 0))}{" "}
          this week
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-60 w-full">
        {[0, 1, 2, 3].map((line) => {
          const y = padding + (line * (height - padding * 2)) / 3;
          return (
            <line
              key={line}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="#E2E8F0"
              strokeDasharray="4 6"
            />
          );
        })}
        <polyline
          fill="none"
          stroke="#2563EB"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points.join(" ")}
        />
        {data.map((point, index) => {
          const [x, y] = points[index].split(",").map(Number);
          return (
            <g key={point.date}>
              <circle cx={x} cy={y} r="5" fill="#2563EB" />
              <text
                x={x}
                y={height - 6}
                textAnchor="middle"
                className="fill-slate-400 text-[10px] font-bold uppercase"
              >
                {point.label}
              </text>
              <text
                x={x}
                y={Math.max(y - 12, 14)}
                textAnchor="middle"
                className="fill-slate-500 text-[10px] font-bold"
              >
                {Math.round(point.studyMinutes)}m
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const PracticeChart = ({ data }) => {
  const maxValue = Math.max(
    ...data.flatMap((day) => [
      day.flashcardReviews,
      day.quizCompletions,
      day.chatQuestions,
    ]),
    1
  );

  const bars = [
    { key: "flashcardReviews", label: "Flashcards", color: "bg-pink-500" },
    { key: "quizCompletions", label: "Quizzes", color: "bg-emerald-500" },
    { key: "chatQuestions", label: "Chat", color: "bg-amber-400" },
  ];

  return (
    <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900">
          Practice Breakdown
        </h3>
        <p className="text-sm font-medium text-slate-500">
          Active recall, quizzes, and question-asking each day
        </p>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {data.map((day) => (
          <div key={day.date} className="flex flex-col items-center gap-3">
            <div className="flex h-48 items-end gap-2">
              {bars.map((bar) => (
                <div key={bar.key} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-4 rounded-full ${bar.color}`}
                    style={{
                      height: `${Math.max(
                        12,
                        (day[bar.key] / maxValue) * 150
                      )}px`,
                      opacity: day[bar.key] ? 1 : 0.2,
                    }}
                    title={`${bar.label}: ${day[bar.key]}`}
                  />
                </div>
              ))}
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              {day.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
        {bars.map((bar) => (
          <div key={bar.key} className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
            <span className={`h-2.5 w-2.5 rounded-full ${bar.color}`} />
            {bar.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const SplitChart = ({ items }) => {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  let currentAngle = 0;

  const segments = items.map((item) => {
    const angle = (item.value / total) * 360;
    const segment = `${item.color} ${currentAngle}deg ${currentAngle + angle}deg`;
    currentAngle += angle;
    return segment;
  });

  return (
    <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900">Learning Mix</h3>
        <p className="text-sm font-medium text-slate-500">
          Where student effort is going across the app
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
        <div
          className="relative h-48 w-48 rounded-full"
          style={{
            background: `conic-gradient(${segments.join(", ")})`,
          }}
        >
          <div className="absolute inset-8 rounded-full bg-white" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900">{total}</p>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                tracked actions
              </p>
            </div>
          </div>
        </div>

        <div className="w-full space-y-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-bold text-slate-700">{item.label}</span>
              </div>
              <span className="text-sm font-black text-slate-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Heatmap = ({ days }) => (
  <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm">
    <div className="mb-6">
      <h3 className="text-xl font-black text-slate-900">Consistency Heatmap</h3>
      <p className="text-sm font-medium text-slate-500">
        Daily activity over the last five weeks
      </p>
    </div>

    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => (
        <div
          key={day.date}
          className={`h-9 rounded-xl ${getHeatmapClass(day.intensity)}`}
          title={`${day.label}: ${day.activityCount} activity events`}
        />
      ))}
    </div>

    <div className="mt-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
      <span>Less</span>
      <span>More</span>
    </div>
  </div>
);

const ScoreTrend = ({ items }) => (
  <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm">
    <div className="mb-6">
      <h3 className="text-xl font-black text-slate-900">Quiz Score Trend</h3>
      <p className="text-sm font-medium text-slate-500">
        Recent performance across completed quizzes
      </p>
    </div>

    {items.length ? (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.title}-${item.completedAt}`}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-800">{item.title}</p>
                <p className="text-xs font-medium text-slate-400">
                  {formatDateTime(item.completedAt)}
                </p>
              </div>
              <span className="text-lg font-black text-slate-900">
                {item.score}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center text-sm font-medium text-slate-500">
        Complete a quiz to unlock score trends.
      </div>
    )}
  </div>
);

const MasteryList = ({ items }) => (
  <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm">
    <div className="mb-6">
      <h3 className="text-xl font-black text-slate-900">Document Mastery</h3>
      <p className="text-sm font-medium text-slate-500">
        Which materials are strongest right now
      </p>
    </div>

    {items.length ? (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.documentId} className="rounded-2xl bg-slate-50 p-4">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p className="font-black text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {formatMinutes(item.studyMinutes)} studied •{" "}
                  {item.flashcardReviews} flashcards • {item.chatQuestions} chats
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-900">
                {item.mastery}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                style={{ width: `${item.mastery}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center text-sm font-medium text-slate-500">
        Start studying a document to see mastery insights.
      </div>
    )}
  </div>
);

const FocusAreas = ({ items }) => (
  <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm">
    <div className="mb-6">
      <h3 className="text-xl font-black text-slate-900">Focus Next</h3>
      <p className="text-sm font-medium text-slate-500">
        Topics that need more practice
      </p>
    </div>

    {items.length ? (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.documentId} className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="font-black text-slate-900">{item.title}</p>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-amber-700">
                {item.mastery}%
              </span>
            </div>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
              {item.recommendation}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center text-sm font-medium text-slate-500">
        More learning activity will unlock personalized focus suggestions.
      </div>
    )}
  </div>
);

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await progressService.getDashboardData();
        setDashboardData(res.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activities = useMemo(() => {
    if (!dashboardData) return [];

    return [
      ...(dashboardData.recentActivity?.documents || []).map((doc) => ({
        id: `doc-${doc._id}`,
        title: doc.title,
        action: "Viewed Document",
        date: doc.lastAccessed || doc.createdAt,
        link: `/documents/${doc._id}`,
        icon: FileText,
        badge: doc.status,
      })),
      ...(dashboardData.recentActivity?.quizzes || []).map((quiz) => ({
        id: `quiz-${quiz._id}`,
        title: quiz.title,
        action: quiz.completedAt ? "Completed Quiz" : "Created Quiz",
        date: quiz.completedAt || quiz.createdAt,
        link: quiz.completedAt
          ? `/quizzes/${quiz._id}/results`
          : `/quizzes/${quiz._id}`,
        icon: BrainCircuit,
        badge: quiz.completedAt ? `${quiz.score}%` : "Ready",
      })),
    ]
      .filter((item) => item.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  }, [dashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Spinner />
      </div>
    );
  }

  if (!dashboardData?.overview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center group">
          <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mb-6 mx-auto border border-slate-100">
            <TrendingUp className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-slate-500 font-bold text-lg">
            No dashboard data available yet.
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Start by uploading your first document.
          </p>
        </div>
      </div>
    );
  }

  const overview = dashboardData?.overview || {};
  const charts = dashboardData?.charts || {};
  const documentInsights = dashboardData?.documentInsights || {};

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Learning Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
              Track how much the student studies, practices, and improves across
              documents, flashcards, quizzes, and AI chat.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-bold text-orange-700">
            {overview.studyStreak} day streak • {overview.activeDays} active days
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Study Time"
            value={formatMinutes(overview.totalStudyMinutes)}
            hint="Tracked study minutes from document sessions"
            icon={Clock}
            accent="from-blue-500 to-cyan-500"
          />
          <StatCard
            label="Practice Actions"
            value={overview.reviewedFlashcards + overview.completedQuizzes}
            hint="Flashcards reviewed and quizzes completed"
            icon={Target}
            accent="from-pink-500 to-rose-500"
          />
          <StatCard
            label="Average Score"
            value={`${overview.averageScore}%`}
            hint="Average across completed quizzes"
            icon={BrainCircuit}
            accent="from-emerald-400 to-teal-500"
          />
          <StatCard
            label="Current Streak"
            value={`${overview.studyStreak} days`}
            hint="Consecutive active learning days"
            icon={Flame}
            accent="from-amber-400 to-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
          <LineChart data={charts.weeklyLearningTrend || []} />
          <ScoreTrend items={charts.quizScoreTrend || []} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
          <PracticeChart data={charts.practiceBreakdown || []} />
          <SplitChart items={charts.learningSplit || []} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1fr_1fr]">
          <MasteryList items={documentInsights?.mastery || []} />
          <FocusAreas items={documentInsights?.focusAreas || []} />
          <Heatmap days={charts.learningHeatmap || []} />
        </div>

        <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100">
              <BookOpen size={22} className="text-slate-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Recent Activity
              </h3>
              <p className="text-sm font-medium text-slate-500">
                Latest study and practice actions
              </p>
            </div>
          </div>

          {activities.length ? (
            <div className="space-y-4">
              {activities.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className="group flex items-center justify-between rounded-3xl p-5 transition-all hover:bg-slate-50/60"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">
                        {item.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {item.action}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-medium text-slate-400">
                          {formatDateTime(item.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-500 border border-slate-100">
                      {item.badge}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 transition-all group-hover:border-indigo-200 group-hover:text-indigo-600 group-hover:shadow-md">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border-2 border-dashed border-slate-100 py-16 text-center">
              <p className="text-slate-400 font-medium">
                No recent activity to show yet.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Documents
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {overview.totalDocuments}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Flashcards
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {overview.totalFlashcards}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Starred Cards
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {overview.starredFlashcards}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
