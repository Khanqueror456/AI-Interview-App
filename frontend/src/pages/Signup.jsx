// src/pages/Signup.jsx
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { signupSchema } from "../schemas/authSchema";
import { animate } from "animejs";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import SkillSyncLogo from "../components/common/SkillSyncLogo";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Signup – create a new account.
 * Uses react-hook-form + zod validation.
 */
export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

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
      await signup(data);
      toast.success("Account created successfully 🎉");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Subtle decorative background shapes */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#E8A33D]/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#14213D]/5 blur-3xl" />

      <div ref={cardRef} style={{ opacity: 0 }} className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <SkillSyncLogo
            showText={true}
            textColor="text-[#14213D]"
            iconColor="#E8A33D"
            size={36}
            className="justify-center"
            animationDuration={5000}
          />
          <p className="text-[#6B7280] mt-1 text-sm">
            Create your account to start practicing.
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white border border-[#D8D9D3] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-[#14213D]">Get started</h2>
          <p className="text-[#6B7280] mt-1 mb-6 text-sm">
            Join thousands of professionals improving their interview skills.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#D8D9D3] rounded-lg bg-white text-[#14213D] placeholder-[#6B7280] focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 transition-all outline-none"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1.5">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-1.5">
                Email Address
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...register("password")}
                  className="w-full pl-10 pr-12 py-2.5 border border-[#D8D9D3] rounded-lg bg-white text-[#14213D] placeholder-[#6B7280] focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#14213D] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  className="w-full pl-10 pr-12 py-2.5 border border-[#D8D9D3] rounded-lg bg-white text-[#14213D] placeholder-[#6B7280] focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#14213D] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1.5">{errors.confirmPassword.message}</p>
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
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-[#6B7280] mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#E8A33D] hover:text-[#C9822A] font-medium transition-colors underline-offset-2 hover:underline"
            >
              Sign in
            </button>
          </p>

          {/* Trust badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#6B7280]">
            <CheckCircle size={16} className="text-[#3B7A57]" />
            <span>Secure & encrypted</span>
            <span className="w-px h-3 bg-[#D8D9D3]" />
            <span>Free trial</span>
          </div>
        </div>
      </div>
    </div>
  );
}
