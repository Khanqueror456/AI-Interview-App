import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { loginSchema } from "../schemas/authSchema";
import { animate } from "animejs";
import { Mail, Lock, ArrowRight, Sparkles, Loader2 } from "lucide-react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Login – sign‑in page with animated entrance and brand styling.
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Refs for animation
  const cardRef = useRef(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    animate(cardRef.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: reduced ? 0 : 600,
      ease: "outQuad",
    });
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      toast.success("Login successful 🎉");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background shape */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#E8A33D]/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#14213D]/5 blur-3xl" />

      <div ref={cardRef} style={{ opacity: 0 }} className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#14213D] text-white mb-4">
            <Sparkles size={28} strokeWidth={1.8} />
          </div>
          <h1 className="text-3xl font-bold text-[#14213D] font-['Lora',_Georgia,_serif]">
            AI Interview
          </h1>
          <p className="text-[#6B7280] mt-1 text-sm">Practice. Improve. Get hired.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#D8D9D3] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#14213D]">Welcome back</h2>
          <p className="text-[#6B7280] mt-1 mb-6 text-sm">
            Sign in to continue your interview practice.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#D8D9D3] rounded-lg bg-white text-[#14213D] placeholder-[#6B7280] focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 transition-all outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#D8D9D3] rounded-lg bg-white text-[#14213D] placeholder-[#6B7280] focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 transition-all outline-none"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#14213D] hover:bg-[#24304F] text-white font-medium py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Signup link */}
          <p className="text-center text-sm text-[#6B7280] mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#E8A33D] hover:text-[#C9822A] font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}