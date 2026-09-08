import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getInterview, getQuestionAnalysis } from "../services/interviewService";
import { animate, stagger } from "animejs";
import {
  ArrowLeft,
  FileText,
  Target,
  CheckCircle,
  User,
  Sparkles,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3,
  HelpCircle,
} from "lucide-react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * QuestionAnalysis – detailed review of a single interview question.
 * Sections animate in with a staggered effect.
 */
export default function QuestionAnalysis() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const questionNumber = Number(searchParams.get("question")) || 0;
  const currentQuestionIndex = questionNumber - 1;

  const [questionAnalysis, setQuestionAnalysis] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interview, setInterview] = useState(null);

  const { question, answer, feedback, score, idealAnswer } = questionAnalysis;

  // Refs for animated sections
  const headerRef = useRef(null);
  const questionRef = useRef(null);
  const statsRef = useRef(null);
  const answerRef = useRef(null);
  const feedbackRef = useRef(null);
  const idealRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const fetchQuestionAnalysis = async () => {
      try {
        const [analysisRes, interviewRes] = await Promise.all([
          getQuestionAnalysis(id, currentQuestionIndex),
          getInterview(id),
        ]);
        setQuestionAnalysis(analysisRes.analysis);
        setInterview(interviewRes);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load question analysis");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionAnalysis();
  }, [id, currentQuestionIndex]);

  // Animate sections on mount
  useEffect(() => {
    if (loading || error || !questionAnalysis || !interview) return;
    const reduced = prefersReducedMotion();

    const sections = [
      headerRef,
      questionRef,
      statsRef,
      answerRef,
      feedbackRef,
      idealRef,
      navRef,
    ].filter((ref) => ref.current);

    animate(sections.map((ref) => ref.current), {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: reduced ? 0 : 500,
      delay: reduced ? 0 : stagger(80, { start: 100 }),
      ease: "outQuad",
    });
  }, [loading, error, questionAnalysis, interview]);

  const handleNext = () => {
    setSearchParams({ question: String(questionNumber + 1) });
  };

  const handlePrevious = () => {
    setSearchParams({ question: String(questionNumber - 1) });
  };

  const handleBackToReport = () => {
    navigate(`/interviews/${id}/report`);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center px-4">
        <div className="bg-white border border-[#D8D9D3] rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-[#14213D]">Unable to load analysis</h2>
          <p className="text-[#6B7280] mt-2">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-[#14213D] text-white rounded-lg hover:bg-[#24304F] transition-colors"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* ===== HEADER ===== */}
        <div ref={headerRef} style={{ opacity: 0 }} className="mb-8">
          <button
            onClick={handleBackToReport}
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#14213D] transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Back to Report
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#E8A33D] flex items-center gap-2">
                <BarChart3 size={16} /> Question Analysis
              </p>
              <h1 className="text-3xl font-bold text-[#14213D] font-['Lora',_Georgia,_serif]">
                Detailed Answer Review
              </h1>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E7EAF3] text-[#14213D] rounded-full text-sm font-medium border border-[#D8D9D3]">
              <HelpCircle size={16} />
              Question {currentQuestionIndex + 1}
            </div>
          </div>
        </div>

        {/* ===== QUESTION ===== */}
        <div
          ref={questionRef}
          style={{ opacity: 0 }}
          className="bg-white border border-[#D8D9D3] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow mb-6"
        >
          <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-3">
            <HelpCircle size={16} className="text-[#E8A33D]" />
            Interview Question
          </div>
          <h2 className="text-xl font-semibold text-[#14213D] leading-relaxed">
            {question}
          </h2>
        </div>

        {/* ===== STATS ===== */}
        <div
          ref={statsRef}
          style={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white border border-[#D8D9D3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-[#6B7280] flex items-center gap-2">
              <Target size={16} className="text-[#E8A33D]" /> Score
            </p>
            <div className="mt-2 flex items-end gap-1">
              <span className="text-4xl font-bold text-[#14213D]">{score || 0}</span>
              <span className="text-sm text-[#6B7280] mb-1">points</span>
            </div>
          </div>
          <div className="bg-white border border-[#D8D9D3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-[#6B7280] flex items-center gap-2">
              <HelpCircle size={16} className="text-[#6B7280]" /> Question
            </p>
            <p className="mt-2 text-4xl font-bold text-[#14213D]">
              {currentQuestionIndex + 1}
            </p>
          </div>
          <div className="bg-white border border-[#D8D9D3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-[#6B7280] flex items-center gap-2">
              <CheckCircle size={16} className="text-[#3B7A57]" /> Evaluation
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B7A57]" />
              <span className="font-medium text-[#3B7A57]">Evaluated</span>
            </div>
          </div>
        </div>

        {/* ===== YOUR ANSWER ===== */}
        <div
          ref={answerRef}
          style={{ opacity: 0 }}
          className="bg-white border border-[#D8D9D3] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-[#14213D]" />
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#6B7280]">Your Answer</p>
              <p className="text-sm text-[#6B7280]">What you submitted</p>
            </div>
          </div>
          <div className="bg-[#F7F7F4] rounded-xl p-5 border border-[#D8D9D3]">
            <p className="whitespace-pre-wrap leading-7 text-[#14213D]">
              {answer || "No answer was provided."}
            </p>
          </div>
        </div>

        {/* ===== AI FEEDBACK ===== */}
        <div
          ref={feedbackRef}
          style={{ opacity: 0 }}
          className="bg-white border border-[#E8A33D]/30 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-[#E8A33D]" />
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#E8A33D]">AI Feedback</p>
              <p className="text-sm text-[#6B7280]">Evaluation of your answer</p>
            </div>
          </div>
          <div className="bg-[#FBF7F0] rounded-xl p-5 border border-[#E8A33D]/20">
            <p className="whitespace-pre-wrap leading-7 text-[#14213D]">
              {feedback}
            </p>
          </div>
        </div>

        {/* ===== IDEAL ANSWER ===== */}
        <div
          ref={idealRef}
          style={{ opacity: 0 }}
          className="bg-white border border-[#3B7A57]/30 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={18} className="text-[#3B7A57]" />
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#3B7A57]">Ideal Answer</p>
              <p className="text-sm text-[#6B7280]">What a strong answer could look like</p>
            </div>
          </div>
          <div className="bg-[#F0F7F4] rounded-xl p-5 border border-[#3B7A57]/20">
            <p className="whitespace-pre-wrap leading-7 text-[#14213D]">
              {idealAnswer}
            </p>
          </div>
        </div>

        {/* ===== NAVIGATION ===== */}
        <div
          ref={navRef}
          style={{ opacity: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mt-8"
        >
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="inline-flex items-center gap-2 px-5 py-3 border border-[#D8D9D3] rounded-lg text-[#14213D] font-medium hover:bg-[#F7F7F4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} /> Previous
          </button>

          <button
            onClick={handleBackToReport}
            className="inline-flex items-center gap-2 px-5 py-3 border border-[#D8D9D3] rounded-lg text-[#14213D] font-medium hover:bg-[#F7F7F4] transition-colors hidden sm:flex"
          >
            <Home size={18} /> Back to Report
          </button>

          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === (interview?.questions?.length || 0) - 1}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#14213D] text-white rounded-lg font-medium hover:bg-[#24304F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Loading Skeleton =====
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#F7F7F4] py-10 px-4 sm:px-6">
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="w-32 h-4 bg-[#D8D9D3] rounded mb-4" />
        <div className="w-64 h-8 bg-[#D8D9D3] rounded" />
        <div className="w-48 h-6 bg-[#D8D9D3] rounded mt-2" />
      </div>

      {/* Question card */}
      <div className="bg-white border border-[#D8D9D3] rounded-2xl p-6 sm:p-8 mb-6 h-32" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-[#D8D9D3] rounded-2xl p-5 h-24" />
        ))}
      </div>

      {/* Answer, Feedback, Ideal */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-[#D8D9D3] rounded-2xl p-6 sm:p-8 mb-6 h-48" />
      ))}

      {/* Navigation */}
      <div className="flex justify-between">
        <div className="w-28 h-12 bg-[#D8D9D3] rounded-lg" />
        <div className="w-40 h-12 bg-[#D8D9D3] rounded-lg hidden sm:block" />
        <div className="w-28 h-12 bg-[#D8D9D3] rounded-lg" />
      </div>
    </div>
  </div>
);