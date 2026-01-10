import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import {
  BrainCircuit,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.register(username, email, password);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 px-4 relative overflow-hidden">
      {/* Floating background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-indigo-600/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[26rem] h-[26rem] bg-violet-600/30 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur rounded-[2.5rem] shadow-2xl p-10 border border-indigo-100">
          {/* Logo */}
          <div className="text-center mb-10 animate-float">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-indigo-100 shadow">
                <BrainCircuit className="text-indigo-700" size={36} />
              </div>
              <div className="absolute -right-2 -bottom-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-violet-600">
                <Sparkles size={16} />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-800">
              Join <span className="text-indigo-600">MindForge AI</span>
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Create your AI learning account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="relative">
              <User
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  focusedField === "username"
                    ? "text-indigo-600"
                    : "text-slate-400"
                }`}
                size={18}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
                placeholder="Username"
                required
                className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${
                  focusedField === "username"
                    ? "border-indigo-600 focus:ring-indigo-600"
                    : "border-slate-300 focus:ring-indigo-600"
                }`}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  focusedField === "email"
                    ? "text-indigo-600"
                    : "text-slate-400"
                }`}
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="Email address"
                required
                className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${
                  focusedField === "email"
                    ? "border-indigo-600 focus:ring-indigo-600"
                    : "border-slate-300 focus:ring-indigo-600"
                }`}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  focusedField === "password"
                    ? "text-indigo-600"
                    : "text-slate-400"
                }`}
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Password"
                required
                className={`w-full pl-11 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2 ${
                  focusedField === "password"
                    ? "border-indigo-600 focus:ring-indigo-600"
                    : "border-slate-300 focus:ring-indigo-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-700 text-white font-semibold hover:bg-indigo-800 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 tracking-widest">
          MindForge AI • Secure Access
        </p>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default RegisterPage;
