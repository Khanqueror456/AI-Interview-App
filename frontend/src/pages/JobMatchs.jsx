// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getJobMatches } from "../services/resumeService";

// const JobMatchs = () => {
//   const [matchingResult, setMatchingResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { id: jobMatchesId } = useParams();

//   useEffect(() => {
//     const fetchMatches = async () => {
//       try {
//         console.log("Calling getJobMatches");
//         const response = await getJobMatches(jobMatchesId);
//         setMatchingResult(response);
//       } catch (error) {
//         setError(
//           error?.response?.data?.message ||
//           "Failed to load job matches"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatches();
//   }, [jobMatchesId]);

//   if (loading) {
//     return (
//       <div className="flex min-h-[500px] items-center justify-center bg-slate-950">
//         <div className="text-center">
//           <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
//           <p className="text-slate-400">
//             Finding suitable jobs...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-slate-950 px-6 py-8">
//         <div className="mx-auto max-w-6xl rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   const jobMatches = matchingResult?.jobMatches || [];

//   const overallRelevance =
//     matchingResult?.overallRelevance ?? 0;

//   const searchCriteria =
//     matchingResult?.searchCriteria || {};

//   return (
//     <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">

//         {/* ===================================================== */}
//         {/* HEADER */}
//         {/* ===================================================== */}

//         <div className="mb-8">
//           <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

//             <div>
//               <div className="mb-3 flex items-center gap-2">
//                 <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
//                   AI Job Matching
//                 </span>

//                 <span className="text-xs text-slate-600">
//                   {jobMatches.length} jobs analyzed
//                 </span>
//               </div>

//               <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
//                 Job Matches
//               </h1>

//               <p className="mt-2 max-w-2xl text-slate-400">
//                 Jobs ranked based on how closely they match
//                 your resume, skills, role, and experience.
//               </p>
//             </div>

//           </div>
//         </div>


//         {/* ===================================================== */}
//         {/* SEARCH CRITERIA */}
//         {/* ===================================================== */}

//         <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

//           <div className="mb-4 flex items-center gap-2">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
//               🔎
//             </div>

//             <div>
//               <h2 className="font-semibold">
//                 Search Criteria
//               </h2>

//               <p className="text-xs text-slate-500">
//                 Parameters used to find matching jobs
//               </p>
//             </div>
//           </div>


//           <div className="grid gap-4 sm:grid-cols-3">

//             <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
//               <p className="text-xs uppercase tracking-wider text-slate-500">
//                 Role
//               </p>

//               <p className="mt-1 font-medium capitalize text-white">
//                 {searchCriteria.role || "Not specified"}
//               </p>
//             </div>


//             <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
//               <p className="text-xs uppercase tracking-wider text-slate-500">
//                 Location
//               </p>

//               <p className="mt-1 font-medium text-white">
//                 {searchCriteria.location || "Not specified"}
//               </p>
//             </div>


//             <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
//               <p className="text-xs uppercase tracking-wider text-slate-500">
//                 Country
//               </p>

//               <p className="mt-1 font-medium uppercase text-white">
//                 {searchCriteria.country || "Not specified"}
//               </p>
//             </div>

//           </div>

//         </div>


//         {/* ===================================================== */}
//         {/* OVERALL SCORE */}
//         {/* ===================================================== */}

//         <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_2fr]">

//           {/* Main Score */}

//           <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-900 p-6">

//             <div className="relative z-10">

//               <p className="text-sm font-medium text-slate-400">
//                 Overall Profile Relevance
//               </p>

//               <div className="mt-5 flex items-center gap-6">

//                 {/* Circular score */}

//                 <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[8px] border-indigo-500/20">

//                   <div className="absolute inset-0 rounded-full border-[8px] border-indigo-500 border-b-transparent border-l-transparent" />

//                   <div className="text-center">
//                     <p className="text-2xl font-bold">
//                       {overallRelevance}%
//                     </p>
//                   </div>

//                 </div>


//                 <div>
//                   <p className="text-lg font-semibold text-white">
//                     {overallRelevance >= 80
//                       ? "Excellent profile match"
//                       : overallRelevance >= 60
//                         ? "Good profile match"
//                         : "Needs improvement"}
//                   </p>

