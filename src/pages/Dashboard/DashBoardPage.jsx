import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Spinner />
      </div>
    );

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center group">
          <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500 border border-slate-100">
            <TrendingUp className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-slate-500 font-bold text-lg">
            No dashboard data available yet.
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Start by uploading your first document!
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "TOTAL DOCUMENTS",
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-100",
    },
    {
      label: "TOTAL FLASHCARDS",
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
      gradient: "from-pink-500 to-rose-600",
      shadow: "shadow-rose-100",
    },
    {
      label: "TOTAL QUIZZES",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: "from-emerald-400 to-teal-600",
      shadow: "shadow-emerald-100",
    },
  ];

  const activities = [
    ...(dashboardData.recentActivity?.documents || []).map((doc) => ({
      id: doc._id,
      title: doc.title,
      action: "Accessed Document",
      date: doc.lastAccessed || doc.createdAt,
      link: `/documents/${doc._id}`,
      bg: "bg-blue-50",
      text: "text-blue-600",
      icon: FileText,
    })),
    ...(dashboardData.recentActivity?.quizzes || []).map((quiz) => ({
      id: quiz._id,
      title: quiz.title,
      action: "Attempted Quiz",
      date: quiz.completedAt || quiz.createdAt,
      link: `/quizzes/${quiz._id}`,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      icon: BrainCircuit,
    })),
  ]
    .filter((a) => a.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Your Progress
          </h1>
          <p className="text-slate-500 font-medium">
            Overview of your learning journey and recent activities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative bg-white/80 backdrop-blur-sm rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-black text-slate-900 mt-3 tabular-nums">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg ${stat.shadow} group-hover:rotate-6 transition-transform duration-300`}
                >
                  <stat.icon size={26} />
                </div>
              </div>
              <div className="mt-6 h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${stat.gradient} transition-all duration-700`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] border border-slate-200/60 p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <Clock size={22} className="text-slate-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Recent Activity
            </h3>
          </div>

          {activities.length ? (
            <div className="space-y-4">
              {activities.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between p-5 rounded-3xl hover:bg-slate-50/60 transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-12 h-12 rounded-2xl ${item.bg}
                      flex items-center justify-center
                      group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className={`w-6 h-6 ${item.text}`} />
                    </div>

                    <div>
                      <p className="text-sm font-black text-slate-800">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {item.action}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-medium text-slate-400">
                          {new Date(item.date).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={item.link}
                    className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all group-hover:translate-x-1"
                  >
                    <ArrowUpRight size={18} />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem]">
              <p className="text-slate-400 font-medium">
                No recent activity to show yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
