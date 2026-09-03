import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobMatches } from "../services/resumeService";

const JobMatchs = () => {
  const [matchingResult, setMatchingResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id: jobMatchesId } = useParams();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        console.log("Calling getJobMatches");
        const response = await getJobMatches(jobMatchesId);
        setMatchingResult(response);
      } catch (error) {
        setError(
          error?.response?.data?.message ||
          "Failed to load job matches"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [jobMatchesId]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
          <p className="text-slate-400">
            Finding suitable jobs...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  const jobMatches = matchingResult?.jobMatches || [];

  const overallRelevance =
    matchingResult?.overallRelevance ?? 0;

  const searchCriteria =
    matchingResult?.searchCriteria || {};

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                  AI Job Matching
                </span>

                <span className="text-xs text-slate-600">
                  {jobMatches.length} jobs analyzed
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Job Matches
              </h1>

              <p className="mt-2 max-w-2xl text-slate-400">
                Jobs ranked based on how closely they match
                your resume, skills, role, and experience.
              </p>
            </div>

          </div>
        </div>


        {/* ===================================================== */}
        {/* SEARCH CRITERIA */}
        {/* ===================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              🔎
            </div>

            <div>
              <h2 className="font-semibold">
                Search Criteria
              </h2>

              <p className="text-xs text-slate-500">
                Parameters used to find matching jobs
              </p>
            </div>
          </div>


          <div className="grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Role
              </p>

              <p className="mt-1 font-medium capitalize text-white">
                {searchCriteria.role || "Not specified"}
              </p>
            </div>


            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Location
              </p>

              <p className="mt-1 font-medium text-white">
                {searchCriteria.location || "Not specified"}
              </p>
            </div>


            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Country
              </p>

              <p className="mt-1 font-medium uppercase text-white">
                {searchCriteria.country || "Not specified"}
              </p>
            </div>

          </div>

        </div>


        {/* ===================================================== */}
        {/* OVERALL SCORE */}
        {/* ===================================================== */}

        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_2fr]">

          {/* Main Score */}

          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-900 p-6">

            <div className="relative z-10">

              <p className="text-sm font-medium text-slate-400">
                Overall Profile Relevance
              </p>

              <div className="mt-5 flex items-center gap-6">

                {/* Circular score */}

                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[8px] border-indigo-500/20">

                  <div className="absolute inset-0 rounded-full border-[8px] border-indigo-500 border-b-transparent border-l-transparent" />

                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {overallRelevance}%
                    </p>
                  </div>

                </div>


                <div>
                  <p className="text-lg font-semibold text-white">
                    {overallRelevance >= 80
                      ? "Excellent profile match"
                      : overallRelevance >= 60
                        ? "Good profile match"
                        : "Needs improvement"}
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-400">
                    Based on the overall relevance of
                    your profile to the selected job criteria.
                  </p>
                </div>

              </div>

            </div>

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

          </div>


          {/* Stats */}

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">
                Jobs Found
              </p>

              <p className="mt-3 text-3xl font-bold">
                {jobMatches.length}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                analyzed positions
              </p>
            </div>


            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">
                Excellent
              </p>

              <p className="mt-3 text-3xl font-bold text-emerald-400">
                {
                  jobMatches.filter(
                    (job) => job.overallScore >= 80
                  ).length
                }
              </p>

              <p className="mt-1 text-xs text-slate-500">
                80%+ match
              </p>
            </div>


            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">
                Best Match
              </p>

              <p className="mt-3 text-3xl font-bold text-indigo-400">
                {jobMatches.length
                  ? Math.max(
                    ...jobMatches.map(
                      (job) => job.overallScore
                    )
                  )
                  : 0}
                %
              </p>

              <p className="mt-1 text-xs text-slate-500">
                highest score
              </p>
            </div>


            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">
                Average
              </p>

              <p className="mt-3 text-3xl font-bold">
                {jobMatches.length
                  ? Math.round(
                    jobMatches.reduce(
                      (sum, job) =>
                        sum + job.overallScore,
                      0
                    ) / jobMatches.length
                  )
                  : 0}
                %
              </p>

              <p className="mt-1 text-xs text-slate-500">
                across all jobs
              </p>
            </div>

          </div>

        </div>


        {/* ===================================================== */}
        {/* JOB LIST */}
        {/* ===================================================== */}

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold">
              Recommended Jobs
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Ranked from highest to lowest compatibility
            </p>
          </div>

        </div>


        {jobMatches.length === 0 ? (

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl">
              🔍
            </div>

            <h3 className="text-lg font-semibold">
              No matching jobs found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search criteria.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {jobMatches.map((job, index) => (

              <JobMatchCard
                key={job.jobId}
                job={job}
                rank={index + 1}
              />

            ))}

          </div>

        )}

      </div>
    </div>
  );
};


/* ============================================================= */
/* JOB MATCH CARD */
/* ============================================================= */

