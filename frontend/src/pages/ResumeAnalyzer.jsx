// import React, { useEffect, useState } from "react";
// import { uploadResume } from "../services/resumeService";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";


// const ResumeAnalyzer = () => {

//     const [file, setFile] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [resume, setResume] = useState(null);
//     const [error, setError] = useState(null);

//     const handleFileChange = (e) => {

//         const selectedFile = e.target.files[0];

//         if (!selectedFile) {
//             return;
//         }

//         if (selectedFile.type !== "application/pdf") {
//             toast.error("Only PDF files are allowed");
//             return;
//         }

//         setFile(selectedFile);
//         setError(null);
//     };

//     const handleUpload = async () => {

//         if (!file) {
//             toast.error("Please select a resume");
//             return;
//         }

//         try {

//             setLoading(true);
//             setError(null);

//             const response = await uploadResume(file);

//             setResume(response.resume);

//             toast.success("Resume analyzed successfully 🎉");

//         } catch (error) {

//             const message = error?.response?.data?.message ||
//                 "Failed to analyze resume";

//             setError(message);

//             toast.error(message);

//         } finally {

//             setLoading(false);
//         }
//     }

//     if (resume) {

//         const {
//             personalInfo,
//             summary,
//             experience,
//             projects,
//             education,
//             certifications,
//             links,
//             achievements
//         } = resume.parsedData || {};

//         console.log("achievements", achievements)


//         return (
//             <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">

//                 <div className="mx-auto max-w-5xl">

//                     <h1 className="mb-2 text-3xl font-bold">
//                         Resume Analysis
//                     </h1>

//                     <p className="mb-8 text-slate-400">
//                         Here's what we extracted from your resume.
//                     </p>


//                     {/* Personal Information */}

//                     <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                         <h2 className="mb-5 text-xl font-semibold">
//                             Personal Information
//                         </h2>

//                         <div className="grid gap-4 md:grid-cols-2">

//                             <div>
//                                 <p className="text-sm text-slate-400">
//                                     Name
//                                 </p>

//                                 <p className="mt-1">
//                                     {personalInfo?.name || "—"}
//                                 </p>
//                             </div>

//                             <div>
//                                 <p className="text-sm text-slate-400">
//                                     Email
//                                 </p>

//                                 <p className="mt-1">
//                                     {personalInfo?.email || "—"}
//                                 </p>
//                             </div>

//                             <div>
//                                 <p className="text-sm text-slate-400">
//                                     Phone
//                                 </p>

//                                 <p className="mt-1">
//                                     {personalInfo?.phone || "—"}
//                                 </p>
//                             </div>

//                             <div>
//                                 <p className="text-sm text-slate-400">
//                                     Location
//                                 </p>

//                                 <p className="mt-1">
//                                     {personalInfo?.location || "—"}
//                                 </p>
//                             </div>

//                         </div>

//                     </div>


//                     {/* Summary */}

//                     {summary && (
//                         <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                             <h2 className="mb-4 text-xl font-semibold">
//                                 Professional Summary
//                             </h2>

//                             <p className="leading-7 text-slate-300">
//                                 {summary}
//                             </p>

//                         </div>
//                     )}


//                     {/* achievement */}

//                     <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                         <h2 className="mb-5 text-xl font-semibold">
//                             achievement
//                         </h2>

//                         <div className="flex flex-wrap gap-3">

//                             {achievements?.length > 0 ? (

//                                 achievements.map((skill, index) => (
//                                     <span
//                                         key={index}
//                                         className="rounded-full bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 ring-1 ring-indigo-500/20"
//                                     >
//                                         {skill}
//                                     </span>
//                                 ))

//                             ) : (

//                                 <p className="text-slate-500">
//                                     No achievement found
//                                 </p>

//                             )}

//                         </div>

//                     </div>


//                     {/* Experience */}

//                     <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                         <h2 className="mb-5 text-xl font-semibold">
//                             Experience
//                         </h2>

//                         <div className="space-y-5">

//                             {experience?.length > 0 ? (

//                                 experience.map((item, index) => (

