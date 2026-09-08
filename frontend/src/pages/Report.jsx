import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generateInterviewReport, getInterviewReport } from "../services/interviewService";
import { animate, stagger } from "animejs";
import {
  ArrowLeft,
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  Home,
  Layers,
  Target,
  TrendingUp,
  TrendingDown,
  SkipForward,
  Calendar,
  Briefcase,
  Zap,
  Sparkles,
} from "lucide-react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Report – displays an interview report with scores, metrics, and skill breakdown.
 * All sections animate in with a staggered effect.
 */
export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for animated sections
  const headerRef = useRef(null);
  const summaryRef = useRef(null);
  const metricsRef = useRef(null);
  const skillRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const fetchInterviewReport = async () => {
      try {
        let response = await getInterviewReport(id);
        if (response && Object.keys(response.skillBreakdown || {}).length === 0) {
          response = await generateInterviewReport(id);
        }
        setReport(response);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviewReport();
  }, [id]);

  // Animate sections on mount
  useEffect(() => {
    if (loading || error || !report) return;
    const reduced = prefersReducedMotion();

    const sections = [
      headerRef,
      summaryRef,
      metricsRef,
      skillRef,
      actionsRef,
    ].filter((ref) => ref.current);

    animate(sections.map((ref) => ref.current), {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: reduced ? 0 : 500,
      delay: reduced ? 0 : stagger(100, { start: 80 }),
      ease: "outQuad",
    });
  }, [loading, error, report]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center px-4">
        <div className="bg-white border border-[#D8D9D3] rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-[#14213D]">Unable to load report</h2>
          <p className="text-[#6B7280] mt-2">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-[#14213D] text-white rounded-lg hover:bg-[#24304F] transition-colors"
          >
            <Home size={16} /> Go Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  // Compute overall score percentage
  const totalQuestions = report?.interviewSummary?.totalQuestions || 0;
  const overallScore = report?.interviewSummary?.overallScore || 0;
  const scorePercent = totalQuestions > 0 ? overallScore : 0;

  const scoreColor =
    scorePercent >= 80 ? "#3B7A57" : scorePercent >= 60 ? "#E8A33D" : "#C24444";

  return (
    <div className="min-h-screen bg-[#F7F7F4] py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ===== HEADER ===== */}
        <div ref={headerRef} style={{ opacity: 0 }} className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#14213D] transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#E8A33D] flex items-center gap-2">
                <FileText size={16} /> Interview Report
              </p>
              <h1 className="text-3xl font-bold text-[#14213D] font-['Lora',_Georgia,_serif]">
                {report?.interviewSummary?.role || "Interview"}
              </h1>
              <p className="text-[#6B7280] mt-1">
                Performance analysis of your completed interview
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {report?.interviewSummary?.experience && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E7EAF3] text-[#14213D] text-sm rounded-full">
                  <Briefcase size={14} /> {report.interviewSummary.experience}
                </span>
              )}
              {report?.interviewSummary?.difficulty && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FBEEDA] text-[#C9822A] text-sm rounded-full">
                  <Zap size={14} /> {report.interviewSummary.difficulty}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E3F0E8] text-[#3B7A57] text-sm rounded-full">
                <CheckCircle size={14} /> {report?.interviewSummary?.status || "Completed"}
              </span>
            </div>
          </div>
        </div>

        {/* ===== SUMMARY CARDS ===== */}
        <div
          ref={summaryRef}
          style={{ opacity: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Score Card */}
          <div className="bg-white border border-[#D8D9D3] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#E8A33D]/5 blur-3xl" />
            <p className="text-sm font-medium text-[#6B7280]">Overall Score</p>
            <div className="mt-6 flex justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="42%"
                    fill="none"
                    stroke="#EDEEEA"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="42%"
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${scorePercent * 2.64} 264`}
                    style={{ transition: "stroke-dasharray 0.8s ease-out" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-[#14213D]">{scorePercent}</span>
                  <span className="text-sm text-[#6B7280]">out of 100</span>
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-[#6B7280]">
              Overall performance across all interview questions
            </p>
          </div>

          {/* Correct Answers */}
          <div className="bg-white border border-[#D8D9D3] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-[#6B7280] flex items-center gap-2">
              <CheckCircle size={16} className="text-[#3B7A57]" /> Questions Answered Correctly
            </p>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-5xl font-bold text-[#3B7A57]">
                {report?.interviewSummary?.correctlyAnswered || 0}
              </span>
              <span className="mb-2 text-[#6B7280]">
                / {totalQuestions}
              </span>
            </div>
            <div className="mt-5 h-2 bg-[#EDEEEA] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#3B7A57] transition-all"
                style={{ width: `${report?.performanceMetrics?.completionPercentage || 0}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-[#6B7280]">
              {report?.performanceMetrics?.completionPercentage || 0}% completion
            </p>
          </div>

          {/* Interview Details */}
          <div className="bg-white border border-[#D8D9D3] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-[#6B7280] flex items-center gap-2">
              <FileText size={16} /> Interview Details
            </p>
            <div className="mt-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Questions</span>
                <span className="font-medium text-[#14213D]">{totalQuestions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Skipped</span>
                <span className="font-medium text-[#14213D]">
                  {report?.performanceMetrics?.questionsSkipped || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Status</span>
                <span className="font-medium capitalize text-[#3B7A57]">
                  {report?.interviewSummary?.status || "Completed"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Completed On</span>
                <span className="font-medium text-[#14213D]">
                  {report?.interviewSummary?.endedAt
                    ? new Date(report.interviewSummary.endedAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== PERFORMANCE METRICS ===== */}
        <div ref={metricsRef} style={{ opacity: 0 }} className="mb-8">
          <h2 className="text-xl font-semibold text-[#14213D] flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-[#E8A33D]" /> Performance Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={<TrendingUp size={18} className="text-[#14213D]" />}
              label="Average Score"
              value={report?.performanceMetrics?.avgScorePerQuestion || 0}
              subtext="per question"
              bg="bg-[#E7EAF3]"
            />
            <MetricCard
              icon={<Award size={18} className="text-[#3B7A57]" />}
              label="Highest Score"
              value={report?.performanceMetrics?.highestScoreQuestion || 0}
              subtext="best question"
              bg="bg-[#E3F0E8]"
              valueColor="text-[#3B7A57]"
            />
            <MetricCard
              icon={<TrendingDown size={18} className="text-[#C24444]" />}
              label="Lowest Score"
              value={report?.performanceMetrics?.leastScoreQuestion || 0}
              subtext="needs improvement"
              bg="bg-[#FEE8E8]"
              valueColor="text-[#C24444]"
            />
            <MetricCard
              icon={<SkipForward size={18} className="text-[#C9822A]" />}
              label="Questions Skipped"
              value={report?.performanceMetrics?.questionsSkipped || 0}
              subtext="unanswered questions"
              bg="bg-[#FBEEDA]"
              valueColor="text-[#C9822A]"
            />
          </div>
        </div>

        {/* ===== SKILL BREAKDOWN ===== */}
        <div ref={skillRef} style={{ opacity: 0 }} className="bg-white border border-[#D8D9D3] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <Layers size={20} className="text-[#E8A33D]" />
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#E8A33D]">Skills</p>
              <h2 className="text-xl font-semibold text-[#14213D]">Skill Breakdown</h2>
              <p className="text-sm text-[#6B7280]">
                Your performance across the topics covered in this interview.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {report?.skillBreakdown && Object.keys(report.skillBreakdown).length > 0 ? (
              Object.entries(report.skillBreakdown).map(([skill, score]) => {
                const color = score >= 80 ? "#3B7A57" : score >= 60 ? "#E8A33D" : "#C24444";
                return (
                  <div key={skill}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#14213D]">{skill}</span>
                      <span className="text-sm font-semibold" style={{ color }}>{score}%</span>
                    </div>
                    <div className="h-2.5 bg-[#EDEEEA] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${score}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-[#6B7280]">No skill breakdown available.</p>
            )}
          </div>
        </div>

        {/* ===== ACTIONS ===== */}
        <div ref={actionsRef} style={{ opacity: 0 }} className="mt-8 flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#D8D9D3] text-[#14213D] rounded-lg hover:bg-[#F7F7F4] transition-colors font-medium"
          >
            <Home size={16} /> Back to Dashboard
          </button>
          <button
            onClick={() => navigate(`/interviews/questions/${id}/analysis?question=1`)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#14213D] text-white rounded-lg hover:bg-[#24304F] transition-colors font-medium"
          >
            <Sparkles size={16} /> View Question Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Helper Components =====

const MetricCard = ({ icon, label, value, subtext, bg, valueColor = "text-[#14213D]" }) => (
  <div className="bg-white border border-[#D8D9D3] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-sm text-[#6B7280]">{label}</p>
    <p className={`mt-2 text-3xl font-bold ${valueColor}`}>{value}</p>
    <p className="mt-1 text-xs text-[#6B7280]">{subtext}</p>
  </div>
);

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#F7F7F4] py-10 px-4 sm:px-6">
    <div className="max-w-7xl mx-auto animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="w-32 h-4 bg-[#D8D9D3] rounded mb-4" />
        <div className="w-64 h-8 bg-[#D8D9D3] rounded" />
        <div className="w-96 h-4 bg-[#D8D9D3] rounded mt-2" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-[#D8D9D3] rounded-2xl p-8 h-72" />
        ))}
      </div>

      {/* Metrics */}
      <div className="mb-8">
        <div className="w-48 h-6 bg-[#D8D9D3] rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-[#D8D9D3] rounded-xl p-5 h-32" />
          ))}
        </div>
      </div>

      {/* Skill breakdown */}
      <div className="bg-white border border-[#D8D9D3] rounded-2xl p-6 sm:p-8">
        <div className="w-40 h-5 bg-[#D8D9D3] rounded mb-6" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <div className="w-32 h-4 bg-[#D8D9D3] rounded" />
                <div className="w-12 h-4 bg-[#D8D9D3] rounded" />
              </div>
              <div className="h-2.5 bg-[#EDEEEA] rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-between">
        <div className="w-40 h-12 bg-[#D8D9D3] rounded-lg" />
        <div className="w-56 h-12 bg-[#D8D9D3] rounded-lg" />
      </div>
    </div>
  </div>
);