//                   <p className="mt-1 text-sm leading-5 text-slate-400">
//                     Based on the overall relevance of
//                     your profile to the selected job criteria.
//                   </p>
//                 </div>

//               </div>

//             </div>

//             <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

//           </div>


//           {/* Stats */}

//           <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">

//             <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//               <p className="text-sm text-slate-500">
//                 Jobs Found
//               </p>

//               <p className="mt-3 text-3xl font-bold">
//                 {jobMatches.length}
//               </p>

//               <p className="mt-1 text-xs text-slate-500">
//                 analyzed positions
//               </p>
//             </div>


//             <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//               <p className="text-sm text-slate-500">
//                 Excellent
//               </p>

//               <p className="mt-3 text-3xl font-bold text-emerald-400">
//                 {
//                   jobMatches.filter(
//                     (job) => job.overallScore >= 80
//                   ).length
//                 }
//               </p>

//               <p className="mt-1 text-xs text-slate-500">
//                 80%+ match
//               </p>
//             </div>


//             <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//               <p className="text-sm text-slate-500">
//                 Best Match
//               </p>

//               <p className="mt-3 text-3xl font-bold text-indigo-400">
//                 {jobMatches.length
//                   ? Math.max(
//                     ...jobMatches.map(
//                       (job) => job.overallScore
//                     )
//                   )
//                   : 0}
//                 %
//               </p>

//               <p className="mt-1 text-xs text-slate-500">
//                 highest score
//               </p>
//             </div>


//             <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//               <p className="text-sm text-slate-500">
//                 Average
//               </p>

//               <p className="mt-3 text-3xl font-bold">
//                 {jobMatches.length
//                   ? Math.round(
//                     jobMatches.reduce(
//                       (sum, job) =>
//                         sum + job.overallScore,
//                       0
//                     ) / jobMatches.length
//                   )
//                   : 0}
//                 %
//               </p>

//               <p className="mt-1 text-xs text-slate-500">
//                 across all jobs
//               </p>
//             </div>

//           </div>

//         </div>


//         {/* ===================================================== */}
//         {/* JOB LIST */}
//         {/* ===================================================== */}

//         <div className="mb-5 flex items-center justify-between">

//           <div>
//             <h2 className="text-xl font-semibold">
//               Recommended Jobs
//             </h2>

//             <p className="mt-1 text-sm text-slate-500">
//               Ranked from highest to lowest compatibility
//             </p>
//           </div>

//         </div>


//         {jobMatches.length === 0 ? (

//           <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

//             <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl">
//               🔍
//             </div>

//             <h3 className="text-lg font-semibold">
//               No matching jobs found
//             </h3>

//             <p className="mt-2 text-sm text-slate-500">
//               Try changing your search criteria.
//             </p>

//           </div>

//         ) : (

//           <div className="space-y-5">

//             {jobMatches.map((job, index) => (

//               <JobMatchCard
//                 key={job.jobId}
//                 job={job}
//                 rank={index + 1}
//               />

//             ))}

//           </div>

//         )}

//       </div>
//     </div>
//   );
// };


// /* ============================================================= */
// /* JOB MATCH CARD */
// /* ============================================================= */

// const JobMatchCard = ({ job, rank }) => {

//   const score = job.overallScore ?? 0;

//   const scoreColor =
//     score >= 80
//       ? "emerald"
//       : score >= 60
//         ? "yellow"
//         : "red";


//   return (
//     <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all duration-200 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20">

//       {/* ===================================================== */}
//       {/* CARD HEADER */}
//       {/* ===================================================== */}

//       <div className="p-6">

//         <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

//           <div className="flex gap-4">

//             {/* Rank */}

//             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-slate-400">
//               #{rank}
//             </div>


//             <div>

//               <div className="flex flex-wrap items-center gap-2">

//                 <h3 className="text-xl font-semibold text-white">
//                   {job.jobTitle || "Unknown Role"}
//                 </h3>

//                 {score >= 90 && (
//                   <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
//                     Top Match
//                   </span>
//                 )}

