import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getResumes, deleteResume } from "../services/resumeService";


const Resumes = () => {

    const navigate = useNavigate();

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Search and filter
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");


    useEffect(() => {

        const fetchResumes = async () => {

            try {

                setLoading(true);

                const response = await getResumes();

                setResumes(response);

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to load resumes"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchResumes();

    }, []);


    // useEffect(() => {
    //     console.log("Resumes", resumes);
    // }, [resumes]);


    const filteredResumes = resumes.filter((resume) => {

        const parsedData = resume.parsedData || {};
        const personalInfo = parsedData.personalInfo || {};
        const skills = parsedData.skills || [];

        const searchTerm = search.toLowerCase();

        const matchesSearch =
            resume.originalFile?.filename
                ?.toLowerCase()
                .includes(searchTerm) ||

            personalInfo.name
                ?.toLowerCase()
                .includes(searchTerm) ||

            personalInfo.email
                ?.toLowerCase()
                .includes(searchTerm) ||

            skills.some((skill) =>
                skill.toLowerCase().includes(searchTerm)
            );


        const matchesFilter =
            filter === "all" ||
            (filter === "analyzed" && resume.analysis) ||
            (filter === "not-analyzed" && !resume.analysis);


        return matchesSearch && matchesFilter;
    });


    const handleDelete = async (resumeId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this resume?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            setDeletingId(resumeId);

            await deleteResume(resumeId);

            setResumes((prev) =>
                prev.filter((resume) => resume._id !== resumeId)
            );

            toast.success("Resume deleted successfully");

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed to delete resume"
            );

        } finally {

            setDeletingId(null);
        }
    };


    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

                <div className="text-center">

                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />

                    <p className="text-slate-400">
                        Loading resumes...
                    </p>

                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">

                <p className="text-red-400">
                    {error}
                </p>

            </div>
        );
    }


    return (

        <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">

            <div className="mx-auto max-w-6xl">


                {/* Header */}

                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>

                        <h1 className="text-3xl font-bold">
                            My Resumes
                        </h1>

                        <p className="mt-2 text-slate-400">
                            View and manage your uploaded resumes
                        </p>

                    </div>

                    {/* Search & Filters */}

                    <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-4">

                        <div className="flex flex-col gap-4 md:flex-row">

                            {/* Search */}

                            <div className="relative flex-1">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    🔍
                                </span>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search resumes, names, skills..."
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />

                            </div>


                            {/* Filter */}

                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            >

                                <option value="all">
                                    All Resumes
                                </option>

                                <option value="analyzed">
                                    Analyzed
                                </option>

                                <option value="not-analyzed">
                                    Not Analyzed
                                </option>

                            </select>


                            {/* Clear */}

                            {(search || filter !== "all") && (

                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setFilter("all");
                                    }}
                                    className="rounded-xl border border-slate-700 px-5 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                >
                                    Clear
                                </button>

                            )}

                        </div>


                        {/* Result count */}

                        <div className="mt-4 text-sm text-slate-500">

                            Showing{" "}
                            <span className="font-medium text-slate-300">
                                {filteredResumes.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-slate-300">
                                {resumes.length}
                            </span>{" "}
                            resumes

                        </div>

                    </div>


                    <button
                        onClick={() => navigate("/resume/analyzer")}
                        className="rounded-xl bg-indigo-600 px-5 py-3 font-medium transition hover:bg-indigo-500"
                    >
                        + Upload Resume
                    </button>

                </div>


                {/* Resume list */}

                {resumes.length === 0 ? (

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

                        <div className="mb-4 text-5xl">
                            📄
                        </div>

                        <h2 className="text-xl font-semibold">
                            No resumes yet
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Upload your first resume to get started.
                        </p>

                        <button
                            onClick={() => navigate("/resume/analyzer")}
                            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-500"
                        >
                            Upload Resume
                        </button>

                    </div>

                ) : filteredResumes.length === 0 ? (

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

                        <div className="mb-4 text-4xl">
                            🔍
                        </div>

                        <h2 className="text-xl font-semibold">
                            No matching resumes
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Try changing your search or filters.
                        </p>

                        <button
                            onClick={() => {
                                setSearch("");
                                setFilter("all");
                            }}
                            className="mt-5 rounded-lg border border-slate-700 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                            <div className="grid gap-6 md:grid-cols-2">


                                {filteredResumes?.map((resume) => {

                                    const parsedData = resume.parsedData || {};
                                    const analysis = resume.analysis || {};

                                    const personalInfo =
                                        parsedData.personalInfo || {};

                                    const skills =
                                        parsedData.skills || [];


                                    return (

                                        <div
                                            key={resume._id}
                                            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
                                        >


                                            {/* Resume header */}

                                            <div className="flex items-start justify-between gap-4">

                                                <div className="flex items-center gap-4">

                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl">
                                                        📄
                                                    </div>


                                                    <div>

                                                        <h2 className="font-semibold">

                                                            {resume.originalFile?.filename ||
                                                                "Resume"}

                                                        </h2>

                                                        <p className="mt-1 text-sm text-slate-500">

                                                            {resume.createdAt
                                                                ? new Date(
                                                                    resume.createdAt
                                                                ).toLocaleDateString()
                                                                : "Unknown date"}

                                                        </p>

                                                    </div>

                                                </div>


                                                {/* Delete */}

                                                <button
                                                    onClick={() =>
                                                        handleDelete(resume._id)
                                                    }
                                                    disabled={
                                                        deletingId === resume._id
                                                    }
                                                    className="rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                                                >

                                                    {deletingId === resume._id
                                                        ? "Deleting..."
                                                        : "Delete"}

                                                </button>

                                            </div>


                                            {/* Score */}

                                            <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-950 p-4">

                                                <div>

                                                    <p className="text-sm text-slate-400">
                                                        Resume Score
                                                    </p>

                                                    <p className="mt-1 text-2xl font-bold text-indigo-400">

                                                        {analysis.score ?? "—"}

                                                        {analysis.score != null && (
                                                            <span className="text-sm text-slate-500">
                                                                /100
                                                            </span>
                                                        )}

                                                    </p>

                                                </div>


                                                <div className="text-right">

                                                    <p className="text-sm text-slate-400">
                                                        Skills
                                                    </p>

                                                    <p className="mt-1 font-semibold">
                                                        {skills.length}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Candidate */}

                                            <div className="mt-5">

                                                <p className="text-sm text-slate-400">
                                                    Candidate
                                                </p>

                                                <p className="mt-1 font-medium">
                                                    {personalInfo.name || "Unknown"}
                                                </p>

                                            </div>


                                            {/* Skills */}

                                            <div className="mt-5">

                                                <p className="mb-2 text-sm text-slate-400">
                                                    Skills
                                                </p>

                                                <div className="flex flex-wrap gap-2">

                                                    {skills.length > 0 ? (

                                                        skills
                                                            .slice(0, 6)
                                                            .map((skill, index) => (

                                                                <span
                                                                    key={index}
                                                                    className="rounded-md bg-slate-800 px-2.5 py-1 text-xs text-slate-300"
                                                                >
                                                                    {skill}
                                                                </span>

                                                            ))

                                                    ) : (

                                                        <span className="text-sm text-slate-500">
                                                            No skills found
                                                        </span>

                                                    )}


                                                    {skills.length > 6 && (

                                                        <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs text-slate-500">

                                                            +{skills.length - 6}

                                                        </span>

                                                    )}

                                                </div>

                                            </div>


                                            {/* Actions */}

                                            <div className="mt-6 flex gap-3 border-t border-slate-800 pt-5">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/resumes/${resume._id}/report`
                                                        )
                                                    }
                                                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium transition hover:bg-indigo-500"
                                                >
                                                    View Report
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/resumes/${resume._id}`
                                                        )
                                                    }
                                                    className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                                                >
                                                    View Details
                                                </button>

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        

                    

                )}

            </div>

        </div>

    );
};


export default Resumes;