const JobMatchCard = ({ job, rank }) => {

  const score = job.overallScore ?? 0;

  const scoreColor =
    score >= 80
      ? "emerald"
      : score >= 60
        ? "yellow"
        : "red";


  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all duration-200 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20">

      {/* ===================================================== */}
      {/* CARD HEADER */}
      {/* ===================================================== */}

      <div className="p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div className="flex gap-4">

            {/* Rank */}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-slate-400">
              #{rank}
            </div>


            <div>

              <div className="flex flex-wrap items-center gap-2">

                <h3 className="text-xl font-semibold text-white">
                  {job.jobTitle || "Unknown Role"}
                </h3>

                {score >= 90 && (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                    Top Match
                  </span>
                )}

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Job ID: {job.jobId}
              </p>

            </div>

          </div>


          {/* Score */}

          <div className="sm:text-right">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Match Score
            </p>

            <p
              className={`mt-1 text-3xl font-bold ${scoreColor === "emerald"
                  ? "text-emerald-400"
                  : scoreColor === "yellow"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
            >
              {score}%
            </p>

          </div>

        </div>


        {/* Progress */}

        <div className="mt-6">

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">

            <div
              className={`h-full rounded-full transition-all ${scoreColor === "emerald"
                  ? "bg-emerald-500"
                  : scoreColor === "yellow"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              style={{
                width: `${score}%`
              }}
            />

          </div>

        </div>


        {/* ===================================================== */}
        {/* MATCH BREAKDOWN */}
        {/* ===================================================== */}

        <div className="mt-6 grid gap-3 md:grid-cols-3">

          <ScoreBox
            title="Role Match"
            score={job.roleMatch?.score}
          />

          <ScoreBox
            title="Experience Match"
            score={job.experienceMatch?.score}
          />

          <ScoreBox
            title="Skill Match"
            score={job.skillMatch?.score}
          />

        </div>


        {/* ===================================================== */}
        {/* SUMMARY */}
        {/* ===================================================== */}

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-start gap-3">

            <div className="mt-0.5 text-indigo-400">
              ✦
            </div>

            <div>

              <h4 className="text-sm font-semibold text-white">
                AI Summary
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {job.summary || "No summary available."}
              </p>

            </div>

          </div>

        </div>


        {/* ===================================================== */}
        {/* SKILLS */}
        {/* ===================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Matched Skills */}

          <SkillSection
            title="Matched Skills"
            skills={job.skillMatch?.matched}
            type="matched"
          />


          {/* Missing Skills */}

          <SkillSection
            title="Skills to Improve"
            skills={job.skillMatch?.missing}
            type="missing"
          />

        </div>


        {/* ===================================================== */}
        {/* DETAILED ANALYSIS */}
        {/* ===================================================== */}

        <div className="mt-6 border-t border-slate-800 pt-6">

          <h4 className="mb-4 text-sm font-semibold text-white">
            Detailed Analysis
          </h4>


          <div className="grid gap-4 lg:grid-cols-2">

            <AnalysisItem
              title="Role Analysis"
              score={job.roleMatch?.score}
              reason={job.roleMatch?.reason}
            />

            <AnalysisItem
              title="Experience Analysis"
              score={job.experienceMatch?.score}
              reason={job.experienceMatch?.reason}
            />

          </div>


          {/* Skill Analysis */}

          {job.skillMatch?.reason && (
            <div className="mt-4 rounded-xl bg-slate-800/30 p-4">

              <div className="flex items-center justify-between">

                <h5 className="text-sm font-medium text-slate-300">
                  Skill Analysis
                </h5>

                <span className="text-sm font-semibold text-indigo-400">
                  {job.skillMatch?.score ?? 0}%
                </span>

              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {job.skillMatch.reason}
              </p>

            </div>
          )}

          {/* Job application URL */}

          <div>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Apply Now
              <span>↗</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};


/* ============================================================= */
/* SCORE BOX */
/* ============================================================= */

const ScoreBox = ({ title, score = 0 }) => {

  const percentage = score ?? 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-400">
          {title}
        </p>

        <p
          className={`text-lg font-bold ${percentage >= 80
              ? "text-emerald-400"
              : percentage >= 60
                ? "text-yellow-400"
                : "text-red-400"
            }`}
        >
          {percentage}%
        </p>

      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-700">

        <div
          className={`h-full rounded-full ${percentage >= 80
              ? "bg-emerald-500"
              : percentage >= 60
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          style={{
            width: `${percentage}%`
          }}
        />

      </div>

    </div>
  );
};


/* ============================================================= */
/* SKILL SECTION */
/* ============================================================= */

const SkillSection = ({ title, skills = [], type }) => {

  const isMatched = type === "matched";

  return (
    <div>

      <div className="mb-3 flex items-center gap-2">

        <span
          className={`h-2 w-2 rounded-full ${isMatched
              ? "bg-emerald-400"
              : "bg-red-400"
            }`}
        />

        <h4
          className={`text-sm font-medium ${isMatched
              ? "text-emerald-400"
              : "text-red-400"
            }`}
        >
          {title}
        </h4>

      </div>


      <div className="flex min-h-[42px] flex-wrap gap-2">

        {skills?.length > 0 ? (

          skills.map((skill, index) => (

            <span
              key={`${skill}-${index}`}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${isMatched
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-red-500/20 bg-red-500/10 text-red-400"
                }`}
            >
              {skill}
            </span>

          ))

        ) : (

          <span className="text-sm text-slate-600">
            None
          </span>

        )}

      </div>

    </div>
  );
};


/* ============================================================= */
/* ANALYSIS ITEM */
/* ============================================================= */

const AnalysisItem = ({ title, score, reason }) => {

  return (
    <div className="rounded-xl bg-slate-800/30 p-4">

      <div className="flex items-center justify-between">

        <h5 className="text-sm font-medium text-slate-300">
          {title}
        </h5>

        <span className="rounded-md bg-indigo-500/10 px-2 py-1 text-xs font-semibold text-indigo-400">
          {score ?? 0}%
        </span>

      </div>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {reason || "No analysis available."}
      </p>

    </div>
  );
};


export default JobMatchs;