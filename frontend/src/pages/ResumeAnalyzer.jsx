import React, { useEffect, useState } from "react";
import { uploadResume } from "../services/resumeService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const ResumeAnalyzer = () => {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resume, setResume] = useState(null);
    const [error, setError] = useState(null);

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

        console.log("achievements", achievements)


        return (
            <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">

                <div className="mx-auto max-w-5xl">

                    <h1 className="mb-2 text-3xl font-bold">
                        Resume Analysis
                    </h1>

                    <p className="mb-8 text-slate-400">
                        Here's what we extracted from your resume.
                    </p>


                    {/* Personal Information */}

                    <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-5 text-xl font-semibold">
                            Personal Information
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">

                            <div>
                                <p className="text-sm text-slate-400">
                                    Name
                                </p>

                                <p className="mt-1">
                                    {personalInfo?.name || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    Email
                                </p>

                                <p className="mt-1">
                                    {personalInfo?.email || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    Phone
                                </p>

                                <p className="mt-1">
                                    {personalInfo?.phone || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    Location
                                </p>

                                <p className="mt-1">
                                    {personalInfo?.location || "—"}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Summary */}

                    {summary && (
                        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                            <h2 className="mb-4 text-xl font-semibold">
                                Professional Summary
                            </h2>

                            <p className="leading-7 text-slate-300">
                                {summary}
                            </p>

                        </div>
                    )}


                    {/* achievement */}

                    <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-5 text-xl font-semibold">
                            achievement
                        </h2>

                        <div className="flex flex-wrap gap-3">

                            {achievements?.length > 0 ? (

                                achievements.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="rounded-full bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 ring-1 ring-indigo-500/20"
                                    >
                                        {skill}
                                    </span>
                                ))

                            ) : (

                                <p className="text-slate-500">
                                    No achievement found
                                </p>

                            )}

                        </div>

                    </div>


                    {/* Experience */}

                    <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-5 text-xl font-semibold">
                            Experience
                        </h2>

                        <div className="space-y-5">

                            {experience?.length > 0 ? (

                                experience.map((item, index) => (

                                    <div
                                        key={index}
                                        className="border-l-2 border-indigo-500 pl-5"
                                    >

                                        <h3 className="text-lg font-semibold">
                                            {item.position}
                                        </h3>

                                        <p className="text-indigo-400">
                                            {item.company}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {item.startDate} - {item.endDate}
                                        </p>

                                        <p className="mt-3 leading-6 text-slate-300">
                                            {item.description}
                                        </p>

                                    </div>

                                ))

                            ) : (

                                <p className="text-slate-500">
                                    No experience found
                                </p>

                            )}

                        </div>

                    </div>


                    {/* Achievements */}

                    <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-5 text-xl font-semibold">
                            Achievements
                        </h2>

                        {achievements?.length > 0 ? (

                            <div className="flex flex-wrap gap-3">

                                {achievements.map((achievement, index) => (

                                    <span
                                        key={index}
                                        className="rounded-lg bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 ring-1 ring-indigo-500/20"
                                    >
                                        {achievement}
                                    </span>

                                ))}

                            </div>

                        ) : (

                            <p className="text-sm text-slate-500">
                                No achievement found
                            </p>

                        )}

                    </div>


                    {/* Projects */}

                    <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-5 text-xl font-semibold">
                            Projects
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">

                            {projects?.length > 0 ? (

                                projects.map((project, index) => (

                                    <div
                                        key={index}
                                        className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                                    >

                                        <h3 className="font-semibold">
                                            {project.name}
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-slate-400">
                                            {project.description}
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-2">

                                            {project.technologies?.map(
                                                (technology, techIndex) => (

                                                    <span
                                                        key={techIndex}
                                                        className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300"
                                                    >
                                                        {technology}
                                                    </span>

                                                )
                                            )}

                                        </div>

                                    </div>

                                ))

                            ) : (

                                <p className="text-slate-500">
                                    No projects found
                                </p>

                            )}

                        </div>

                    </div>


                    {/* Education */}

                    <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-5 text-xl font-semibold">
                            Education
                        </h2>

                        <div className="space-y-4">

                            {education?.length > 0 ? (

                                education.map((item, index) => (

                                    <div key={index}>

                                        <h3 className="font-semibold">
                                            {item.degree}
                                        </h3>

                                        <p className="text-indigo-400">
                                            {item.institution}
                                        </p>

                                        <p className="text-sm text-slate-400">
                                            {item.field}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            {item.startDate} - {item.endDate}
                                        </p>

                                    </div>

                                ))

                            ) : (

                                <p className="text-slate-500">
                                    No education information found
                                </p>

                            )}

                        </div>

                    </div>


                    {/* Certifications */}

                    {certifications?.length > 0 && (

                        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                            <h2 className="mb-5 text-xl font-semibold">
                                Certifications
                            </h2>

                            <ul className="list-inside list-disc space-y-2 text-slate-300">

                                {certifications.map(
                                    (certification, index) => (
                                        <li key={index}>
                                            {certification}
                                        </li>
                                    )
                                )}

                            </ul>

                        </div>

                    )}


                    {/* Links */}

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-5 text-xl font-semibold">
                            Links
                        </h2>

                        <div className="space-y-2 text-indigo-400">

                            {links?.github && (
                                <p>{links.github}</p>
                            )}

                            {links?.linkedin && (
                                <p>{links.linkedin}</p>
                            )}

                            {links?.portfolio && (
                                <p>{links.portfolio}</p>
                            )}

                        </div>

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">

            <div className="mx-auto max-w-3xl">

                <div className="mb-10 text-center">

                    <h1 className="text-4xl font-bold">
                        Resume Analyzer
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Upload your resume and let AI analyze your
                        professional profile.
                    </p>

                </div>


                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

                    <label
                        htmlFor="resume"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 px-6 py-14 transition hover:border-indigo-500"
                    >

                        <div className="mb-4 text-5xl">
                            📄
                        </div>

                        <p className="text-lg font-medium">
                            {file
                                ? file.name
                                : "Choose your resume"
                            }
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
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
                        <p className="mt-4 text-center text-sm text-red-400">
                            {error}
                        </p>
                    )}


                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >

                        {loading
                            ? "Analyzing Resume..."
                            : "Analyze Resume"
                        }

                    </button>

                </div>

            </div>

        </div>
    );

}

export default ResumeAnalyzer
