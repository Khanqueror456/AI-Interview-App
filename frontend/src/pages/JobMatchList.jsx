import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobsMatches } from "../services/resumeService";
import { animate, stagger } from "animejs";
import {
  Briefcase,
  MapPin,
  Globe,
  Calendar,
  TrendingUp,
  Award,
  Search,
  Users,
  Building,
  Star,
  ArrowRight,
  Clock,
  BarChart3,
} from "lucide-react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * JobMatchList – displays a list of previous job matching results.
 * Cards animate in with a staggered effect.
 */
export default function JobMatchList() {
  const { id: resumeId } = useParams();
  const navigate = useNavigate();
  const [jobMatches, setJobMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for animated cards
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchJobMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getJobsMatches(resumeId);
        setJobMatches(response.JobMatchList || response || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load job matches");
      } finally {
        setLoading(false);
      }
    };
    fetchJobMatches();
  }, [resumeId]);

  // Animate header, stats, and cards on mount
  useEffect(() => {
    if (loading || error || jobMatches.length === 0) return;
    const reduced = prefersReducedMotion();

    animate(headerRef.current, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: reduced ? 0 : 500,
      ease: "outQuad",
    });

    animate(statsRef.current, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: reduced ? 0 : 500,
      delay: reduced ? 0 : 120,
      ease: "outQuad",
    });

    animate(cardsRef.current, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: reduced ? 0 : 500,
      delay: reduced ? 0 : stagger(120, { start: 200 }),
      ease: "outQuad",
    });
  }, [loading, error, jobMatches]);

  const handleViewDetails = (jobMatchId) => {
    navigate(`/resumes/job-matches/${jobMatchId}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#3B7A57";
    if (score >= 60) return "#E8A33D";
    return "#C24444";
  };

  const getScoreText = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs work";
  };

  // Compute summary stats
  const totalMatches = jobMatches.length;
  const avgRelevance =
    totalMatches > 0
      ? Math.round(
          jobMatches.reduce((acc, m) => acc + (m.overallRelevance || 0), 0) /
            totalMatches
        )
      : 0;
  const bestMatch = totalMatches > 0
    ? Math.max(...jobMatches.map((m) => m.overallRelevance || 0))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-[#D8D9D3] rounded mb-3" />
            <div className="h-4 w-72 bg-[#D8D9D3] rounded mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-[#D8D9D3] rounded-2xl p-5 h-24" />
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-[#D8D9D3] rounded-2xl p-6 h-64" />
              ))}
            </div>
          </div>
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

  return (
    <div className="min-h-screen bg-[#F7F7F4] py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#E8A33D]/10 flex items-center justify-center text-[#E8A33D]">
              <Briefcase size={22} />
            </div>
            <h1 className="text-3xl font-bold text-[#14213D] font-['Lora',_Georgia,_serif]">
              Job Matches
            </h1>
          </div>
          <p className="text-[#6B7280] text-sm ml-14">
            View your previous job matching results and explore suitable opportunities.
          </p>
        </div>

        {/* Stats summary */}
        {totalMatches > 0 && (
          <div
            ref={statsRef}
            style={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8"
          >
            <div className="bg-white border border-[#D8D9D3] rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#E7EAF3] flex items-center justify-center">
                <Search size={18} className="text-[#14213D]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#14213D]">{totalMatches}</p>
                <p className="text-sm text-[#6B7280]">Total searches</p>
              </div>
            </div>
            <div className="bg-white border border-[#D8D9D3] rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#FBEEDA] flex items-center justify-center">
                <TrendingUp size={18} className="text-[#C9822A]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#14213D]">{avgRelevance}%</p>
                <p className="text-sm text-[#6B7280]">Average relevance</p>
              </div>
            </div>
            <div className="bg-white border border-[#D8D9D3] rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#E3F0E8] flex items-center justify-center">
                <Award size={18} className="text-[#3B7A57]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#14213D]">{bestMatch}%</p>
                <p className="text-sm text-[#6B7280]">Best match</p>
              </div>
            </div>
          </div>
        )}

        {/* Cards */}
        {jobMatches.length === 0 ? (
          <div className="bg-white border border-[#D8D9D3] rounded-2xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#EDEEEA] flex items-center justify-center mx-auto mb-4">
              <Briefcase size={32} className="text-[#6B7280]" />
            </div>
            <h2 className="text-xl font-semibold text-[#14213D]">No job matches yet</h2>
            <p className="text-[#6B7280] mt-2">
              Upload a resume and search for jobs to generate your first matching report.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {jobMatches.map((match, index) => {
              const topJob =
                match.jobMatches?.length > 0
                  ? [...match.jobMatches].sort(
                      (a, b) => (b.overallScore || 0) - (a.overallScore || 0)
                    )[0]
                  : null;

              const relevance = match.overallRelevance || 0;
              const scoreColor = getScoreColor(relevance);
              const jobCount = match.jobMatches?.length || 0;

              return (
                <div
                  key={match._id || index}
                  ref={(el) => (cardsRef.current[index] = el)}
                  style={{ opacity: 0 }}
                  className="bg-white border border-[#D8D9D3] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1"
                >
                  {/* Role & Location */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-[#14213D]">
                        {match.searchCriteria?.role || "Job Search"}
                      </h2>
                      <div className="flex items-center gap-1 text-sm text-[#6B7280] mt-1 flex-wrap">
                        <MapPin size={14} className="shrink-0" />
                        <span>{match.searchCriteria?.location || "N/A"}</span>
                        <span className="mx-1">·</span>
                        <Globe size={14} className="shrink-0" />
                        <span>{match.searchCriteria?.country?.toUpperCase() || "N/A"}</span>
                      </div>
                    </div>
                    {/* Relevance score as pill */}
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-[#6B7280]">Relevance</span>
                      <div
                        className="mt-1 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ backgroundColor: scoreColor }}
                      >
                        {relevance}%
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-5 border-t border-[#D8D9D3]" />

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#F7F7F4] rounded-xl p-4">
                      <p className="text-xs text-[#6B7280] flex items-center gap-1">
                        <BarChart3 size={12} /> Jobs Analyzed
                      </p>
                      <p className="mt-1 text-xl font-semibold text-[#14213D]">
                        {jobCount}
                      </p>
                    </div>
                    <div className="bg-[#F7F7F4] rounded-xl p-4">
                      <p className="text-xs text-[#6B7280] flex items-center gap-1">
                        <Star size={12} /> Top Match
                      </p>
                      {topJob ? (
                        <>
                          <p className="mt-1 truncate text-sm font-medium text-[#14213D]">
                            {topJob.jobTitle || "N/A"}
                          </p>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: getScoreColor(topJob.overallScore || 0) }}
                          >
                            {topJob.overallScore || 0}%
                          </p>
                        </>
                      ) : (
                        <p className="mt-1 text-sm text-[#6B7280]">No matches</p>
                      )}
                    </div>
                  </div>

                  {/* Date and button */}
                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-sm text-[#6B7280] flex items-center gap-1">
                      <Clock size={14} />
                      <span>Created {formatDate(match.createdAt)}</span>
                    </p>
                    <button
                      onClick={() => handleViewDetails(match._id)}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-[#14213D] text-white rounded-lg text-sm font-medium hover:bg-[#24304F] transition-colors"
                    >
                      View Matches <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}