//               </div>

//               <p className="mt-1 text-sm text-slate-500">
//                 Job ID: {job.jobId}
//               </p>

//             </div>

//           </div>


//           {/* Score */}

//           <div className="sm:text-right">

//             <p className="text-xs uppercase tracking-wider text-slate-500">
//               Match Score
//             </p>

//             <p
//               className={`mt-1 text-3xl font-bold ${scoreColor === "emerald"
//                   ? "text-emerald-400"
//                   : scoreColor === "yellow"
//                     ? "text-yellow-400"
//                     : "text-red-400"
//                 }`}
//             >
//               {score}%
//             </p>

//           </div>

//         </div>


//         {/* Progress */}

//         <div className="mt-6">

//           <div className="h-2 overflow-hidden rounded-full bg-slate-800">

//             <div
//               className={`h-full rounded-full transition-all ${scoreColor === "emerald"
//                   ? "bg-emerald-500"
//                   : scoreColor === "yellow"
//                     ? "bg-yellow-500"
//                     : "bg-red-500"
//                 }`}
//               style={{
//                 width: `${score}%`
//               }}
//             />

//           </div>

//         </div>


//         {/* ===================================================== */}
//         {/* MATCH BREAKDOWN */}
//         {/* ===================================================== */}

//         <div className="mt-6 grid gap-3 md:grid-cols-3">

//           <ScoreBox
//             title="Role Match"
//             score={job.roleMatch?.score}
//           />

//           <ScoreBox
//             title="Experience Match"
//             score={job.experienceMatch?.score}
//           />

//           <ScoreBox
//             title="Skill Match"
//             score={job.skillMatch?.score}
//           />

//         </div>


//         {/* ===================================================== */}
//         {/* SUMMARY */}
//         {/* ===================================================== */}

//         <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-5">

//           <div className="flex items-start gap-3">

//             <div className="mt-0.5 text-indigo-400">
//               ✦
//             </div>

//             <div>

//               <h4 className="text-sm font-semibold text-white">
//                 AI Summary
//               </h4>

//               <p className="mt-2 text-sm leading-6 text-slate-400">
//                 {job.summary || "No summary available."}
//               </p>

//             </div>

//           </div>

//         </div>


//         {/* ===================================================== */}
//         {/* SKILLS */}
//         {/* ===================================================== */}

//         <div className="mt-6 grid gap-6 lg:grid-cols-2">

//           {/* Matched Skills */}

//           <SkillSection
//             title="Matched Skills"
//             skills={job.skillMatch?.matched}
//             type="matched"
//           />


//           {/* Missing Skills */}

//           <SkillSection
//             title="Skills to Improve"
//             skills={job.skillMatch?.missing}
//             type="missing"
//           />

//         </div>


//         {/* ===================================================== */}
//         {/* DETAILED ANALYSIS */}
//         {/* ===================================================== */}

//         <div className="mt-6 border-t border-slate-800 pt-6">

//           <h4 className="mb-4 text-sm font-semibold text-white">
//             Detailed Analysis
//           </h4>


//           <div className="grid gap-4 lg:grid-cols-2">

//             <AnalysisItem
//               title="Role Analysis"
//               score={job.roleMatch?.score}
//               reason={job.roleMatch?.reason}
//             />

//             <AnalysisItem
//               title="Experience Analysis"
//               score={job.experienceMatch?.score}
//               reason={job.experienceMatch?.reason}
//             />

//           </div>


//           {/* Skill Analysis */}

//           {job.skillMatch?.reason && (
//             <div className="mt-4 rounded-xl bg-slate-800/30 p-4">

//               <div className="flex items-center justify-between">

//                 <h5 className="text-sm font-medium text-slate-300">
//                   Skill Analysis
//                 </h5>

//                 <span className="text-sm font-semibold text-indigo-400">
//                   {job.skillMatch?.score ?? 0}%
//                 </span>

//               </div>

//               <p className="mt-2 text-sm leading-6 text-slate-500">
//                 {job.skillMatch.reason}
//               </p>

//             </div>
//           )}

//           {/* Job application URL */}

