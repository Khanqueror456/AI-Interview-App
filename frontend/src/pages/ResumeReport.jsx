// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getResume } from "../services/resumeService";

// const ResumeReport = () => {

//     const { id } = useParams();

//     const [resume, setResume] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);


//     useEffect(() => {

//         const fetchResume = async () => {

//             try {

//                 const response = await getResume(id);

//                 setResume(response.resume);

//             } catch (error) {

//                 setError(
//                     error?.response?.data?.message ||
//                     "Failed to load resume"
//                 );

//             } finally {

//                 setLoading(false);
//             }
//         };

//         fetchResume();

//     }, [id]);


//     if (loading) {
//         return (
//             <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
//                 <p className="text-slate-400">
//                     Loading resume analysis...
//                 </p>
//             </div>
//         );
//     }


//     if (error) {
//         return (
//             <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-400">
//                 {error}
//             </div>
//         );
//     }


//     if (!resume) {
//         return null;
//     }


//     const {
//         personalInfo,
//         summary,
//         skills,
//         experience,
//         projects,
//         education,
//         certifications,
//         links
//     } = resume.parsedData || {};


//     const {
//         score,
//         strengths,
//         weaknesses,
//         suggestions,
//         missingSkills
//     } = resume.analysis || {};


//     return (
//         <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">

//             <div className="mx-auto max-w-6xl">


//                 {/* Header */}

//                 <div className="mb-8">

//                     <h1 className="text-3xl font-bold">
//                         Resume Report
//                     </h1>

//                     <p className="mt-2 text-slate-400">
//                         AI-powered analysis of your resume
//                     </p>

//                 </div>


//                 {/* Score */}

//                 <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">

//                     <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

//                         <div>

//                             <p className="text-sm text-slate-400">
//                                 Overall Resume Score
//                             </p>

//                             <h2 className="mt-2 text-5xl font-bold text-indigo-400">
//                                 {score ?? 0}
//                                 <span className="text-2xl text-slate-500">
//                                     /100
//                                 </span>
//                             </h2>

//                         </div>


//                         <div className="w-full max-w-md">

//                             <div className="mb-2 flex justify-between text-sm">

//                                 <span className="text-slate-400">
//                                     Resume quality
//                                 </span>

//                                 <span className="text-slate-300">
//                                     {score ?? 0}%
//                                 </span>

//                             </div>

//                             <div className="h-3 overflow-hidden rounded-full bg-slate-800">

//                                 <div
//                                     className="h-full rounded-full bg-indigo-500 transition-all"
//                                     style={{
//                                         width: `${score ?? 0}%`
//                                     }}
//                                 />

//                             </div>

//                         </div>

//                     </div>

//                 </div>


//                 {/* Strengths / Weaknesses */}

//                 <div className="mb-6 grid gap-6 md:grid-cols-2">


//                     {/* Strengths */}

//                     <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                         <h2 className="mb-5 text-xl font-semibold">
//                             Strengths
//                         </h2>

//                         <div className="space-y-3">

//                             {strengths?.length > 0 ? (

//                                 strengths.map((item, index) => (

//                                     <div
//                                         key={index}
//                                         className="flex gap-3 rounded-lg bg-slate-950 p-3"
//                                     >

//                                         <span className="text-green-400">
//                                             ✓
//                                         </span>

//                                         <p className="text-sm text-slate-300">
//                                             {item}
//                                         </p>

//                                     </div>

//                                 ))

//                             ) : (

//                                 <p className="text-slate-500">
//                                     No strengths identified.
//                                 </p>

//                             )}

//                         </div>

//                     </div>


//                     {/* Weaknesses */}

//                     <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                         <h2 className="mb-5 text-xl font-semibold">
//                             Areas to Improve
//                         </h2>

//                         <div className="space-y-3">

//                             {weaknesses?.length > 0 ? (

//                                 weaknesses.map((item, index) => (

