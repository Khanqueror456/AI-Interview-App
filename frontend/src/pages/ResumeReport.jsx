import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResume } from "../services/resumeService";

const ResumeReport = () => {

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
                    Loading resume analysis...
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
        links
    } = resume.parsedData || {};


    const {
        score,
        strengths,
        weaknesses,
        suggestions,
        missingSkills
    } = resume.analysis || {};


    return (
        <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">

            <div className="mx-auto max-w-6xl">


                {/* Header */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        Resume Report
                    </h1>

                    <p className="mt-2 text-slate-400">
                        AI-powered analysis of your resume
                    </p>

                </div>


                {/* Score */}

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">

                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

                        <div>

                            <p className="text-sm text-slate-400">
                                Overall Resume Score
                            </p>

                            <h2 className="mt-2 text-5xl font-bold text-indigo-400">
                                {score ?? 0}
                                <span className="text-2xl text-slate-500">
                                    /100
                                </span>
                            </h2>

                        </div>


                        <div className="w-full max-w-md">

                            <div className="mb-2 flex justify-between text-sm">

                                <span className="text-slate-400">
                                    Resume quality
                                </span>

                                <span className="text-slate-300">
                                    {score ?? 0}%
                                </span>

                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                                <div
                                    className="h-full rounded-full bg-indigo-500 transition-all"
                                    style={{
                                        width: `${score ?? 0}%`
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* Strengths / Weaknesses */}

                <div className="mb-6 grid gap-6 md:grid-cols-2">


                    {/* Strengths */}

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-5 text-xl font-semibold">
                            Strengths
                        </h2>

                        <div className="space-y-3">

                            {strengths?.length > 0 ? (

                                strengths.map((item, index) => (

                                    <div
                                        key={index}
                                        className="flex gap-3 rounded-lg bg-slate-950 p-3"
                                    >

                                        <span className="text-green-400">
                                            ✓
                                        </span>

                                        <p className="text-sm text-slate-300">
                                            {item}
                                        </p>

                                    </div>

                                ))

                            ) : (

                                <p className="text-slate-500">
                                    No strengths identified.
                                </p>

                            )}

                        </div>

                    </div>


                    {/* Weaknesses */}

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="mb-5 text-xl font-semibold">
                            Areas to Improve
                        </h2>

                        <div className="space-y-3">

                            {weaknesses?.length > 0 ? (

                                weaknesses.map((item, index) => (

                                    <div
                                        key={index}
                                        className="flex gap-3 rounded-lg bg-slate-950 p-3"
                                    >

                                        <span className="text-yellow-400">
                                            !
                                        </span>

                                        <p className="text-sm text-slate-300">
                                            {item}
                                        </p>

                                    </div>

                                ))

                            ) : (

                                <p className="text-slate-500">
                                    No major weaknesses identified.
                                </p>

                            )}

                        </div>

                    </div>

                </div>


                {/* Suggestions */}

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        Recommendations
                    </h2>

                    <div className="space-y-3">

                        {suggestions?.map((item, index) => (

                            <div
                                key={index}
                                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                            >

                                <p className="text-sm leading-6 text-slate-300">
                                    {item}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>


                {/* Missing Skills */}

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        Skills to Consider Adding
                    </h2>

                    <div className="flex flex-wrap gap-3">

                        {missingSkills?.length > 0 ? (

                            missingSkills.map((skill, index) => (

                                <span
                                    key={index}
                                    className="rounded-full bg-red-500/10 px-4 py-2 text-sm text-red-300 ring-1 ring-red-500/20"
                                >
                                    {skill}
                                </span>

                            ))

                        ) : (

                            <p className="text-slate-500">
                                No additional skills identified.
                            </p>

                        )}

                    </div>

                </div>


                {/* Candidate */}

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        Candidate Profile
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">

                        <div>

                            <p className="text-sm text-slate-400">
                                Name
                            </p>

                            <p className="mt-1 font-medium">
                                {personalInfo?.name || "—"}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-slate-400">
                                Email
                            </p>

                            <p className="mt-1 font-medium">
                                {personalInfo?.email || "—"}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-slate-400">
                                Phone
                            </p>

                            <p className="mt-1 font-medium">
                                {personalInfo?.phone || "—"}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-slate-400">
                                Location
                            </p>

                            <p className="mt-1 font-medium">
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

                    <div className="flex flex-wrap gap-3">

                        {skills?.map((skill, index) => (

                            <span
                                key={index}
                                className="rounded-lg bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 ring-1 ring-indigo-500/20"
                            >
                                {skill}
                            </span>

                        ))}

                    </div>

                </div>


                {/* Experience */}

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        Experience
                    </h2>

                    <div className="space-y-6">

                        {experience?.map((item, index) => (

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

                                <p className="mt-3 leading-7 text-slate-300">
                                    {item.description}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>


                {/* Projects */}

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        Projects
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">

                        {projects?.map((project, index) => (

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

                        ))}

                    </div>

                </div>


                {/* Education */}

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <h2 className="mb-5 text-xl font-semibold">
                        Education
                    </h2>

                    <div className="space-y-4">

                        {education?.map((item, index) => (

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

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ResumeReport;