//           <div>
//             <a
//               href={job.applyUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
//             >
//               Apply Now
//               <span>↗</span>
//             </a>
//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };


// /* ============================================================= */
// /* SCORE BOX */
// /* ============================================================= */

// const ScoreBox = ({ title, score = 0 }) => {

//   const percentage = score ?? 0;

//   return (
//     <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">

//       <div className="flex items-center justify-between">

//         <p className="text-sm text-slate-400">
//           {title}
//         </p>

//         <p
//           className={`text-lg font-bold ${percentage >= 80
//               ? "text-emerald-400"
//               : percentage >= 60
//                 ? "text-yellow-400"
//                 : "text-red-400"
//             }`}
//         >
//           {percentage}%
//         </p>

//       </div>

//       <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-700">

//         <div
//           className={`h-full rounded-full ${percentage >= 80
//               ? "bg-emerald-500"
//               : percentage >= 60
//                 ? "bg-yellow-500"
//                 : "bg-red-500"
//             }`}
//           style={{
//             width: `${percentage}%`
//           }}
//         />

//       </div>

//     </div>
//   );
// };


// /* ============================================================= */
// /* SKILL SECTION */
// /* ============================================================= */

// const SkillSection = ({ title, skills = [], type }) => {

//   const isMatched = type === "matched";

//   return (
//     <div>

//       <div className="mb-3 flex items-center gap-2">

//         <span
//           className={`h-2 w-2 rounded-full ${isMatched
//               ? "bg-emerald-400"
//               : "bg-red-400"
//             }`}
//         />

//         <h4
//           className={`text-sm font-medium ${isMatched
//               ? "text-emerald-400"
//               : "text-red-400"
//             }`}
//         >
//           {title}
//         </h4>

//       </div>


//       <div className="flex min-h-[42px] flex-wrap gap-2">

//         {skills?.length > 0 ? (

//           skills.map((skill, index) => (

//             <span
//               key={`${skill}-${index}`}
//               className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${isMatched
//                   ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
//                   : "border-red-500/20 bg-red-500/10 text-red-400"
//                 }`}
//             >
//               {skill}
//             </span>

//           ))

//         ) : (

//           <span className="text-sm text-slate-600">
//             None
//           </span>

//         )}

//       </div>

//     </div>
//   );
// };


// /* ============================================================= */
// /* ANALYSIS ITEM */
// /* ============================================================= */

// const AnalysisItem = ({ title, score, reason }) => {

//   return (
//     <div className="rounded-xl bg-slate-800/30 p-4">

//       <div className="flex items-center justify-between">

//         <h5 className="text-sm font-medium text-slate-300">
//           {title}
//         </h5>

//         <span className="rounded-md bg-indigo-500/10 px-2 py-1 text-xs font-semibold text-indigo-400">
//           {score ?? 0}%
//         </span>

//       </div>

//       <p className="mt-3 text-sm leading-6 text-slate-500">
//         {reason || "No analysis available."}
//       </p>

//     </div>
//   );
// };


// export default JobMatchs;


import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getJobMatches } from "../services/resumeService";
import { animate, stagger } from "animejs";
import {
  Briefcase,
  MapPin,
  Globe,
  TrendingUp,
  Award,
  Star,
  BarChart3,
  CheckCircle,
  XCircle,
  Lightbulb,
  ExternalLink,
  Hash,
  Percent,
  Clock,
  Users,
  Target,
} from "lucide-react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * JobMatchs – displays detailed job matching results for a specific search.
 * All sections animate in with a staggered effect.
 */