//                                     <div
//                                         key={index}
//                                         className="border-l-2 border-indigo-500 pl-5"
//                                     >

//                                         <h3 className="text-lg font-semibold">
//                                             {item.position}
//                                         </h3>

//                                         <p className="text-indigo-400">
//                                             {item.company}
//                                         </p>

//                                         <p className="mt-1 text-sm text-slate-500">
//                                             {item.startDate} - {item.endDate}
//                                         </p>

//                                         <p className="mt-3 leading-6 text-slate-300">
//                                             {item.description}
//                                         </p>

//                                     </div>

//                                 ))

//                             ) : (

//                                 <p className="text-slate-500">
//                                     No experience found
//                                 </p>

//                             )}

//                         </div>

//                     </div>


//                     {/* Achievements */}

//                     <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                         <h2 className="mb-5 text-xl font-semibold">
//                             Achievements
//                         </h2>

//                         {achievements?.length > 0 ? (

//                             <div className="flex flex-wrap gap-3">

//                                 {achievements.map((achievement, index) => (

//                                     <span
//                                         key={index}
//                                         className="rounded-lg bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 ring-1 ring-indigo-500/20"
//                                     >
//                                         {achievement}
//                                     </span>

//                                 ))}

//                             </div>

//                         ) : (

//                             <p className="text-sm text-slate-500">
//                                 No achievement found
//                             </p>

//                         )}

//                     </div>


//                     {/* Projects */}

//                     <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                         <h2 className="mb-5 text-xl font-semibold">
//                             Projects
//                         </h2>

//                         <div className="grid gap-4 md:grid-cols-2">

//                             {projects?.length > 0 ? (

//                                 projects.map((project, index) => (

//                                     <div
//                                         key={index}
//                                         className="rounded-xl border border-slate-800 bg-slate-950 p-5"
//                                     >

//                                         <h3 className="font-semibold">
//                                             {project.name}
//                                         </h3>

//                                         <p className="mt-2 text-sm leading-6 text-slate-400">
//                                             {project.description}
//                                         </p>

//                                         <div className="mt-4 flex flex-wrap gap-2">

//                                             {project.technologies?.map(
//                                                 (technology, techIndex) => (

//                                                     <span
//                                                         key={techIndex}
//                                                         className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300"
//                                                     >
//                                                         {technology}
//                                                     </span>

//                                                 )
//                                             )}

//                                         </div>

//                                     </div>

//                                 ))

//                             ) : (

//                                 <p className="text-slate-500">
//                                     No projects found
//                                 </p>

//                             )}

//                         </div>

//                     </div>


//                     {/* Education */}

//                     <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                         <h2 className="mb-5 text-xl font-semibold">
//                             Education
//                         </h2>

//                         <div className="space-y-4">

//                             {education?.length > 0 ? (

//                                 education.map((item, index) => (

//                                     <div key={index}>

//                                         <h3 className="font-semibold">
//                                             {item.degree}
//                                         </h3>

//                                         <p className="text-indigo-400">
//                                             {item.institution}
//                                         </p>

//                                         <p className="text-sm text-slate-400">
//                                             {item.field}
//                                         </p>

//                                         <p className="text-sm text-slate-500">
//                                             {item.startDate} - {item.endDate}
//                                         </p>

//                                     </div>

//                                 ))

//                             ) : (

//                                 <p className="text-slate-500">
//                                     No education information found
//                                 </p>

//                             )}

//                         </div>

//                     </div>


//                     {/* Certifications */}

//                     {certifications?.length > 0 && (

//                         <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                             <h2 className="mb-5 text-xl font-semibold">
//                                 Certifications
//                             </h2>

//                             <ul className="list-inside list-disc space-y-2 text-slate-300">

//                                 {certifications.map(
//                                     (certification, index) => (
//                                         <li key={index}>
//                                             {certification}
//                                         </li>
//                                     )
//                                 )}

//                             </ul>

//                         </div>

//                     )}


//                     {/* Links */}

//                     <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

//                         <h2 className="mb-5 text-xl font-semibold">
//                             Links
//                         </h2>