//                                     <div
//                                         key={index}
//                                         className="flex gap-3 rounded-lg bg-slate-950 p-3"
//                                     >

//                                         <span className="text-yellow-400">
//                                             !
//                                         </span>

//                                         <p className="text-sm text-slate-300">
//                                             {item}
//                                         </p>

//                                     </div>

//                                 ))

//                             ) : (

//                                 <p className="text-slate-500">
//                                     No major weaknesses identified.
//                                 </p>

//                             )}

//                         </div>

//                     </div>

//                 </div>


//                 {/* Suggestions */}

//                 <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                     <h2 className="mb-5 text-xl font-semibold">
//                         Recommendations
//                     </h2>

//                     <div className="space-y-3">

//                         {suggestions?.map((item, index) => (

//                             <div
//                                 key={index}
//                                 className="rounded-lg border border-slate-800 bg-slate-950 p-4"
//                             >

//                                 <p className="text-sm leading-6 text-slate-300">
//                                     {item}
//                                 </p>

//                             </div>

//                         ))}

//                     </div>

//                 </div>


//                 {/* Missing Skills */}

//                 <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                     <h2 className="mb-5 text-xl font-semibold">
//                         Skills to Consider Adding
//                     </h2>

//                     <div className="flex flex-wrap gap-3">

//                         {missingSkills?.length > 0 ? (

//                             missingSkills.map((skill, index) => (

//                                 <span
//                                     key={index}
//                                     className="rounded-full bg-red-500/10 px-4 py-2 text-sm text-red-300 ring-1 ring-red-500/20"
//                                 >
//                                     {skill}
//                                 </span>

//                             ))

//                         ) : (

//                             <p className="text-slate-500">
//                                 No additional skills identified.
//                             </p>

//                         )}

//                     </div>

//                 </div>


//                 {/* Candidate */}

//                 <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                     <h2 className="mb-5 text-xl font-semibold">
//                         Candidate Profile
//                     </h2>

//                     <div className="grid gap-5 md:grid-cols-2">

//                         <div>

//                             <p className="text-sm text-slate-400">
//                                 Name
//                             </p>

//                             <p className="mt-1 font-medium">
//                                 {personalInfo?.name || "—"}
//                             </p>

//                         </div>

//                         <div>

//                             <p className="text-sm text-slate-400">
//                                 Email
//                             </p>

//                             <p className="mt-1 font-medium">
//                                 {personalInfo?.email || "—"}
//                             </p>

//                         </div>

//                         <div>

//                             <p className="text-sm text-slate-400">
//                                 Phone
//                             </p>

//                             <p className="mt-1 font-medium">
//                                 {personalInfo?.phone || "—"}
//                             </p>

//                         </div>

//                         <div>

//                             <p className="text-sm text-slate-400">
//                                 Location
//                             </p>

//                             <p className="mt-1 font-medium">
//                                 {personalInfo?.location || "—"}
//                             </p>

//                         </div>

//                     </div>

//                 </div>


//                 {/* Summary */}

//                 {summary && (

//                     <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                         <h2 className="mb-4 text-xl font-semibold">
//                             Professional Summary
//                         </h2>

//                         <p className="leading-7 text-slate-300">
//                             {summary}
//                         </p>

//                     </div>

//                 )}


//                 {/* Skills */}

//                 <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                     <h2 className="mb-5 text-xl font-semibold">
//                         Skills
//                     </h2>

//                     <div className="flex flex-wrap gap-3">

//                         {skills?.map((skill, index) => (

//                             <span
//                                 key={index}
//                                 className="rounded-lg bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 ring-1 ring-indigo-500/20"
//                             >
//                                 {skill}
//                             </span>

//                         ))}

//                     </div>

//                 </div>


//                 {/* Experience */}

//                 <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                     <h2 className="mb-5 text-xl font-semibold">
//                         Experience
//                     </h2>

//                     <div className="space-y-6">

//                         {experience?.map((item, index) => (