export default function JobMatchs() {
  const { id: jobMatchesId } = useParams();
  const [matchingResult, setMatchingResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for animated sections
  const headerRef = useRef(null);
  const criteriaRef = useRef(null);
  const scoreRef = useRef(null);
  const statsRef = useRef(null);
  const listHeaderRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await getJobMatches(jobMatchesId);
        setMatchingResult(response);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load job matches");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [jobMatchesId]);

  // Animate sections on mount
  useEffect(() => {
    if (loading || error || !matchingResult) return;
    const reduced = prefersReducedMotion();

    const sections = [
      headerRef,
      criteriaRef,
      scoreRef,
      statsRef,
      listHeaderRef,
    ].filter((ref) => ref.current);

    animate(sections.map((ref) => ref.current), {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: reduced ? 0 : 500,
      delay: reduced ? 0 : stagger(100, { start: 80 }),
      ease: "outQuad",
    });

    // Animate job cards
    const jobCards = cardsRef.current.filter((el) => el);
    if (jobCards.length) {
      animate(jobCards, {
        opacity: [0, 1],
        translateY: [25, 0],
        duration: reduced ? 0 : 500,
        delay: reduced ? 0 : stagger(120, { start: 400 }),
        ease: "outQuad",
      });
    }
  }, [loading, error, matchingResult]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] py-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E8A33D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6B7280]">Finding suitable jobs…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] py-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="bg-white border border-[#D8D9D3] rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-[#14213D]">Unable to load matches</h2>
          <p className="text-[#6B7280] mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const jobMatches = matchingResult?.jobMatches || [];
  const overallRelevance = matchingResult?.overallRelevance ?? 0;
  const searchCriteria = matchingResult?.searchCriteria || {};

  // Stats calculations
  const totalJobs = jobMatches.length;
  const excellentCount = jobMatches.filter((j) => j.overallScore >= 80).length;
  const bestScore = totalJobs ? Math.max(...jobMatches.map((j) => j.overallScore)) : 0;
  const avgScore = totalJobs
    ? Math.round(jobMatches.reduce((sum, j) => sum + j.overallScore, 0) / totalJobs)
    : 0;

  const scoreColor = (score) => {
    if (score >= 80) return "#3B7A57";
    if (score >= 60) return "#E8A33D";
    return "#C24444";
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} style={{ opacity: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8A33D]/10 text-[#E8A33D] text-xs font-medium rounded-full">
                  <Target size={14} /> AI Job Matching
                </span>
                <span className="text-sm text-[#6B7280]">{totalJobs} jobs analyzed</span>
              </div>
              <h1 className="text-3xl font-bold text-[#14213D] font-['Lora',_Georgia,_serif]">
                Job Matches
              </h1>
              <p className="text-[#6B7280] mt-1 text-sm">
                Jobs ranked based on how closely they match your resume, skills, role, and experience.
              </p>
            </div>
          </div>
        </div>

        {/* Search Criteria */}
        <div
          ref={criteriaRef}
          style={{ opacity: 0 }}
          className="bg-white border border-[#D8D9D3] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow mb-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-full bg-[#E7EAF3] flex items-center justify-center text-[#14213D]">
              <Briefcase size={16} />
            </div>
            <h2 className="text-lg font-semibold text-[#14213D]">Search Criteria</h2>
            <span className="text-xs text-[#6B7280] ml-2">Parameters used to find matching jobs</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#F7F7F4] rounded-xl p-4 border border-[#D8D9D3]">
              <p className="text-xs uppercase tracking-wider text-[#6B7280] flex items-center gap-1">
                <Briefcase size={12} /> Role
              </p>
              <p className="mt-1 font-medium text-[#14213D] capitalize">
                {searchCriteria.role || "Not specified"}
              </p>
            </div>
            <div className="bg-[#F7F7F4] rounded-xl p-4 border border-[#D8D9D3]">
              <p className="text-xs uppercase tracking-wider text-[#6B7280] flex items-center gap-1">
                <MapPin size={12} /> Location
              </p>
              <p className="mt-1 font-medium text-[#14213D]">
                {searchCriteria.location || "Not specified"}
              </p>
            </div>
            <div className="bg-[#F7F7F4] rounded-xl p-4 border border-[#D8D9D3]">
              <p className="text-xs uppercase tracking-wider text-[#6B7280] flex items-center gap-1">
                <Globe size={12} /> Country
              </p>
              <p className="mt-1 font-medium uppercase text-[#14213D]">
                {searchCriteria.country || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Score + Stats */}
        <div
          ref={scoreRef}
          style={{ opacity: 0 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5 mb-8"
        >
          {/* Score card */}
          <div className="bg-white border border-[#D8D9D3] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#E8A33D]/10 blur-3xl" />
            <p className="text-sm font-medium text-[#6B7280]">Overall Profile Relevance</p>
            <div className="mt-4 flex items-center gap-5 relative z-10">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="42%"
                    fill="none"
                    stroke="#EDEEEA"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="42%"
                    fill="none"
                    stroke={scoreColor(overallRelevance)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${overallRelevance * 2.64} 264`}
                    style={{ transition: "stroke-dasharray 0.8s ease-out" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[#14213D]">{overallRelevance}%</span>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold text-[#14213D]">
                  {overallRelevance >= 80
                    ? "Excellent profile match"
                    : overallRelevance >= 60
                    ? "Good profile match"
                    : "Needs improvement"}
                </p>
                <p className="text-sm text-[#6B7280] mt-1">
                  Based on the overall relevance of your profile to the selected job criteria.
                </p>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#D8D9D3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-[#6B7280] flex items-center gap-1">
                <Briefcase size={14} /> Jobs Found
              </p>
              <p className="mt-2 text-3xl font-bold text-[#14213D]">{totalJobs}</p>
              <p className="mt-1 text-xs text-[#6B7280]">analyzed positions</p>
            </div>
            <div className="bg-white border border-[#D8D9D3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-[#6B7280] flex items-center gap-1">
                <CheckCircle size={14} className="text-[#3B7A57]" /> Excellent
              </p>
              <p className="mt-2 text-3xl font-bold text-[#3B7A57]">{excellentCount}</p>
              <p className="mt-1 text-xs text-[#6B7280]">80%+ match</p>
            </div>
            <div className="bg-white border border-[#D8D9D3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-[#6B7280] flex items-center gap-1">
                <Award size={14} className="text-[#E8A33D]" /> Best Match
              </p>
              <p className="mt-2 text-3xl font-bold text-[#E8A33D]">{bestScore}%</p>
              <p className="mt-1 text-xs text-[#6B7280]">highest score</p>
            </div>
            <div className="bg-white border border-[#D8D9D3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-[#6B7280] flex items-center gap-1">
                <BarChart3 size={14} /> Average
              </p>
              <p className="mt-2 text-3xl font-bold text-[#14213D]">{avgScore}%</p>
              <p className="mt-1 text-xs text-[#6B7280]">across all jobs</p>
            </div>
          </div>
        </div>

        {/* Job List */}
        <div ref={listHeaderRef} style={{ opacity: 0 }} className="mb-5">
          <h2 className="text-xl font-semibold text-[#14213D]">Recommended Jobs</h2>
          <p className="text-sm text-[#6B7280]">Ranked from highest to lowest compatibility</p>
        </div>

        {jobMatches.length === 0 ? (
          <div className="bg-white border border-[#D8D9D3] rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#EDEEEA] flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-[#6B7280]" />
            </div>
            <h3 className="text-lg font-semibold text-[#14213D]">No matching jobs found</h3>
            <p className="text-[#6B7280] mt-2">Try changing your search criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobMatches.map((job, index) => (
              <JobMatchCard
                key={job.jobId || index}
                job={job}
                rank={index + 1}
                ref={(el) => (cardsRef.current[index] = el)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== Subcomponents ==========

const JobMatchCard = React.forwardRef(({ job, rank }, ref) => {
  const score = job.overallScore ?? 0;
  const scoreColor = score >= 80 ? "#3B7A57" : score >= 60 ? "#E8A33D" : "#C24444";

  return (
    <div
      ref={ref}
      style={{ opacity: 0 }}
      className="bg-white border border-[#D8D9D3] rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      <div className="p-6">
        {/* Header: Rank, Title, Score */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F4] flex items-center justify-center text-sm font-bold text-[#6B7280] border border-[#D8D9D3]">
              #{rank}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-semibold text-[#14213D]">{job.jobTitle || "Unknown Role"}</h3>
                {score >= 90 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#3B7A57]/10 text-[#3B7A57] text-xs font-medium rounded-full">
                    <Star size={12} /> Top Match
                  </span>
                )}
              </div>
              <p className="text-sm text-[#6B7280]">Job ID: {job.jobId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
            <span className="text-xs uppercase tracking-wider text-[#6B7280]">Match Score</span>
            <span className="text-3xl font-bold" style={{ color: scoreColor }}>
              {score}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-2 w-full bg-[#EDEEEA] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${score}%`, backgroundColor: scoreColor }}
          />
        </div>

        {/* Match Breakdown */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ScoreBox title="Role Match" score={job.roleMatch?.score} />
          <ScoreBox title="Experience Match" score={job.experienceMatch?.score} />
          <ScoreBox title="Skill Match" score={job.skillMatch?.score} />
        </div>

        {/* AI Summary */}
        {job.summary && (
          <div className="mt-6 bg-[#F7F7F4] rounded-xl p-5 border border-[#D8D9D3]">
            <div className="flex items-start gap-3">
              <Lightbulb size={18} className="text-[#E8A33D] mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#14213D]">AI Summary</h4>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">{job.summary}</p>
              </div>
            </div>
          </div>
        )}

        {/* Skills sections */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkillSection
            title="Matched Skills"
            skills={job.skillMatch?.matched}
            type="matched"
          />
          <SkillSection
            title="Skills to Improve"
            skills={job.skillMatch?.missing}
            type="missing"
          />
        </div>

        {/* Detailed Analysis */}
        <div className="mt-6 border-t border-[#D8D9D3] pt-6">
          <h4 className="text-sm font-semibold text-[#14213D] mb-4">Detailed Analysis</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          {job.skillMatch?.reason && (
            <div className="mt-4 bg-[#F7F7F4] rounded-xl p-4 border border-[#D8D9D3]">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-[#14213D]">Skill Analysis</h5>
                <span className="text-sm font-semibold text-[#E8A33D]">
                  {job.skillMatch?.score ?? 0}%
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">{job.skillMatch.reason}</p>
            </div>
          )}
          {/* Apply button */}
          {job.applyUrl && (
            <div className="mt-6">
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#14213D] text-white rounded-lg text-sm font-medium hover:bg-[#24304F] transition-colors"
              >
                Apply Now <ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// ========== Helper components ==========

const ScoreBox = ({ title, score = 0 }) => {
  const percentage = score ?? 0;
  const color = percentage >= 80 ? "#3B7A57" : percentage >= 60 ? "#E8A33D" : "#C24444";

  return (
    <div className="bg-[#F7F7F4] rounded-xl p-4 border border-[#D8D9D3]">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#6B7280]">{title}</span>
        <span className="text-lg font-bold" style={{ color }}>{percentage}%</span>
      </div>
      <div className="mt-3 h-1.5 w-full bg-[#EDEEEA] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

const SkillSection = ({ title, skills = [], type }) => {
  const isMatched = type === "matched";
  const icon = isMatched ? <CheckCircle size={14} className="text-[#3B7A57]" /> : <XCircle size={14} className="text-[#C24444]" />;
  const tagClass = isMatched
    ? "bg-[#E3F0E8] text-[#3B7A57] border-[#3B7A57]/20"
    : "bg-[#FBEEDA] text-[#C9822A] border-[#C9822A]/20";

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className={`text-sm font-medium ${isMatched ? "text-[#3B7A57]" : "text-[#C9822A]"}`}>
          {title}
        </h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills?.length > 0 ? (
          skills.map((skill, idx) => (
            <span
              key={`${skill}-${idx}`}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium ${tagClass}`}
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-sm text-[#6B7280]">None</span>
        )}
      </div>
    </div>
  );
};

const AnalysisItem = ({ title, score, reason }) => (
  <div className="bg-[#F7F7F4] rounded-xl p-4 border border-[#D8D9D3]">
    <div className="flex items-center justify-between">
      <h5 className="text-sm font-medium text-[#14213D]">{title}</h5>
      <span className="text-sm font-semibold text-[#E8A33D]">{score ?? 0}%</span>
    </div>
    <p className="mt-2 text-sm leading-6 text-[#6B7280]">{reason || "No analysis available."}</p>
  </div>
);

// Import Search if used in empty state
import { Search } from "lucide-react";