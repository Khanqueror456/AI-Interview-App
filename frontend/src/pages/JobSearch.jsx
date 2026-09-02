import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { searchJobs } from "../services/resumeService";

const JobSearch = () => {

  const navigate = useNavigate();
  const {id : resumeId} = useParams();

  const [formData, setFormData] = useState({
    country: "in",
    role: "network engineer",
    location: "Bangalore"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError(null);

      const jobMatchesId = await searchJobs(resumeId, formData);

      navigate(`/resumes/job-matches/${jobMatchesId}`);

    } catch (error) {

      setError(
        error?.response?.data?.message ||
        "Failed to fetch jobs"
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">

      <div className="mx-auto max-w-xl">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Find Matching Jobs
          </h1>

          <p className="mt-2 text-slate-400">
            Enter your preferred role and location to find suitable
            job opportunities.
          </p>

        </div>


        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
        >

          {/* Country */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Country
            </label>

            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >

              <option value="in">
                India
              </option>

              <option value="gb">
                United Kingdom
              </option>

              <option value="us">
                United States
              </option>

              <option value="au">
                Australia
              </option>

              <option value="ca">
                Canada
              </option>

            </select>

          </div>


          {/* Role */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Job Role
            </label>

            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Network Engineer"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />

          </div>


          {/* Location */}
          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bangalore"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />

          </div>


          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading
              ? "Finding Jobs..."
              : "Find Matching Jobs"
            }

          </button>

        </form>

      </div>

    </div>
  );
};

export default JobSearch;