//                             <div
//                                 key={index}
//                                 className="border-l-2 border-indigo-500 pl-5"
//                             >

//                                 <h3 className="text-lg font-semibold">
//                                     {item.position}
//                                 </h3>

//                                 <p className="text-indigo-400">
//                                     {item.company}
//                                 </p>

//                                 <p className="mt-1 text-sm text-slate-500">
//                                     {item.startDate} - {item.endDate}
//                                 </p>

//                                 <p className="mt-3 leading-7 text-slate-300">
//                                     {item.description}
//                                 </p>

//                             </div>

//                         ))}

//                     </div>

//                 </div>


//                 {/* Projects */}

//                 <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                     <h2 className="mb-5 text-xl font-semibold">
//                         Projects
//                     </h2>

//                     <div className="grid gap-4 md:grid-cols-2">

//                         {projects?.map((project, index) => (

//                             <div
//                                 key={index}
//                                 className="rounded-xl border border-slate-800 bg-slate-950 p-5"
//                             >

//                                 <h3 className="font-semibold">
//                                     {project.name}
//                                 </h3>

//                                 <p className="mt-2 text-sm leading-6 text-slate-400">
//                                     {project.description}
//                                 </p>

//                                 <div className="mt-4 flex flex-wrap gap-2">

//                                     {project.technologies?.map(
//                                         (technology, techIndex) => (

//                                             <span
//                                                 key={techIndex}
//                                                 className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300"
//                                             >
//                                                 {technology}
//                                             </span>

//                                         )
//                                     )}

//                                 </div>

//                             </div>

//                         ))}

//                     </div>

//                 </div>


//                 {/* Education */}

//                 <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                     <h2 className="mb-5 text-xl font-semibold">
//                         Education
//                     </h2>

//                     <div className="space-y-4">

//                         {education?.map((item, index) => (

//                             <div key={index}>

//                                 <h3 className="font-semibold">
//                                     {item.degree}
//                                 </h3>

//                                 <p className="text-indigo-400">
//                                     {item.institution}
//                                 </p>

//                                 <p className="text-sm text-slate-400">
//                                     {item.field}
//                                 </p>

//                                 <p className="text-sm text-slate-500">
//                                     {item.startDate} - {item.endDate}
//                                 </p>

//                             </div>

//                         ))}

//                     </div>

//                 </div>

//             </div>

//         </div>
//     );
// };

// export default ResumeReport;


import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getResume } from "../services/resumeService";
import { animate, stagger } from "animejs";
import {
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  CheckCircle,
  XCircle,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  BarChart,
  Sparkles,
} from "lucide-react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * ResumeReport – displays AI‑powered analysis of a resume.
 * All sections fade in with a staggered animation.
 */
