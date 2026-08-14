import React, { useEffect, useState, useRef } from 'react'
import { finishInterview, getInterview, pauseInterview, pauseInterviewOnExit, resumeInterview, skipCurrentQuestion, submitAnswer } from '../services/interviewService';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import api from '../services/api';

const Interview = () => {

  const [interview, setInterview] = useState({});
  const { id } = useParams();
  const { register, handleSubmit, formState: { isSubmitting }, setValue } = useForm();
  const [feedback, setFeedback] = useState(null);
  const [interviewSummary, setInterviewSummary] = useState(null)
  const [interviewStatus, setInterviewStatus] = useState(null);
  const navigate = useNavigate();

  const interviewStatusRef = useRef(null);

  useEffect(() => {
    interviewStatusRef.current = interviewStatus;
  }, [interviewStatus]);

  useEffect(() => {

    const pauseIfActive = () => {

      if (interviewStatusRef.current === "in-progress") {
        pauseInterviewOnExit(id);
      }

    };

    window.addEventListener("pagehide", pauseIfActive);

    return () => {

      window.removeEventListener("pagehide", pauseIfActive);

      pauseIfActive();

    };

  }, [id]);


  useEffect(() => {
    const fetchInterview = async () => {

      const response = await getInterview(id);

      setInterview(response);
      setInterviewStatus(response.status);
    };
    fetchInterview();
  }, [id])

  useEffect(() => {
    console.log(interview)
  }, [interview])

  useEffect(() => {
    console.log(interviewStatus)
  }, [interviewStatus]);

  if (!interview) {
    return <div>Loading...</div>;
  }

  const onSubmit = async (data) => {

    if (data.answer.trim() === "") {
      return;
    }

    const id = interview._id;
    const response = await submitAnswer(id, data);

    setFeedback(response.feedback);
  }

  const nextQuestion = async () => {
    setFeedback(null);
    setValue("answer", "");
    const response = await getInterview(id);

    setInterview(response);
    
  }

  const skipHandler = async () => {

    setValue("answer", "");
    const response = await skipCurrentQuestion(id);

    if (interview?.currentQuestionsIndex >=
        interview?.questions?.length - 1)
    {
         await finishInterviewHandler();
    }
    setInterview(response);

  }

  const handleResume = async () => {

    console.log()
    const response = await resumeInterview(id);
    setInterviewStatus(response.status);

  }

  const handlePause = async () => {

    const response = await pauseInterview(id);
    setInterviewStatus(response.status);
  }

  const handleBack = () => {
    leavingIntentionally.current = true;
    navigate("/");
  };

  const finishInterviewHandler = async () => {

    const response = await finishInterview(interview._id);
    setInterviewSummary(response);
  }

  if (interviewSummary) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6">

        <div className="mx-auto max-w-3xl">

          {/* Completion Header */}
          <div className="mb-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl">
              ✓
            </div>

            <h1 className="mt-5 text-3xl font-bold text-white">
              Interview Completed
            </h1>

            <p className="mt-2 text-slate-400">
              Great job! Here's a quick summary of your performance.
            </p>

          </div>


          {/* Score Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

            <div className="text-center">

              <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
                Overall Score
              </p>

              <p className="mt-3 text-6xl font-bold text-white">
                {(interviewSummary?.overallScore / (interviewSummary?.totalQuestions * 10)) * 100}%
              </p>

            </div>


            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="rounded-xl bg-slate-800/70 p-5 text-center">

                <p className="text-sm text-slate-400">
                  Correct Answers
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-400">
                  {interviewSummary?.correctlyAnswered}
                </p>

              </div>


              <div className="rounded-xl bg-slate-800/70 p-5 text-center">

                <p className="text-sm text-slate-400">
                  Total Questions
                </p>

                <p className="mt-2 text-3xl font-bold text-white">
                  {interviewSummary?.totalQuestions}
                </p>

              </div>

            </div>


            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

              <button
                onClick={() => navigate("/")}
                className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500"
              >
                Back to Dashboard
              </button>

              <button
                onClick={() => navigate(`/interviews/${id}/report`)}
                className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:bg-slate-800"
              >
                View Detailed Report
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-5xl">

        {/* Interview Header */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-xl font-bold text-white">
                {interview?.targetRole} Interview
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                {interview?.experienceLevel} ·{" "}
                {interview?.difficulty}
              </p>
            </div>

            <div className="flex items-center gap-4">

              {/* Question Counter */}
              <div className="text-right">

                <p className="text-xs text-slate-400">
                  Question
                </p>

                <p className="text-lg font-semibold text-white">
                  {Math.min(
                    (interview?.currentQuestionsIndex ?? 0) + 1,
                    interview?.questions?.length ?? 0
                  )}
                  {" / "}
                  {interview?.questions?.length ?? 0}
                </p>

              </div>


              {/* Status */}
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${interviewStatus === "in-progress"
                  ? "bg-indigo-500/10 text-indigo-400"
                  : interviewStatus === "pending"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-slate-700 text-slate-300"
                  }`}
              >
                {interviewStatus}
              </span>

            </div>

          </div>

        </div>


        {/* Question */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

          <div className="mb-6">

            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-indigo-400">
              Question
            </p>

            <h2 className="text-xl font-semibold leading-relaxed text-white sm:text-2xl">
              {interview?.questions?.[
                interview?.currentQuestionsIndex
              ]?.question}
            </h2>

          </div>


          {/* Answer */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Your Answer
              </label>

              <textarea
                rows="9"
                placeholder="Explain your answer here..."
                {...register("answer")}
                className="w-full resize-y rounded-xl border border-slate-700 bg-slate-800 px-4 py-4 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

            </div>


            <div className="flex justify-end">

              <button
                disabled={
                  interviewStatus !== "in-progress" || isSubmitting
                }
                type="submit"
                className="disabled:opacity-40 disabled:cursor-not-allowed rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500"
              >
                Submit Answer
              </button>

            </div>

          </form>

        </div>


        {/* Feedback */}
        {isSubmitting ? (

          <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-slate-900 p-8">

            <div className="flex flex-col items-center justify-center text-center">

              {/* Spinner */}
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />

              <h3 className="mt-5 text-lg font-semibold text-white">
                Analysing your answer
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-400">
                Our AI is evaluating your answer based on accuracy,
                relevance, and the requirements of the role.
              </p>

            </div>

          </div>

        ) : feedback ? (

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
                  AI Feedback
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  Your Performance
                </h2>

              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-indigo-500 text-xl font-bold text-white">
                {feedback.score}
              </div>

            </div>

            <div className="mt-6 rounded-xl bg-slate-800/60 p-5">

              <p className="leading-relaxed text-slate-300">
                {feedback.feedback}
              </p>

            </div>

          </div>

        ) : null}


        {/* Controls */}
        {/* Controls */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Left side */}
          <div className="flex gap-3">

            {/* Pause */}
            <button
              onClick={handlePause}
              disabled={interviewStatus !== "in-progress"}
              className="rounded-lg border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Pause Interview
            </button>

            {/* Resume */}
            <button
              onClick={handleResume}
              disabled={interviewStatus !== "pending"}
              className="rounded-lg border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Resume Interview
            </button>

          </div>


          {/* Right side */}
          <div className="flex gap-3">

            {/* Skip Question */}

            <button
              onClick={skipHandler}
              disabled={
                interview?.currentQuestionsIndex >=
                interview?.questions?.length ||
                interviewStatus !== "in-progress" ||
                isSubmitting
              }
              className="rounded-lg border border-slate-600 bg-slate-800 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Skip Question
            </button>

            {/* Next */}
            <button
              onClick={nextQuestion}
              disabled={
                (interview?.currentQuestionsIndex >=
                  interview?.questions?.length - 1) || interviewStatus !== "in-progress" || isSubmitting
              }
              className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next Question
            </button>


            {/* Finish */}
            <button
              onClick={finishInterviewHandler}
              disabled={
                !(
                  interview?.currentQuestionsIndex >=
                  interview?.questions?.length - 1
                )
              }
              className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Finish
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Interview
