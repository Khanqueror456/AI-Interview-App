// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getJobMatches, searchJobs } from "../services/resumeService";

// const JobSearch = () => {

//   const navigate = useNavigate();
//   const {id : resumeId} = useParams();

//   const [formData, setFormData] = useState({
//     country: "in",
//     role: "network engineer",
//     location: "Bangalore"
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);


//   const handleChange = (e) => {

//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));

//   };


//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     try {

//       setLoading(true);
//       setError(null);

//       const jobMatchesId = await searchJobs(resumeId, formData);

//       navigate(`/resumes/job-matches/${jobMatchesId}`);

//     } catch (error) {

//       setError(
//         error?.response?.data?.message ||
//         "Failed to fetch jobs"
//       );

//     } finally {

//       setLoading(false);
//     }
//   };


//   return (
//     <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">

//       <div className="mx-auto max-w-xl">

//         {/* Header */}
//         <div className="mb-8">

//           <h1 className="text-3xl font-bold">
//             Find Matching Jobs
//           </h1>

//           <p className="mt-2 text-slate-400">
//             Enter your preferred role and location to find suitable
//             job opportunities.
//           </p>

//         </div>


//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
//         >

//           {/* Country */}
//           <div className="mb-5">

//             <label className="mb-2 block text-sm font-medium text-slate-300">
//               Country
//             </label>

//             <select
//               name="country"
//               value={formData.country}
//               onChange={handleChange}
//               className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//             >

//               <option value="in">
//                 India
//               </option>

//               <option value="gb">
//                 United Kingdom
//               </option>

//               <option value="us">
//                 United States
//               </option>

//               <option value="au">
//                 Australia
//               </option>

//               <option value="ca">
//                 Canada
//               </option>

//             </select>

//           </div>


//           {/* Role */}
//           <div className="mb-5">

//             <label className="mb-2 block text-sm font-medium text-slate-300">
//               Job Role
//             </label>

//             <input
//               type="text"
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               placeholder="e.g. Network Engineer"
//               className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//               required
//             />

//           </div>


//           {/* Location */}
//           <div className="mb-6">

//             <label className="mb-2 block text-sm font-medium text-slate-300">
//               Location
//             </label>

//             <input
//               type="text"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               placeholder="e.g. Bangalore"
//               className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//               required
//             />

//           </div>


//           {/* Error */}
//           {error && (
//             <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
//               {error}
//             </div>
//           )}


//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
//           >

//             {loading
//               ? "Finding Jobs..."
//               : "Find Matching Jobs"
//             }

//           </button>

//         </form>

//       </div>

//     </div>
//   );
// };

// export default JobSearch;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobMatches, searchJobs } from "../services/resumeService";
import { animate } from "animejs";
import { Search, MapPin, Briefcase, Globe, Loader2 } from "lucide-react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * JobSearch – a form to find matching jobs based on role, location, and country.
 * Uses the brand's light theme and subtle animations on mount.
 */
export default function JobSearch() {
  const navigate = useNavigate();
  const { id: resumeId } = useParams();

  const [formData, setFormData] = useState({
    country: "in",
    role: "network engineer",
    location: "Bangalore",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs for animation
  const headerRef = useRef(null);
  const formRef = useRef(null);

  // Animate header and form on mount
  useEffect(() => {
    const reduced = prefersReducedMotion();
    animate(headerRef.current, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: reduced ? 0 : 500,
      ease: "outQuad",
    });
    animate(formRef.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: reduced ? 0 : 550,
      delay: reduced ? 0 : 120,
      ease: "outQuad",
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const jobMatchesId = await searchJobs(resumeId, formData);
      navigate(`/resumes/job-matches/${jobMatchesId}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] py-10 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div ref={headerRef} style={{ opacity: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8A33D]/10 text-[#E8A33D] mb-4">
            <Search size={28} strokeWidth={1.8} />
          </div>
          <h1 className="text-3xl font-bold text-[#14213D] font-['Lora',_Georgia,_serif]">
            Find Matching Jobs
          </h1>
          <p className="text-[#6B7280] mt-2 text-sm">
            Enter your preferred role and location to discover suitable opportunities.
          </p>
        </div>

        {/* Form Card */}
        <div
          ref={formRef}
          style={{ opacity: 0 }}
          className="bg-white border border-[#D8D9D3] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-1.5">
                Country
              </label>
              <div className="relative">
                <Globe
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#D8D9D3] rounded-lg bg-white text-[#14213D] focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 transition-all outline-none appearance-none"
                >
                  <option value="in">India</option>
                  <option value="gb">United Kingdom</option>
                  <option value="us">United States</option>
                  <option value="au">Australia</option>
                  <option value="ca">Canada</option>
                </select>
              </div>
            </div>

            {/* Job Role */}
            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-1.5">
                Job Role
              </label>
              <div className="relative">
                <Briefcase
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Network Engineer"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-[#D8D9D3] rounded-lg bg-white text-[#14213D] placeholder-[#6B7280] focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 transition-all outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-[#14213D] mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-[#D8D9D3] rounded-lg bg-white text-[#14213D] placeholder-[#6B7280] focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 transition-all outline-none"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <span className="text-red-500">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#14213D] hover:bg-[#24304F] text-white font-medium py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Finding Jobs…
                </>
              ) : (
                <>
                  <Search size={18} />
                  Find Matching Jobs
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}