export default function ResumeReport() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for animated sections
  const headerRef = useRef(null);
  const scoreRef = useRef(null);
  const strengthsRef = useRef(null);
  const weaknessesRef = useRef(null);
  const suggestionsRef = useRef(null);
  const missingSkillsRef = useRef(null);
  const profileRef = useRef(null);
  const summaryRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const educationRef = useRef(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getResume(id);
        setResume(response.resume);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load resume");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  // Animate sections on mount
  useEffect(() => {
    if (loading || error || !resume) return;
    const reduced = prefersReducedMotion();

    const sections = [
      headerRef,
      scoreRef,
      strengthsRef,
      weaknessesRef,
      suggestionsRef,
      missingSkillsRef,
      profileRef,
      summaryRef,
      skillsRef,
      experienceRef,
      projectsRef,
      educationRef,
    ].filter((ref) => ref.current);

    animate(sections.map((ref) => ref.current), {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: reduced ? 0 : 500,
      delay: reduced ? 0 : stagger(80, { start: 100 }),
      ease: "outQuad",
    });
  }, [loading, error, resume]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F4]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E8A33D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6B7280]">Analyzing your resume…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F4] px-4">
        <div className="bg-white border border-[#D8D9D3] rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-[#14213D]">Analysis failed</h2>
          <p className="text-[#6B7280] mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!resume) return null;

  const {
    personalInfo,
    summary,
    skills,
    experience,
    projects,
    education,
    certifications,
    links,
  } = resume.parsedData || {};

  const { score, strengths, weaknesses, suggestions, missingSkills } =
    resume.analysis || {};

  // Helper to determine score colour
  const getScoreColor = (s) => {
    if (s >= 80) return "#3B7A57";
    if (s >= 60) return "#E8A33D";
    return "#C24444";
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          style={{ opacity: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-12 rounded-full bg-[#E8A33D]/10 flex items-center justify-center text-[#E8A33D]">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#14213D] font-['Lora',_Georgia,_serif]">
              Resume Report
            </h1>
            <p className="text-[#6B7280] text-sm">AI‑powered analysis of your resume</p>
          </div>
        </div>

        {/* Score Card */}
        <div
          ref={scoreRef}
          style={{ opacity: 0 }}
          className="bg-white border border-[#D8D9D3] rounded-2xl p-6 sm:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="42%"
                  fill="none"
                  stroke="#EDEEEA"
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="42%"
                  fill="none"
                  stroke={getScoreColor(score ?? 0)}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(score ?? 0) * 2.64} 264`}
                  style={{
                    transition: "stroke-dasharray 0.8s ease-out",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#14213D]">
                  {score ?? 0}
                </span>
                <span className="text-xs text-[#6B7280]">/ 100</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-medium text-[#6B7280]">Overall Resume Score</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: getScoreColor(score ?? 0) }}
                />
                <span className="text-sm text-[#14213D]">
                  {score >= 70
                    ? "Strong resume – great foundation!"
                    : score >= 50
                    ? "Good start – some areas to improve."
                    : "Needs work – but we can help you improve."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <SectionCard
            ref={strengthsRef}
            title="Strengths"
            icon={<CheckCircle size={18} className="text-[#3B7A57]" />}
            className="border-l-4 border-l-[#3B7A57]"
          >
            {strengths?.length > 0 ? (
              <ul className="space-y-2">
                {strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#4B5563]">
                    <span className="text-[#3B7A57] mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#6B7280] text-sm">No strengths identified.</p>
            )}
          </SectionCard>

          <SectionCard
            ref={weaknessesRef}
            title="Areas to Improve"
            icon={<XCircle size={18} className="text-[#C24444]" />}
            className="border-l-4 border-l-[#C24444]"
          >
            {weaknesses?.length > 0 ? (
              <ul className="space-y-2">
                {weaknesses.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#4B5563]">
                    <span className="text-[#C24444] mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#6B7280] text-sm">No major weaknesses identified.</p>
            )}
          </SectionCard>
        </div>

        {/* Recommendations */}
        {suggestions?.length > 0 && (
          <SectionCard
            ref={suggestionsRef}
            title="Recommendations"
            icon={<Lightbulb size={18} className="text-[#E8A33D]" />}
          >
            <ul className="space-y-3">
              {suggestions.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-[#F7F7F4] rounded-lg border border-[#D8D9D3]"
                >
                  <span className="text-[#E8A33D] mt-0.5">💡</span>
                  <span className="text-sm text-[#4B5563]">{item}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* Missing Skills */}
        {missingSkills?.length > 0 && (
          <SectionCard
            ref={missingSkillsRef}
            title="Skills to Consider Adding"
            icon={<TrendingUp size={18} className="text-[#C9822A]" />}
          >
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1.5 bg-[#FBEEDA] text-[#C9822A] text-sm font-medium rounded-full hover:scale-105 transition-transform cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Candidate Profile */}
        <SectionCard ref={profileRef} title="Candidate Profile" icon={<User size={18} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem icon={<User size={16} />} label="Name" value={personalInfo?.name} />
            <InfoItem icon={<Mail size={16} />} label="Email" value={personalInfo?.email} />
            <InfoItem icon={<Phone size={16} />} label="Phone" value={personalInfo?.phone} />
            <InfoItem icon={<MapPin size={16} />} label="Location" value={personalInfo?.location} />
          </div>
        </SectionCard>

        {/* Summary */}
        {summary && (
          <SectionCard ref={summaryRef} title="Professional Summary" icon={<FileText size={18} />}>
            <p className="text-[#4B5563] leading-relaxed">{summary}</p>
          </SectionCard>
        )}

        {/* Skills */}
        <SectionCard ref={skillsRef} title="Skills" icon={<Code size={18} />}>
          {skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-[#E7EAF3] text-[#14213D] text-sm font-medium rounded-full hover:scale-105 transition-transform cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7280]">No skills listed</p>
          )}
        </SectionCard>

        {/* Experience */}
        <SectionCard ref={experienceRef} title="Experience" icon={<Briefcase size={18} />}>
          {experience?.length > 0 ? (
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-[#E8A33D]">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#E8A33D] border-2 border-white" />
                  <h3 className="text-lg font-semibold text-[#14213D]">{exp.position || "Position"}</h3>
                  <p className="text-[#6B7280] flex items-center gap-2">
                    <Briefcase size={14} /> {exp.company || "Company"}
                  </p>
                  <p className="text-sm text-[#6B7280] flex items-center gap-2 mt-1">
                    <Calendar size={14} /> {exp.startDate || "Start"} – {exp.endDate || "Present"}
                  </p>
                  {exp.description && (
                    <p className="mt-3 text-[#4B5563] leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7280]">No experience entries</p>
          )}
        </SectionCard>

        {/* Education */}
        <SectionCard ref={educationRef} title="Education" icon={<GraduationCap size={18} />}>
          {education?.length > 0 ? (
            <div className="space-y-5">
              {education.map((edu, idx) => (
                <div key={idx} className="bg-[#F7F7F4] rounded-xl p-5 border border-[#D8D9D3]">
                  <h3 className="font-semibold text-[#14213D]">{edu.degree || "Degree"}</h3>
                  <p className="text-[#6B7280]">{edu.institution || "Institution"}</p>
                  <p className="text-sm text-[#6B7280]">{edu.field || ""}</p>
                  <p className="text-sm text-[#6B7280] flex items-center gap-2 mt-1">
                    <Calendar size={14} /> {edu.startDate || "Start"} – {edu.endDate || "Present"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7280]">No education listed</p>
          )}
        </SectionCard>

        {/* Projects (if available) */}
        {projects?.length > 0 && (
          <SectionCard ref={projectsRef} title="Projects" icon={<Code size={18} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {projects.map((proj, idx) => (
                <div key={idx} className="bg-white border border-[#D8D9D3] rounded-xl p-5 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-[#14213D]">{proj.name || "Project"}</h3>
                  {proj.description && (
                    <p className="text-sm text-[#6B7280] mt-2">{proj.description}</p>
                  )}
                  {proj.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="px-3 py-1 bg-[#EDEEEA] text-[#14213D] text-xs rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}

/** Helper components **/

const SectionCard = React.forwardRef(({ children, title, icon, className = "" }, ref) => (
  <div
    ref={ref}
    style={{ opacity: 0 }}
    className={`bg-white border border-[#D8D9D3] rounded-2xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
  >
    <div className="flex items-center gap-2 mb-5">
      <span className="text-[#E8A33D]">{icon}</span>
      <h2 className="text-xl font-semibold text-[#14213D] font-['Lora',_Georgia,_serif]">{title}</h2>
    </div>
    {children}
  </div>
));

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="text-[#6B7280] mt-0.5">{icon}</span>
    <div>
      <p className="text-sm text-[#6B7280]">{label}</p>
      <p className="text-[#14213D] font-medium">{value || "—"}</p>
    </div>
  </div>
);

// Import Calendar if used
import { Calendar } from "lucide-react";