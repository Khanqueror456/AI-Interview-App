// import React, { useEffect, useState } from 'react'

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { createInterviewSchema } from '../schemas/interviewSchema';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { createInterview, getInterview, startInterview } from '../services/interviewService';

// const CreateInterview = () => {

//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting }
//   } = useForm({
//     resolver: zodResolver(createInterviewSchema)
//   })


//   const onSubmit = async (data) => {

//     try {

//       const response = await createInterview(data);

//       toast.success("Interview created successfully🎉");

//       // await startInterview(response.id);

//       navigate(`/interviews`);

//     } catch (error) {

//       toast.error(
//         error.response?.data?.message ||
//         "Failed to create interview"
//       )

//     }

//   }

//   return (
//     <div className="min-h-screen bg-slate-950 px-6 py-10">

//       <div className="mx-auto max-w-2xl">

//         {/* Header */}
//         <div className="mb-8">

//           <button
//             type="button"
//             onClick={() => navigate("/")}
//             className="mb-5 text-sm text-slate-400 transition hover:text-white"
//           >
//             ← Back to Dashboard
//           </button>

//           <h1 className="text-3xl font-bold text-white">
//             Create Interview
//           </h1>

//           <p className="mt-2 text-slate-400">
//             Configure your interview and let AI generate
//             questions tailored to your requirements.
//           </p>

//         </div>


//         {/* Form Card */}
//         <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">

//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="space-y-6"
//           >

//             {/* Target Role */}
//             <div>

//               <label className="mb-2 block text-sm font-medium text-slate-300">
//                 Target Role
//               </label>

//               <input
//                 type="text"
//                 placeholder="e.g. Frontend Developer"
//                 {...register("targetRole")}
//                 className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//               />

//               {errors.targetRole && (
//                 <p className="mt-2 text-sm text-red-400">
//                   {errors.targetRole.message}
//                 </p>
//               )}

//             </div>


//             {/* Experience Level */}
//             <div>

//               <label className="mb-2 block text-sm font-medium text-slate-300">
//                 Experience Level
//               </label>

//               <select
//                 {...register("experienceLevel")}
//                 className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//               >

//                 <option
//                   value=""
//                   className="bg-slate-800"
//                 >
//                   Select experience level
//                 </option>

//                 <option value="fresher">
//                   Fresher
//                 </option>

//                 <option value="junior">
//                   Junior
//                 </option>

//                 <option value="mid">
//                   Intermediate
//                 </option>

//                 <option value="senior">
//                   Senior
//                 </option>

//               </select>

//               {errors.experienceLevel && (
//                 <p className="mt-2 text-sm text-red-400">
//                   {errors.experienceLevel.message}
//                 </p>
//               )}

//             </div>


//             {/* Difficulty */}
//             <div>

//               <label className="mb-2 block text-sm font-medium text-slate-300">
//                 Difficulty
//               </label>

//               <select
//                 {...register("difficulty")}
//                 className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//               >

//                 <option
//                   value=""
//                   className="bg-slate-800"
//                 >
//                   Select difficulty
//                 </option>

//                 <option value="easy">
//                   Easy
//                 </option>

//                 <option value="medium">
//                   Medium
//                 </option>

//                 <option value="hard">
//                   Hard
//                 </option>

//               </select>

//               {errors.difficulty && (
//                 <p className="mt-2 text-sm text-red-400">
//                   {errors.difficulty.message}
//                 </p>
//               )}

//             </div>


//             {/* Total Questions */}
//             <div>

//               <label className="mb-2 block text-sm font-medium text-slate-300">
//                 Number of Questions
//               </label>

//               <input
//                 type="number"
//                 min="1"
//                 max="10"
//                 {...register("totalQuestions", {
//                   valueAsNumber: true
//                 })}
//                 className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//               />

//               {errors.totalQuestions && (
//                 <p className="mt-2 text-sm text-red-400">
//                   {errors.totalQuestions.message}
//                 </p>
//               )}

//             </div>


//             {/* Info */}
//             <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4">

//               <p className="text-sm text-indigo-300">
//                 AI will generate technical questions based on
//                 your selected role, experience level, and
//                 difficulty.
//               </p>

//             </div>


//             {/* Actions */}
//             <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

//               <button
//                 type="button"
//                 onClick={() => navigate("/")}
//                 disabled={isSubmitting}
//                 className="rounded-lg border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {isSubmitting
//                   ? "Generating Interview..."
//                   : "Create Interview"
//                 }
//               </button>

//             </div>

//           </form>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default CreateInterview




import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { animate } from "animejs";
import toast from "react-hot-toast";
import { Briefcase, GraduationCap, Gauge, ListOrdered, Loader2, ArrowLeft } from "lucide-react";
import { createInterview } from "../services/interviewService";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const EXPERIENCE_LEVELS = [
  { label: "Fresher", value: "fresher" },
  { label: "Junior", value: "junior" },
  { label: "Intermediate", value: "mid" },
  { label: "Senior", value: "senior" },
];

const DIFFICULTIES = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

