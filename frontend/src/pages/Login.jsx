import React from 'react'

import { useForm } from "react-hook-form";
import api from '../services/api';
import { loginSchema } from "../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast"


const Login = () => {

  const { user, login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    isSubmitting
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {

    try {

      const response = await login(data);
      toast.success("Login successful🎉")
      console.log(response)

      navigate("/");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Login failed"
      );

    }


  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            AI Interview
          </h1>

          <p className="text-slate-400 mt-2">
            Practice. Improve. Get hired.
          </p>
        </div>


        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

          <h2 className="text-2xl font-semibold text-white">
            Welcome back
          </h2>

          <p className="text-slate-400 mt-2 mb-6">
            Sign in to continue your interview practice.
          </p>


          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              {errors.email && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>


            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              {errors.password && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>


            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 transition"
            >
              {isSubmitting
                ? "Signing in..."
                : "Sign In"
              }
            </button>

          </form>


          {/* Signup */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{" "}

            <button
              onClick={() => navigate("/signup")}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Sign up
            </button>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