//                         <div className="space-y-2 text-indigo-400">

//                             {links?.github && (
//                                 <p>{links.github}</p>
//                             )}

//                             {links?.linkedin && (
//                                 <p>{links.linkedin}</p>
//                             )}

//                             {links?.portfolio && (
//                                 <p>{links.portfolio}</p>
//                             )}

//                         </div>

//                     </div>

//                 </div>

//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">

//             <div className="mx-auto max-w-3xl">

//                 <div className="mb-10 text-center">

//                     <h1 className="text-4xl font-bold">
//                         Resume Analyzer
//                     </h1>

//                     <p className="mt-3 text-slate-400">
//                         Upload your resume and let AI analyze your
//                         professional profile.
//                     </p>

//                 </div>


//                 <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

//                     <label
//                         htmlFor="resume"
//                         className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 px-6 py-14 transition hover:border-indigo-500"
//                     >

//                         <div className="mb-4 text-5xl">
//                             📄
//                         </div>

//                         <p className="text-lg font-medium">
//                             {file
//                                 ? file.name
//                                 : "Choose your resume"
//                             }
//                         </p>

//                         <p className="mt-2 text-sm text-slate-500">
//                             PDF files only · Maximum 5 MB
//                         </p>

//                         <input
//                             id="resume"
//                             type="file"
//                             accept="application/pdf"
//                             onChange={handleFileChange}
//                             className="hidden"
//                         />

//                     </label>


//                     {error && (
//                         <p className="mt-4 text-center text-sm text-red-400">
//                             {error}
//                         </p>
//                     )}


//                     <button
//                         onClick={handleUpload}
//                         disabled={!file || loading}
//                         className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
//                     >

//                         {loading
//                             ? "Analyzing Resume..."
//                             : "Analyze Resume"
//                         }

//                     </button>

//                 </div>

//             </div>

//         </div>
//     );

// }

// export default ResumeAnalyzer


import React, { useEffect, useState, useRef } from "react";
import { uploadResume } from "../services/resumeService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { animate, stagger } from "animejs";
import {
    FileText,
    Sparkles,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    Award,
    FolderKanban,
    Globe,
    CheckCircle2,
    UploadCloud,
    Loader2,
} from "lucide-react";