const CreateInterview = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    animate(cardRef.current, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: prefersReducedMotion() ? 0 : 450,
      ease: "outQuad",
    });
  }, []);

  const onSubmit = async (data) => {
    try {
      await createInterview(data);
      toast.success("Interview created successfully🎉");
      navigate("/interviews");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create interview");
    }
  };

  return (
    <div className="min-h-screen bg-[#EDEEEA] px-6 py-10">
      <div className="mx-auto max-w-[560px]">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#6B7280] hover:text-[#14213D] transition-colors duration-150 mb-6"
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Back to dashboard
        </button>

        <div
          ref={cardRef}
          style={{ opacity: 0 }}
          className="bg-white border border-[#D8D9D3] rounded-[10px] p-8"
        >
          <p className="text-[21px] font-semibold text-[#14213D] font-['Lora',_Georgia,_serif] m-0">
            Create a new interview
          </p>
          <p className="text-[14px] text-[#6B7280] mt-1.5 mb-7">
            Configure your interview and let AI generate questions tailored to your requirements.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Target role */}
            <div>
              <label className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#14213D] mb-2">
                <Briefcase size={15} strokeWidth={1.8} className="text-[#6B7280]" />
                Target role
              </label>
              <input
                type="text"
                placeholder="e.g. Frontend Developer"
                {...register("targetRole", { required: "Target role is required" })}
                className="w-full rounded-[6px] border border-[#D8D9D3] bg-white px-3.5 py-2.5 text-[14px] text-[#14213D] placeholder-[#9CA0A8] outline-none transition-colors duration-150 focus:border-[#14213D] focus:ring-1 focus:ring-[#14213D]"
              />
              {errors.targetRole && (
                <p className="text-[12.5px] text-[#C24444] mt-1.5">{errors.targetRole.message}</p>
              )}
            </div>

            {/* Experience level */}
            <div>
              <label className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#14213D] mb-2">
                <GraduationCap size={15} strokeWidth={1.8} className="text-[#6B7280]" />
                Experience level
              </label>
              <select
                defaultValue=""
                {...register("experienceLevel", { required: "Select an experience level" })}
                className="w-full rounded-[6px] border border-[#D8D9D3] bg-white px-3.5 py-2.5 text-[14px] text-[#14213D] outline-none transition-colors duration-150 focus:border-[#14213D] focus:ring-1 focus:ring-[#14213D]"
              >
                <option value="" disabled>
                  Select experience level
                </option>
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.experienceLevel && (
                <p className="text-[12.5px] text-[#C24444] mt-1.5">
                  {errors.experienceLevel.message}
                </p>
              )}
            </div>

            {/* Difficulty */}
            <div>
              <label className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#14213D] mb-2">
                <Gauge size={15} strokeWidth={1.8} className="text-[#6B7280]" />
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((level) => (
                  <label
                    key={level.value}
                    className="relative flex items-center justify-center rounded-[6px] border border-[#D8D9D3] py-2.5 text-[13.5px] font-medium text-[#14213D] cursor-pointer transition-colors duration-150 has-[:checked]:border-[#14213D] has-[:checked]:bg-[#14213D] has-[:checked]:text-white hover:border-[#9CA0A8]"
                  >
                    <input
                      type="radio"
                      value={level.value}
                      {...register("difficulty", { required: "Select a difficulty" })}
                      className="absolute opacity-0"
                    />
                    {level.label}
                  </label>
                ))}
              </div>
              {errors.difficulty && (
                <p className="text-[12.5px] text-[#C24444] mt-1.5">{errors.difficulty.message}</p>
              )}
            </div>

            {/* Number of questions */}
            <div>
              <label className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#14213D] mb-2">
                <ListOrdered size={15} strokeWidth={1.8} className="text-[#6B7280]" />
                Number of questions
              </label>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="e.g. 5"
                {...register("totalQuestions", {
                  required: "Number of questions is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Must be at least 1 question" },
                  max: { value: 10, message: "Must be 10 questions or fewer" },
                })}
                className="w-full rounded-[6px] border border-[#D8D9D3] bg-white px-3.5 py-2.5 text-[14px] text-[#14213D] placeholder-[#9CA0A8] outline-none transition-colors duration-150 focus:border-[#14213D] focus:ring-1 focus:ring-[#14213D]"
              />
              {errors.totalQuestions && (
                <p className="text-[12.5px] text-[#C24444] mt-1.5">
                  {errors.totalQuestions.message}
                </p>
              )}
            </div>

            {/* Info note */}
            <div className="rounded-[6px] border border-[#E7EAF3] bg-[#F5F6FA] px-3.5 py-3">
              <p className="text-[13px] text-[#495478] m-0">
                AI will generate technical questions based on your selected role, experience
                level, and difficulty.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end mt-1">
              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={isSubmitting}
                className="rounded-[6px] border border-[#D8D9D3] px-5 py-2.5 text-[14px] font-medium text-[#14213D] transition-colors duration-150 hover:bg-[#F7F7F4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 bg-[#14213D] hover:bg-[#24304F] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-medium px-5 py-2.5 rounded-[6px] transition-colors duration-150"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" strokeWidth={2} />
                    Generating interview
                  </>
                ) : (
                  "Create interview"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInterview;