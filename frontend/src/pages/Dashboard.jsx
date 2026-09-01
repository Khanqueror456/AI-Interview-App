import React from 'react'
import { useEffect, useState } from 'react';
import { getInterviews } from "../services/interviewService"
import InterviewCard from '../components/interview/InterviewCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchInterviews = async () => {

      try {

        const data = await getInterviews();

        console.log(data);
        setInterviews(data.interviews);

      } catch (error) {

        setError(
          error.response?.data?.message || "Failed to load interviews"
        )

      } finally {

        setLoading(false);

      }
    }

    fetchInterviews();
  }, [])

  useEffect(() => {
    console.log(loading)
  }, [loading]);


  if (loading) {
    return <p>Loading</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold text-white">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Manage and practice your AI interviews.
            </p>
          </div>
          <div className='flex justify-center items-center gap-4'>
          <button
            onClick={() => navigate("/interviews/create")}
            className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
          >
            + Create Interview
          </button>

          <button
            onClick={() => navigate("/resume/analyzer")}
            className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
          >
            Analyse resume
          </button>

          <button
            onClick={() => navigate("/resumes")}
            className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
          >
            My resumes
          </button>

          </div>


        </div>


        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Total Interviews
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {interviews.length}
            </p>
          </div>


          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {
                interviews.filter(
                  interview =>
                    interview.status === "pending" || interview.status === "created"
                ).length
              }
            </p>
          </div>


          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {
                interviews.filter(
                  interview =>
                    interview.status === "completed"
                ).length
              }
            </p>
          </div>

        </div>


        {/* Interview List */}
        <div>

          <div className="mb-5">
            <h2 className="text-xl font-semibold text-white">
              Your Interviews
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Continue an existing interview or review your previous attempts.
            </p>
          </div>


          {interviews.length === 0 ? (

            /* Empty State */
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">

              <h3 className="text-lg font-semibold text-white">
                No interviews yet
              </h3>

              <p className="mt-2 text-slate-400">
                Create your first AI-powered interview and start practicing.
              </p>

              <button
                onClick={() => navigate("/interviews/create")}
                className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
              >
                Create Your First Interview
              </button>

            </div>

          ) : (

            /* Interview Cards */
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {interviews.map((interview) => (
                <InterviewCard
                  key={interview._id}
                  interview={interview}
                />
              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard
