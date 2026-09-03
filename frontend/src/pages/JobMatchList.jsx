import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobsMatches } from "../services/resumeService";

const JobMatchList = () => {
  const [JobMatchList, setJobMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {id : resumeId} = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getJobsMatches(resumeId);

        setJobMatches(response.JobMatchList || response);
      } catch (error) {
        setError(
          error?.response?.data?.message ||
            "Failed to load job matches"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobMatches();
  }, []);

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
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold">
            Job Matches
          </h1>

          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="mb-4 h-6 w-1/3 rounded bg-slate-800" />
                <div className="mb-3 h-4 w-2/3 rounded bg-slate-800" />
                <div className="mb-6 h-4 w-1/2 rounded bg-slate-800" />

                <div className="h-10 w-full rounded bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-3xl font-bold">
            Job Matches
          </h1>

          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Job Matches
          </h1>

          <p className="mt-2 text-slate-400">
            View your previous job matching results and explore
            suitable opportunities.
          </p>
        </div>

        {/* Empty State */}
        {JobMatchList.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
            <h2 className="text-xl font-semibold">
              No job matches yet
            </h2>

            <p className="mt-2 text-slate-400">
              Upload a resume and search for jobs to generate
              your first job matching report.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">

            {JobMatchList.map((match) => {

              const topJob = [...(match.jobMatches || [])]
                .sort(
                  (a, b) =>
                    b.overallScore - a.overallScore
                )[0];

              return (
                <div
                  key={match._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:border-slate-700"
                >

                  {/* Top section */}
                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h2 className="text-lg font-semibold">
                        {match.searchCriteria?.role ||
                          "Job Search"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        {match.searchCriteria?.location}
                        {" · "}
                        {match.searchCriteria?.country?.toUpperCase()}
                      </p>
                    </div>

                    {/* Overall score */}
                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        Relevance
                      </p>

                      <p
                        className={`text-2xl font-bold ${getScoreColor(
                          match.overallRelevance
                        )}`}
                      >
                        {match.overallRelevance}%
                      </p>
                    </div>

                  </div>


                  {/* Divider */}
                  <div className="my-5 border-t border-slate-800" />


                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">

                    <div className="rounded-xl bg-slate-800/60 p-4">
                      <p className="text-xs text-slate-500">
                        Jobs Analyzed
                      </p>

                      <p className="mt-1 text-xl font-semibold">
                        {match.jobMatches?.length || 0}
                      </p>
                    </div>


                    <div className="rounded-xl bg-slate-800/60 p-4">
                      <p className="text-xs text-slate-500">
                        Top Match
                      </p>

                      <p className="mt-1 truncate text-sm font-medium">
                        {topJob?.jobTitle || "N/A"}
                      </p>

                      {topJob && (
                        <p
                          className={`mt-1 text-sm font-semibold ${getScoreColor(
                            topJob.overallScore
                          )}`}
                        >
                          {topJob.overallScore}%
                        </p>
                      )}
                    </div>

                  </div>


                  {/* Date */}
                  <div className="mt-5 flex items-center justify-between">

                    <p className="text-sm text-slate-500">
                      Created{" "}
                      <span className="text-slate-400">
                        {formatDate(match.createdAt)}
                      </span>
                    </p>

                  </div>


                  {/* Button */}
                  <button
                    onClick={() =>
                      handleViewDetails(match._id)
                    }
                    className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
                  >
                    View Matches
                  </button>

                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatchList;