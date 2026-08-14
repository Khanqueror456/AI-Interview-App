import React from 'react'

import { useForm } from 'react-hook-form'
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../schemas/authSchema';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const {

    register,
    handleSubmit,
    formState: { errors },
    isSubmitting

  } = useForm({
    resolver: zodResolver(signupSchema)
  });

  const { signup } = useAuth();

  const navigate = useNavigate();

  const onSubmit = async (data) => {

    try {

      console.log("Signup data", data);

      const response = await signup(data);
      console.log(response);

      toast.success("Account created successfully🎉")

      navigate("/");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Signup failed"
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-white">
            AI Interview
          </h1>

          <p className="mt-2 text-slate-400">
            Practice. Improve. Get hired.
          </p>

        </div>


        {/* Signup Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

          <h2 className="text-2xl font-semibold text-white">
            Create your account
          </h2>

          <p className="mt-2 mb-6 text-sm text-slate-400">
            Start practicing with AI-powered interviews.
          </p>


          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Name */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Name
              </label>

              <input
                type="text"
                placeholder="Your name"
                {...register("name")}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              {errors.name && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.name.message}
                </p>
              )}

            </div>


            {/* Email */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}

            </div>


            {/* Password */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                {...register("password")}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              {errors.password && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}

            </div>


            {/* Confirm Password */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}

            </div>


            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Creating account..."
                : "Create Account"
              }
            </button>

          </form>


          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-slate-400">

            Already have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Sign in
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup
