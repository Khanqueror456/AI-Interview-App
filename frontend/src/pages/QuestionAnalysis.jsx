import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getInterview, getQuestionAnalysis } from '../services/interviewService';

const QuestionAnalysis = () => {

  const { id } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const questionNumber =
    Number(searchParams.get("question")) || 0;

  const currentQuestionIndex = questionNumber - 1;


  const [questionAnalysis, setQuestionAnalysis] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interview, setInterview] = useState(null);
  const navigate = useNavigate();

  const {
    question,
    answer,
    feedback,
    score,
    idealAnswer
  } = questionAnalysis;

  useEffect(() => {

    const fetchQuestionAnalysis = async () => {

      try {

        const response = await getQuestionAnalysis(id, currentQuestionIndex);
        setQuestionAnalysis(response.analysis);

        const response2 = await getInterview(id);
        setInterview(response2);

      } catch (error) {

        setError(error?.response?.data?.message || "Failed to load question analysis");

      } finally {

        setLoading(false);

      }
    }; fetchQuestionAnalysis();
  }, [id, currentQuestionIndex]);


  const handleNext = () => {

    setSearchParams({
      question: String(questionNumber + 1)
    });

  };

  const handlePrevious = () => {

    setSearchParams({
        question: String(questionNumber - 1)
    });

};

  const handleBackToReport = () => {
    navigate(`/interviews/${id}/report`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />

          <p className="mt-4 text-sm text-slate-400">
            Loading question analysis...
          </p>

        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">

        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900 p-8 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-xl text-red-400">
            !
          </div>

          <h2 className="mt-4 text-xl font-semibold text-white">
            Unable to load analysis
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {error}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-5xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <button
            onClick={() => {handleBackToReport()}}
            className="mb-5 text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Report
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
                Question Analysis
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white">
                Detailed Answer Review
              </h1>

            </div>

            {/* Question Number */}

            <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300">
              Question {currentQuestionIndex + 1}
            </div>

          </div>

        </div>


        {/* ================= QUESTION ================= */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

          <div className="mb-4 flex items-center justify-between">

            <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
              Interview Question
            </p>

          </div>

          <h2 className="text-xl font-semibold leading-relaxed text-white sm:text-2xl">
            {question}
          </h2>

        </section>


        {/* ================= SCORE ================= */}

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Score */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-400">
              Score
            </p>

            <div className="mt-3 flex items-end gap-2">

              <span className="text-4xl font-bold text-indigo-400">
                {score}
              </span>

              <span className="mb-1 text-sm text-slate-500">
                points
              </span>

            </div>

          </div>


          {/* Question */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-400">
              Question
            </p>

            <p className="mt-3 text-4xl font-bold text-white">
              {currentQuestionIndex + 1}
            </p>

          </div>


          {/* Status */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-400">
              Evaluation
            </p>

            <div className="mt-3 flex items-center gap-2">

              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <span className="font-medium text-emerald-400">
                Evaluated
              </span>

            </div>

          </div>

        </section>


        {/* ================= YOUR ANSWER ================= */}

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

          <div className="mb-5">

            <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
              Your Answer
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              What you submitted
            </h2>

          </div>

          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5">

            <p className="whitespace-pre-wrap leading-7 text-slate-300">
              {answer || "No answer was provided."}
            </p>

          </div>

        </section>


        {/* ================= AI FEEDBACK ================= */}

        <section className="mt-6 rounded-2xl border border-indigo-500/20 bg-slate-900 p-6 sm:p-8">

          <div className="mb-5">

            <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
              AI Feedback
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Evaluation of your answer
            </h2>

          </div>

          <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-5">

            <p className="whitespace-pre-wrap leading-7 text-slate-300">
              {feedback}
            </p>

          </div>

        </section>


        {/* ================= IDEAL ANSWER ================= */}

        <section className="mt-6 rounded-2xl border border-emerald-500/20 bg-slate-900 p-6 sm:p-8">

          <div className="mb-5">

            <p className="text-sm font-medium uppercase tracking-wider text-emerald-400">
              Ideal Answer
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              What a strong answer could look like
            </h2>

          </div>

          <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-5">

            <p className="whitespace-pre-wrap leading-7 text-slate-300">
              {idealAnswer}
            </p>

          </div>

        </section>


        {/* ================= NAVIGATION ================= */}

        <div className="mt-8 flex items-center justify-between gap-4">

          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="rounded-lg border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>


          <button
            onClick={() => {handleBackToReport()}}
            className="hidden rounded-lg border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800 sm:block"
          >
            Back to Report
          </button>


          <button
            onClick={handleNext}
            className="rounded-lg bg-indigo-600 disabled:bg-indigo-600/40 disabled:text-white/40 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
            disabled={currentQuestionIndex === interview?.questions?.length - 1}
          >
            Next →
          </button>

        </div>

      </div>

    </div>
  );
}

export default QuestionAnalysis;