function prefersReducedMotion() {
    return (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

const ResumeAnalyzer = () => {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resume, setResume] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const pageRef = useRef(null);

    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            return;
        }

        if (selectedFile.type !== "application/pdf") {
            toast.error("Only PDF files are allowed");
            return;
        }

        setFile(selectedFile);
        setError(null);
    };

    const handleUpload = async () => {

        if (!file) {
            toast.error("Please select a resume");
            return;
        }

        try {

            setLoading(true);
            setError(null);

            const response = await uploadResume(file);

            setResume(response.resume);

            toast.success("Resume analyzed successfully 🎉");

        } catch (error) {

            const message = error?.response?.data?.message ||
                "Failed to analyze resume";

            setError(message);

            toast.error(message);

        } finally {

            setLoading(false);
        }
    }

    // Entrance / re-entrance animation whenever the view (upload vs. results) changes.
    useEffect(() => {
        if (!pageRef.current) return;
        const reduced = prefersReducedMotion();

        animate(pageRef.current.children, {
            opacity: [0, 1],
            translateY: [14, 0],
            duration: reduced ? 0 : 450,
            delay: reduced ? 0 : stagger(80),
            ease: "outQuad",
        });
    }, [resume]);

    if (resume) {

        const {
            personalInfo,
            summary,
            experience,
            projects,
            education,
            certifications,
            links,
            achievements
        } = resume.parsedData || {};

        return (
            <div className="min-h-screen bg-[#EDEEEA] px-6 py-10">

                <div ref={pageRef} className="mx-auto max-w-5xl">

                    <div style={{ opacity: 0 }} className="mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-[#E3F0E8] flex items-center justify-center">
                                <CheckCircle2 size={18} strokeWidth={1.8} className="text-[#3B7A57]" />
                            </div>
                            <p className="text-[24px] font-semibold text-[#14213D] font-['Lora',_Georgia,_serif] m-0">
                                Resume analysis
                            </p>
                        </div>
                        <p className="mt-2 text-[14.5px] text-[#6B7280] m-0 ml-[46px]">
                            Here's what we extracted from your resume.
                        </p>
                    </div>


                    {/* Personal Information */}

                    <div style={{ opacity: 0 }} className="mb-5 rounded-[10px] border border-[#D8D9D3] bg-white p-6">

                        <p className="mb-5 text-[16px] font-semibold text-[#14213D] m-0">
                            Personal information
                        </p>

                        <div className="grid gap-5 md:grid-cols-2">

                            <InfoField icon={<User size={15} strokeWidth={1.8} />} label="Name" value={personalInfo?.name} />
                            <InfoField icon={<Mail size={15} strokeWidth={1.8} />} label="Email" value={personalInfo?.email} />
                            <InfoField icon={<Phone size={15} strokeWidth={1.8} />} label="Phone" value={personalInfo?.phone} />
                            <InfoField icon={<MapPin size={15} strokeWidth={1.8} />} label="Location" value={personalInfo?.location} />

                        </div>

                    </div>


                    {/* Summary */}

                    {summary && (
                        <div style={{ opacity: 0 }} className="mb-5 rounded-[10px] border border-[#D8D9D3] bg-white p-6">

                            <p className="mb-4 flex items-center gap-1.5 text-[16px] font-semibold text-[#14213D] m-0">
                                <Sparkles size={15} strokeWidth={2} className="text-[#C9822A]" />
                                Professional summary
                            </p>

                            <p className="leading-7 text-[14.5px] text-[#14213D] m-0">
                                {summary}
                            </p>

                        </div>
                    )}


                    {/* Achievements */}

                    <div style={{ opacity: 0 }} className="mb-5 rounded-[10px] border border-[#D8D9D3] bg-white p-6">

                        <p className="mb-5 flex items-center gap-1.5 text-[16px] font-semibold text-[#14213D] m-0">
                            <Award size={15} strokeWidth={1.8} className="text-[#C9822A]" />
                            Achievements
                        </p>

                        {achievements?.length > 0 ? (

                            <div className="flex flex-wrap gap-2.5">

                                {achievements.map((achievement, index) => (

                                    <span
                                        key={index}
                                        className="rounded-full bg-[#FBEEDA] px-4 py-2 text-[13px] font-medium text-[#C9822A]"
                                    >
                                        {achievement}
                                    </span>

                                ))}

                            </div>

                        ) : (

                            <p className="text-[13.5px] text-[#9CA0A8] m-0">
                                No achievements found
                            </p>

                        )}

                    </div>


                    {/* Experience */}

                    <div style={{ opacity: 0 }} className="mb-5 rounded-[10px] border border-[#D8D9D3] bg-white p-6">

                        <p className="mb-5 flex items-center gap-1.5 text-[16px] font-semibold text-[#14213D] m-0">
                            <Briefcase size={15} strokeWidth={1.8} className="text-[#14213D]" />
                            Experience
                        </p>

                        <div className="space-y-6">

                            {experience?.length > 0 ? (

                                experience.map((item, index) => (

                                    <div
                                        key={index}
                                        className="border-l-2 border-[#E8A33D] pl-5"
                                    >

                                        <p className="text-[15px] font-semibold text-[#14213D] m-0">
                                            {item.position}
                                        </p>

                                        <p className="text-[13.5px] font-medium text-[#C9822A] mt-0.5 m-0">
                                            {item.company}
                                        </p>

                                        <p className="mt-1 text-[12.5px] text-[#9CA0A8] m-0">
                                            {item.startDate} - {item.endDate}
                                        </p>

                                        <p className="mt-3 leading-6 text-[14px] text-[#4B5160] m-0">
                                            {item.description}
                                        </p>

                                    </div>

                                ))

                            ) : (

                                <p className="text-[13.5px] text-[#9CA0A8] m-0">
                                    No experience found
                                </p>

                            )}

                        </div>

                    </div>


                    {/* Projects */}

                    <div style={{ opacity: 0 }} className="mb-5 rounded-[10px] border border-[#D8D9D3] bg-white p-6">

                        <p className="mb-5 flex items-center gap-1.5 text-[16px] font-semibold text-[#14213D] m-0">
                            <FolderKanban size={15} strokeWidth={1.8} className="text-[#14213D]" />
                            Projects
                        </p>

                        <div className="grid gap-4 md:grid-cols-2">

                            {projects?.length > 0 ? (

                                projects.map((project, index) => (

                                    <div
                                        key={index}
                                        className="rounded-[8px] border border-[#D8D9D3] bg-[#F7F7F4] p-5"
                                    >

                                        <p className="font-semibold text-[14.5px] text-[#14213D] m-0">
                                            {project.name}
                                        </p>

                                        <p className="mt-2 text-[13.5px] leading-6 text-[#6B7280] m-0">
                                            {project.description}
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-1.5">

                                            {project.technologies?.map(
                                                (technology, techIndex) => (

                                                    <span
                                                        key={techIndex}
                                                        className="rounded-[5px] bg-white border border-[#D8D9D3] px-2 py-1 text-[11.5px] text-[#4B5160]"
                                                    >
                                                        {technology}
                                                    </span>

                                                )
                                            )}

                                        </div>

                                    </div>

                                ))

                            ) : (

                                <p className="text-[13.5px] text-[#9CA0A8] m-0">
                                    No projects found
                                </p>

                            )}

                        </div>

                    </div>


                    {/* Education */}

                    <div style={{ opacity: 0 }} className="mb-5 rounded-[10px] border border-[#D8D9D3] bg-white p-6">

                        <p className="mb-5 flex items-center gap-1.5 text-[16px] font-semibold text-[#14213D] m-0">
                            <GraduationCap size={15} strokeWidth={1.8} className="text-[#14213D]" />
                            Education
                        </p>

                        <div className="space-y-5">

                            {education?.length > 0 ? (

                                education.map((item, index) => (

                                    <div key={index}>

                                        <p className="font-semibold text-[14.5px] text-[#14213D] m-0">
                                            {item.degree}
                                        </p>

                                        <p className="text-[13.5px] font-medium text-[#C9822A] mt-0.5 m-0">
                                            {item.institution}
                                        </p>

                                        <p className="text-[13px] text-[#6B7280] mt-0.5 m-0">
                                            {item.field}
                                        </p>

                                        <p className="text-[12.5px] text-[#9CA0A8] mt-0.5 m-0">
                                            {item.startDate} - {item.endDate}
                                        </p>

                                    </div>

                                ))

                            ) : (

                                <p className="text-[13.5px] text-[#9CA0A8] m-0">
                                    No education information found
                                </p>

                            )}

                        </div>

                    </div>


                    {/* Certifications */}

                    {certifications?.length > 0 && (

                        <div style={{ opacity: 0 }} className="mb-5 rounded-[10px] border border-[#D8D9D3] bg-white p-6">

                            <p className="mb-5 flex items-center gap-1.5 text-[16px] font-semibold text-[#14213D] m-0">
                                <Award size={15} strokeWidth={1.8} className="text-[#14213D]" />
                                Certifications
                            </p>

                            <div className="flex flex-col gap-2.5">

                                {certifications.map(
                                    (certification, index) => (
                                        <div key={index} className="flex items-center gap-2.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D] shrink-0" />
                                            <span className="text-[14px] text-[#14213D]">
                                                {certification}
                                            </span>
                                        </div>
                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {/* Links */}

                    <div style={{ opacity: 0 }} className="rounded-[10px] border border-[#D8D9D3] bg-white p-6">

                        <p className="mb-5 text-[16px] font-semibold text-[#14213D] m-0">
                            Links
                        </p>

                        <div className="flex flex-wrap gap-3">

                            {links?.github && (
                                <LinkChip icon={<GithubMark />} href={links.github} />
                            )}

                            {links?.linkedin && (
                                <LinkChip icon={<LinkedinMark />} href={links.linkedin} />
                            )}

                            {links?.portfolio && (
                                <LinkChip icon={<Globe size={14} strokeWidth={1.8} />} href={links.portfolio} />
                            )}

                            {!links?.github && !links?.linkedin && !links?.portfolio && (
                                <p className="text-[13.5px] text-[#9CA0A8] m-0">No links found</p>
                            )}

                        </div>

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EDEEEA] px-6 py-10">

            <div ref={pageRef} className="mx-auto max-w-[560px]">

                <div style={{ opacity: 0 }} className="mb-8 text-center">

                    <div className="mx-auto w-12 h-12 rounded-full bg-[#E7EAF3] flex items-center justify-center mb-4">
                        <Sparkles size={22} strokeWidth={1.8} className="text-[#14213D]" />
                    </div>

                    <p className="text-[26px] font-semibold text-[#14213D] font-['Lora',_Georgia,_serif] m-0">
                        Resume analyzer
                    </p>

                    <p className="mt-2.5 text-[14.5px] text-[#6B7280] m-0">
                        Upload your resume and let AI analyze your professional profile.
                    </p>

                </div>


                <div style={{ opacity: 0 }} className="rounded-[10px] border border-[#D8D9D3] bg-white p-8">

                    <label
                        htmlFor="resume"
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-[8px] border-2 border-dashed px-6 py-14 transition-colors duration-150 ${
                            file
                                ? "border-[#3B7A57] bg-[#F3F8F5]"
                                : "border-[#D8D9D3] bg-[#F7F7F4] hover:border-[#E8A33D]"
                        }`}
                    >

                        <div
                            className={`mb-4 w-14 h-14 rounded-full flex items-center justify-center ${
                                file ? "bg-[#E3F0E8]" : "bg-white border border-[#D8D9D3]"
                            }`}
                        >
                            {file ? (
                                <CheckCircle2 size={26} strokeWidth={1.8} className="text-[#3B7A57]" />
                            ) : (
                                <UploadCloud size={24} strokeWidth={1.8} className="text-[#6B7280]" />
                            )}
                        </div>

                        <p className="text-[15px] font-semibold text-[#14213D] m-0">
                            {file ? file.name : "Choose your resume"}
                        </p>

                        <p className="mt-2 text-[13px] text-[#9CA0A8] m-0">
                            PDF files only · Maximum 5 MB
                        </p>

                        <input
                            id="resume"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                    </label>


                    {error && (
                        <div className="mt-4 rounded-[6px] bg-[#FBEAEA] border border-[#F0C9C9] px-3.5 py-2.5">
                            <p className="text-[13px] text-[#C24444] m-0 text-center">{error}</p>
                        </div>
                    )}


                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#14213D] px-6 py-3.5 font-medium text-[14.5px] text-white transition-colors duration-150 hover:bg-[#24304F] disabled:cursor-not-allowed disabled:opacity-40"
                    >

                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" strokeWidth={2} />
                                Analyzing your resume
                            </>
                        ) : (
                            <>
                                <FileText size={16} strokeWidth={1.8} />
                                Analyze resume
                            </>
                        )}

                    </button>

                </div>

            </div>

        </div>
    );

}

function InfoField({ icon, label, value }) {
    return (
        <div>
            <p className="flex items-center gap-1.5 text-[12.5px] text-[#6B7280] m-0">
                <span className="text-[#9CA0A8]">{icon}</span>
                {label}
            </p>
            <p className="mt-1 text-[14px] text-[#14213D] m-0">
                {value || "—"}
            </p>
        </div>
    );
}

function GithubMark() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
        </svg>
    );
}

function LinkedinMark() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
        </svg>
    );
}

function LinkChip({ icon, href }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-[#D8D9D3] bg-[#F7F7F4] px-3.5 py-2 text-[13px] text-[#14213D] transition-colors duration-150 hover:border-[#14213D] hover:bg-[#E7EAF3]"
        >
            {icon}
            {href}
        </a>
    );
}

export default ResumeAnalyzer