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