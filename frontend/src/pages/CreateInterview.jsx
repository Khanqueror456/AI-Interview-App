import React, { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createInterviewSchema } from '../schemas/interviewSchema';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createInterview, getInterview, startInterview } from '../services/interviewService';

const CreateInterview = () => {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(createInterviewSchema)
  })


  const onSubmit = async (data) => {

    try {

      const response = await createInterview(data);

      toast.success("Interview created successfully🎉");

      // await startInterview(response.id);

      navigate(`/`);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to create interview"
      )

    }

  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">

      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-5 text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-white">
            Create Interview
          </h1>

          <p className="mt-2 text-slate-400">
            Configure your interview and let AI generate
            questions tailored to your requirements.
          </p>

        </div>


        {/* Form Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >

            {/* Target Role */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Target Role
              </label>

              <input
                type="text"
                placeholder="e.g. Frontend Developer"
                {...register("targetRole")}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              {errors.targetRole && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.targetRole.message}
                </p>
              )}

            </div>


            {/* Experience Level */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Experience Level
              </label>

              <select
                {...register("experienceLevel")}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >

                <option
                  value=""
                  className="bg-slate-800"
                >
                  Select experience level
                </option>

                <option value="fresher">
                  Fresher
                </option>

                <option value="junior">
                  Junior
                </option>

                <option value="mid">
                  Intermediate
                </option>

                <option value="senior">
                  Senior
                </option>

              </select>

              {errors.experienceLevel && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.experienceLevel.message}
                </p>
              )}

            </div>


            {/* Difficulty */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Difficulty
              </label>

              <select
                {...register("difficulty")}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >

                <option
                  value=""
                  className="bg-slate-800"
                >
                  Select difficulty
                </option>

                <option value="easy">
                  Easy
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="hard">
                  Hard
                </option>

              </select>

              {errors.difficulty && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.difficulty.message}
                </p>
              )}

            </div>


            {/* Total Questions */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Number of Questions
              </label>

              <input
                type="number"
                min="1"
                max="10"
                {...register("totalQuestions", {
                  valueAsNumber: true
                })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              {errors.totalQuestions && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.totalQuestions.message}
                </p>
              )}

            </div>


            {/* Info */}
            <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4">

              <p className="text-sm text-indigo-300">
                AI will generate technical questions based on
                your selected role, experience level, and
                difficulty.
              </p>

            </div>


            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Generating Interview..."
                  : "Create Interview"
                }
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default CreateInterview
