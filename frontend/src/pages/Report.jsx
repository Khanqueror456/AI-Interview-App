import React from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from "react";
import { generateInterviewReport, getInterviewReport } from '../services/interviewService';

const Report = () => {

  const { id } = useParams();

  console.log(id);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchInterviewReport = async () => {
      try {

        let response = await getInterviewReport(id);

        if (response && Object.keys(response.skillBreakdown).length === 0) {
          response = await generateInterviewReport(id);
        }

        console.log("Interivew Report", response);
        setReport(response);

      } catch (error) {

        setError(
          error?.response?.data?.message || "Failed to load report"
        )

      } finally {
        setLoading(false);
      }
    }; fetchInterviewReport();
  }, [id]);

  if (error) {
    return <div>{error}</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6">

        <div className="mx-auto max-w-7xl animate-pulse">

          {/* Header */}
          <div className="mb-8">
            <div className="mb-5 h-4 w-32 rounded bg-slate-800" />

            <div className="h-9 w-72 rounded bg-slate-800" />

            <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-800" />
          </div>


          {/* Summary */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Score */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

              <div className="h-4 w-32 rounded bg-slate-800" />

              <div className="mt-6 flex justify-center">

                <div className="flex h-48 w-48 items-center justify-center rounded-full border-[12px] border-slate-800">

                  <div className="h-32 w-32 rounded-full bg-slate-800" />

                </div>

              </div>

            </div>


            {/* Correct Answers */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <div className="h-4 w-48 rounded bg-slate-800" />

              <div className="mt-5 h-12 w-24 rounded bg-slate-800" />

              <div className="mt-5 h-2 rounded-full bg-slate-800" />

              <div className="mt-3 h-3 w-32 rounded bg-slate-800" />

            </div>


            {/* Interview Details */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <div className="h-4 w-40 rounded bg-slate-800" />

              <div className="mt-6 space-y-5">

                <div className="flex justify-between">
                  <div className="h-4 w-20 rounded bg-slate-800" />
                  <div className="h-4 w-12 rounded bg-slate-800" />
                </div>

                <div className="flex justify-between">
                  <div className="h-4 w-20 rounded bg-slate-800" />
                  <div className="h-4 w-12 rounded bg-slate-800" />
                </div>

                <div className="flex justify-between">
                  <div className="h-4 w-20 rounded bg-slate-800" />
                  <div className="h-4 w-20 rounded bg-slate-800" />
                </div>

                <div className="flex justify-between">
                  <div className="h-4 w-24 rounded bg-slate-800" />
                  <div className="h-4 w-20 rounded bg-slate-800" />
                </div>

              </div>

            </div>

          </div>


          {/* Performance Metrics */}
          <div className="mt-6">

            <div className="mb-4 h-6 w-48 rounded bg-slate-800" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="h-4 w-28 rounded bg-slate-800" />

                  <div className="mt-3 h-9 w-16 rounded bg-slate-800" />

                  <div className="mt-2 h-3 w-24 rounded bg-slate-800" />
                </div>
              ))}

            </div>

          </div>


          {/* Skill Breakdown */}
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

            <div className="h-4 w-20 rounded bg-slate-800" />

            <div className="mt-2 h-6 w-48 rounded bg-slate-800" />

            <div className="mt-2 h-4 w-80 max-w-full rounded bg-slate-800" />


            <div className="mt-8 space-y-6">

              {[1, 2, 3, 4].map((item) => (

                <div key={item}>

                  <div className="mb-2 flex justify-between">

                    <div className="h-4 w-36 rounded bg-slate-800" />

                    <div className="h-4 w-10 rounded bg-slate-800" />

                  </div>

                  <div className="h-3 rounded-full bg-slate-800" />

                </div>

              ))}

            </div>

          </div>


          {/* Bottom buttons */}
          <div className="mt-8 flex justify-between">

            <div className="h-12 w-40 rounded-lg bg-slate-800" />

            <div className="h-12 w-48 rounded-lg bg-slate-800" />

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-7xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8">

          <button
            onClick={() => navigate("/")}
            className="mb-5 text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
                Interview Report
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white">
                {report?.interviewSummary?.role}
              </h1>

              <p className="mt-2 text-slate-400">
                Performance analysis of your completed interview
              </p>

            </div>


            {/* Interview Metadata */}
            <div className="flex flex-wrap gap-2">

              <span className="rounded-full bg-slate-800 px-3 py-1.5 text-sm capitalize text-slate-300">
                {report?.interviewSummary?.experience}
              </span>

              <span className="rounded-full bg-slate-800 px-3 py-1.5 text-sm capitalize text-slate-300">
                {report?.interviewSummary?.difficulty}
              </span>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm capitalize text-emerald-400">
                {report?.interviewSummary?.status}
              </span>

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* OVERALL SCORE + SUMMARY */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Score */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

            <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
              Overall Score
            </p>

            {(() => {
              const score = Math.round(
                (report?.interviewSummary?.overallScore /
                  (report?.interviewSummary?.totalQuestions * 10)) *
                100
              );

              return (
                <div className="mt-6 flex items-center justify-center">

                  {/* Outer score ring */}
                  <div
                    className="relative flex h-48 w-48 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(
              from -90deg,
              #6366f1 0% ${score}%,
              rgba(99, 102, 241, 0.2) ${score}% 100%
            )`,
                    }}
                  >

                    {/* Inner circle - creates the ring */}
                    <div className="absolute inset-[12px] rounded-full bg-slate-900" />

                    {/* Score text */}
                    <div className="relative z-10 text-center">

                      <p className="text-5xl font-bold text-white">
                        {score}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        out of 100
                      </p>

                    </div>

                  </div>

                </div>
              );
            })()}

            <p className="mt-6 text-center text-sm text-slate-400">
              Overall performance across all interview questions
            </p>

          </div>


          {/* Correct Answers */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-400">
              Questions Answered Correctly
            </p>

            <div className="mt-5 flex items-end gap-2">

              <span className="text-5xl font-bold text-emerald-400">
                {report?.interviewSummary?.correctlyAnswered}
              </span>

              <span className="mb-2 text-slate-500">
                / {report?.interviewSummary?.totalQuestions}
              </span>

            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${report?.performanceMetrics?.completionPercentage}%`
                }}
              />

            </div>

            <p className="mt-3 text-sm text-slate-400">
              {report?.performanceMetrics?.completionPercentage}% completion
            </p>

          </div>


          {/* Interview Info */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
              Interview Details
            </p>

            <div className="mt-5 space-y-4">

              <div className="flex justify-between">

                <span className="text-slate-400">
                  Questions
                </span>

                <span className="font-medium text-white">
                  {report?.interviewSummary?.totalQuestions}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-400">
                  Skipped
                </span>

                <span className="font-medium text-white">
                  {report?.performanceMetrics?.questionsSkipped}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-400">
                  Status
                </span>

                <span className="font-medium capitalize text-emerald-400">
                  {report?.interviewSummary?.status}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-400">
                  Completed On
                </span>

                <span className="font-medium text-white">
                  {report?.interviewSummary?.endedAt
                    ? new Date(
                      report.interviewSummary.endedAt
                    ).toLocaleDateString()
                    : "N/A"
                  }
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* PERFORMANCE METRICS */}
        {/* ================================================= */}

        <div className="mt-6">

          <h2 className="mb-4 text-xl font-semibold text-white">
            Performance Metrics
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Average */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Average Score
              </p>

              <p className="mt-3 text-3xl font-bold text-white">
                {report?.performanceMetrics?.avgScorePerQuestion}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                per question
              </p>

            </div>


            {/* Highest */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Highest Score
              </p>

              <p className="mt-3 text-3xl font-bold text-emerald-400">
                {report?.performanceMetrics?.highestScoreQuestion}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                best question
              </p>

            </div>


            {/* Lowest */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Lowest Score
              </p>

              <p className="mt-3 text-3xl font-bold text-red-400">
                {report?.performanceMetrics?.leastScoreQuestion}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                needs improvement
              </p>

            </div>


            {/* Skipped */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

              <p className="text-sm text-slate-400">
                Questions Skipped
              </p>

              <p className="mt-3 text-3xl font-bold text-white">
                {report?.performanceMetrics?.questionsSkipped}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                unanswered questions
              </p>

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* SKILL BREAKDOWN */}
        {/* ================================================= */}

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

          <div className="mb-6">

            <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
              Skills
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Skill Breakdown
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Your performance across the topics covered in this interview.
            </p>

          </div>


          <div className="space-y-6">

            {report?.skillBreakdown &&
              Object.entries(report.skillBreakdown).map(
                ([skill, score]) => (

                  <div key={skill}>

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-sm font-medium text-slate-300">
                        {skill}
                      </span>

                      <span className="text-sm font-semibold text-white">
                        {score}%
                      </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all"
                        style={{
                          width: `${score}%`
                        }}
                      />

                    </div>

                  </div>

                )
              )}

          </div>

        </div>


        {/* ================================================= */}
        {/* BOTTOM ACTIONS */}
        {/* ================================================= */}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">

          <button
            onClick={() => navigate("/")}
            className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:bg-slate-800"
          >
            ← Back to Dashboard
          </button>

          <button
            onClick={() => navigate(`/interviews/questions/${id}/analysis?question=1`)}
            className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500"
          >
            View Question Analysis →
          </button>

        </div>

      </div>

    </div>
  );
}

export default Report
