import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResume } from "../services/resumeService";

const ResumeDetails = () => {

    const { id } = useParams();

    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {

        const fetchResume = async () => {

            try {

                const response = await getResume(id);

                setResume(response.resume);

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to load resume"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchResume();

    }, [id]);


    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                <p className="text-slate-400">
                    Loading resume...
                </p>
            </div>
        );
    }


    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-400">
                {error}
            </div>
        );
    }


    if (!resume) {
        return null;
    }


    const {
        personalInfo,
        summary,
        skills,
        experience,
        projects,
        education,
        certifications,
        links,
        achievements
    } = resume.parsedData || {};


    return (
        <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">

            <div className="mx-auto max-w-5xl">

                {/* Header */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        Resume Details
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Parsed information extracted from your resume
                    </p>

                </div>


                {/* Personal Information */}

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        Personal Information
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">

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


                {/* Skills */}

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        Skills
                    </h2>

                    {skills?.length > 0 ? (

                        <div className="flex flex-wrap gap-3">

                            {skills.map((skill, index) => (

                                <span
                                    key={index}
                                    className="rounded-lg bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 ring-1 ring-indigo-500/20"
                                >
                                    {skill}
                                </span>

                            ))}

                        </div>

                    ) : (

                        <p className="text-slate-500">
                            No skills found
                        </p>

                    )}

                </div>


                {/* Experience */}

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        Experience
                    </h2>

                    {experience?.length > 0 ? (

                        <div className="space-y-6">

                            {experience.map((item, index) => (

                                <div
                                    key={index}
                                    className="border-l-2 border-indigo-500 pl-5"
                                >

                                    <h3 className="text-lg font-semibold">
                                        {item.position || "—"}
                                    </h3>

                                    <p className="text-indigo-400">
                                        {item.company || "—"}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {item.startDate || "—"} -{" "}
                                        {item.endDate || "Present"}
                                    </p>

                                    <p className="mt-3 leading-7 text-slate-300">
                                        {item.description || "—"}
                                    </p>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <p className="text-slate-500">
                            No experience found
                        </p>

                    )}

                </div>


                {/* Projects */}

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        Projects
                    </h2>

                    {projects?.length > 0 ? (

                        <div className="grid gap-5 md:grid-cols-2">

                            {projects.map((project, index) => (

                                <div
                                    key={index}
                                    className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                                >

                                    <h3 className="text-lg font-semibold">
                                        {project.name || "Unnamed Project"}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        {project.description || "—"}
                                    </p>


                                    {project.technologies?.length > 0 && (

                                        <div className="mt-4 flex flex-wrap gap-2">

                                            {project.technologies.map(
                                                (technology, techIndex) => (

                                                    <span
                                                        key={techIndex}
                                                        className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-300"
                                                    >
                                                        {technology}
                                                    </span>

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>

                            ))}

                        </div>

                    ) : (

                        <p className="text-slate-500">
                            No projects found
                        </p>

                    )}

                </div>


                {/* Education */}

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        Education
                    </h2>

                    {education?.length > 0 ? (

                        <div className="space-y-5">

                            {education.map((item, index) => (

                                <div
                                    key={index}
                                    className="rounded-xl bg-slate-950 p-5"
                                >

                                    <h3 className="font-semibold">
                                        {item.degree || "—"}
                                    </h3>

                                    <p className="mt-1 text-indigo-400">
                                        {item.institution || "—"}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {item.field || "—"}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {item.startDate || "—"} -{" "}
                                        {item.endDate || "Present"}
                                    </p>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <p className="text-slate-500">
                            No education information found
                        </p>

                    )}

                </div>


                {/* Achievements */}

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        Achievements
                    </h2>

                    {achievements?.length > 0 ? (

                        <div className="space-y-3">

                            {achievements.map((achievement, index) => (

                                <div
                                    key={index}
                                    className="rounded-lg bg-slate-950 p-4 text-slate-300"
                                >
                                    {achievement}
                                </div>

                            ))}

                        </div>

                    ) : (

                        <p className="text-slate-500">
                            No achievements found
                        </p>

                    )}

                </div>


                {/* Certifications */}

                {certifications?.length > 0 && (

                    <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-5 text-xl font-semibold">
                            Certifications
                        </h2>

                        <div className="space-y-3">

                            {certifications.map(
                                (certification, index) => (

                                    <div
                                        key={index}
                                        className="rounded-lg bg-slate-950 p-4 text-slate-300"
                                    >
                                        {certification}
                                    </div>

                                )
                            )}

                        </div>

                    </div>

                )}


                {/* Links */}

                {(links?.github ||
                    links?.linkedin ||
                    links?.portfolio) && (

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-5 text-xl font-semibold">
                            Links
                        </h2>

                        <div className="space-y-3">

                            {links?.github && (
                                <a
                                    href={links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block text-indigo-400 hover:text-indigo-300"
                                >
                                    GitHub
                                </a>
                            )}

                            {links?.linkedin && (
                                <a
                                    href={links.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block text-indigo-400 hover:text-indigo-300"
                                >
                                    LinkedIn
                                </a>
                            )}

                            {links?.portfolio && (
                                <a
                                    href={links.portfolio}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block text-indigo-400 hover:text-indigo-300"
                                >
                                    Portfolio
                                </a>
                            )}

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
};

export default ResumeDetails;