
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { animate, stagger } from "animejs";
import {
    Search,
    X,
    FileText,
    Trash2,
    User,
    Tag,
    ClipboardList,
    Eye,
    Briefcase,
    Target,
    FileQuestion,
    Plus,
} from "lucide-react";
import { getResumes, deleteResume } from "../services/resumeService";
import LoadingScreen from "../components/layout/LoadingScreen";
import ErrorScreen from "../components/layout/ErrorScreen";

function prefersReducedMotion() {
    return (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

const Resumes = () => {

    const navigate = useNavigate();

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Search and filter
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const headerRef = useRef(null);
    const gridRef = useRef(null);

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

    // Entrance animation once data has loaded in.
    useEffect(() => {
        if (loading || error) return;
        const reduced = prefersReducedMotion();

        animate(headerRef.current, {
            opacity: [0, 1],
            translateY: [10, 0],
            duration: reduced ? 0 : 450,
            ease: "outQuad",
        });
    }, [loading, error]);

    // Re-run the card stagger whenever the visible (filtered) set changes.
    useEffect(() => {
        if (loading || error || !gridRef.current) return;
        const reduced = prefersReducedMotion();

        animate(gridRef.current.children, {
            opacity: [0, 1],
            translateY: [14, 0],
            duration: reduced ? 0 : 400,
            delay: reduced ? 0 : stagger(70),
            ease: "outQuad",
        });
    }, [loading, error, filteredResumes]);


    if (loading) {
        return <LoadingScreen title="Loading your resumes" subtitle="This usually takes a few seconds." />;
    }


    if (error) {
        return (
            <ErrorScreen
                title="Couldn't load your resumes"
                body={error}
                onReconnect={() => window.location.reload()}
                onBack={() => navigate("/")}
            />
        );
    }

    const hasActiveFilters = search !== "" || filter !== "all";
    const clearFilters = () => {
        setSearch("");
        setFilter("all");
    };


    return (

        <div className="min-h-screen bg-[#EDEEEA] px-6 py-9">

            <div className="mx-auto max-w-6xl">


                {/* Header */}

                <div
                    ref={headerRef}
                    style={{ opacity: 0 }}
                    className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >

                    <div>
                        <p className="text-[24px] font-semibold text-[#14213D] font-['Lora',_Georgia,_serif] m-0">
                            Your resumes
                        </p>
                        <p className="mt-1.5 text-[14.5px] text-[#6B7280] m-0">
                            View and manage your uploaded resumes.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/resume/analyzer")}
                        className="flex items-center gap-1.5 bg-[#14213D] hover:bg-[#24304F] text-white text-sm font-medium px-4 py-2.5 rounded-[6px] transition-colors duration-150 w-fit"
                    >
                        <Plus size={16} strokeWidth={2} />
                        Upload resume
                    </button>

                </div>


                {/* Search & filters */}

                <div className="mb-8 rounded-[8px] border border-[#D8D9D3] bg-white p-4">

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">

                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search
                                size={16}
                                strokeWidth={1.8}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA0A8]"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search resumes, names, skills..."
                                className="w-full rounded-[6px] border border-[#D8D9D3] bg-white pl-9 pr-3 py-2.5 text-[13.5px] text-[#14213D] placeholder-[#9CA0A8] outline-none transition-colors duration-150 focus:border-[#14213D] focus:ring-1 focus:ring-[#14213D]"
                            />
                        </div>

                        {/* Filter */}
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="rounded-[6px] border border-[#D8D9D3] bg-white px-3 py-2.5 text-[13.5px] text-[#14213D] outline-none transition-colors duration-150 focus:border-[#14213D] focus:ring-1 focus:ring-[#14213D]"
                        >
                            <option value="all">All resumes</option>
                            <option value="analyzed">Analyzed</option>
                            <option value="not-analyzed">Not analyzed</option>
                        </select>

                        {/* Clear */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-[13px] font-medium text-[#6B7280] hover:text-[#14213D] transition-colors duration-150 px-2 py-2.5 whitespace-nowrap"
                            >
                                <X size={14} strokeWidth={2} />
                                Clear
                            </button>
                        )}

                    </div>

                    {/* Result count */}
                    <div className="mt-3 text-[13px] text-[#6B7280]">
                        Showing{" "}
                        <span className="font-medium text-[#14213D]">{filteredResumes.length}</span>{" "}
                        of{" "}
                        <span className="font-medium text-[#14213D]">{resumes.length}</span>{" "}
                        resumes
                    </div>

                </div>


                {/* Resume list */}

                {resumes.length === 0 ? (

                    <div className="rounded-[10px] border border-dashed border-[#D8D9D3] bg-white p-12 text-center">

                        <div className="w-12 h-12 rounded-full bg-[#F7F7F4] border border-[#D8D9D3] flex items-center justify-center mx-auto mb-4">
                            <FileQuestion size={22} strokeWidth={1.8} className="text-[#6B7280]" />
                        </div>

                        <p className="text-[16px] font-semibold text-[#14213D] m-0">No resumes yet</p>
                        <p className="mt-2 text-[14px] text-[#6B7280] mb-6">
                            Upload your first resume to get started.
                        </p>

                        <button
                            onClick={() => navigate("/resume/analyzer")}
                            className="inline-flex items-center gap-1.5 bg-[#14213D] hover:bg-[#24304F] text-white text-sm font-medium px-5 py-2.5 rounded-[6px] transition-colors duration-150"
                        >
                            <Plus size={16} strokeWidth={2} />
                            Upload resume
                        </button>

                    </div>

                ) : filteredResumes.length === 0 ? (

                    <div className="rounded-[10px] border border-dashed border-[#D8D9D3] bg-white p-12 text-center">

                        <div className="w-12 h-12 rounded-full bg-[#F7F7F4] border border-[#D8D9D3] flex items-center justify-center mx-auto mb-4">
                            <Search size={22} strokeWidth={1.8} className="text-[#6B7280]" />
                        </div>

                        <p className="text-[16px] font-semibold text-[#14213D] m-0">No matching resumes</p>
                        <p className="mt-2 text-[14px] text-[#6B7280] mb-6">
                            Try changing your search or filters.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1.5 border border-[#D8D9D3] hover:bg-[#F7F7F4] text-[#14213D] text-sm font-medium px-5 py-2.5 rounded-[6px] transition-colors duration-150"
                        >
                            <X size={15} strokeWidth={2} />
                            Clear filters
                        </button>

                    </div>

                ) : (

                    <div ref={gridRef} className="grid gap-5 md:grid-cols-2">

                        {filteredResumes?.map((resume) => {

                            const parsedData = resume.parsedData || {};
                            const analysis = resume.analysis || {};

                            const personalInfo = parsedData.personalInfo || {};
                            const skills = parsedData.skills || [];
                            const hasScore = analysis.score != null;

                            return (
                                <div
                                    key={resume._id}
                                    style={{ opacity: 0 }}
                                    className="rounded-[10px] border border-[#D8D9D3] bg-white p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(20,33,61,0.1)]"
                                >

                                    {/* Resume header */}
                                    <div className="flex items-start justify-between gap-4">

                                        <div className="flex items-center gap-3.5">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#E7EAF3]">
                                                <FileText size={19} strokeWidth={1.8} className="text-[#14213D]" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="font-semibold text-[14.5px] text-[#14213D] m-0 truncate">
                                                    {resume.originalFile?.filename || "Resume"}
                                                </p>
                                                <p className="mt-0.5 text-[12.5px] text-[#9CA0A8] m-0">
                                                    {resume.createdAt
                                                        ? new Date(resume.createdAt).toLocaleDateString()
                                                        : "Unknown date"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(resume._id)}
                                            disabled={deletingId === resume._id}
                                            className="flex items-center gap-1 shrink-0 rounded-[6px] px-2.5 py-1.5 text-[12.5px] font-medium text-[#C24444] transition-colors duration-150 hover:bg-[#FBEAEA] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Trash2 size={13} strokeWidth={1.8} />
                                            {deletingId === resume._id ? "Deleting..." : "Delete"}
                                        </button>

                                    </div>


                                    {/* Score */}
                                    <div className="mt-5 flex items-center justify-between rounded-[8px] bg-[#F7F7F4] border border-[#D8D9D3] p-4">

                                        <div className="flex items-center gap-3.5">
                                            {hasScore && (
                                                <div
                                                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                                                    style={{
                                                        background: `conic-gradient(#E8A33D ${analysis.score}%, #EDEEEA 0)`,
                                                    }}
                                                >
                                                    <div className="w-[34px] h-[34px] rounded-full bg-white" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-[12.5px] text-[#6B7280] m-0">Resume score</p>
                                                <p className="mt-0.5 text-[19px] font-semibold text-[#14213D] m-0">
                                                    {analysis.score ?? "—"}
                                                    {hasScore && (
                                                        <span className="text-[12.5px] font-normal text-[#9CA0A8]">/100</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="flex items-center justify-end gap-1 text-[12.5px] text-[#6B7280] m-0">
                                                <Tag size={11} strokeWidth={2} />
                                                Skills
                                            </p>
                                            <p className="mt-0.5 font-semibold text-[19px] text-[#14213D] m-0">
                                                {skills.length}
                                            </p>
                                        </div>

                                    </div>


                                    {/* Candidate */}
                                    <div className="mt-5">
                                        <p className="flex items-center gap-1 text-[12.5px] text-[#6B7280] m-0">
                                            <User size={12} strokeWidth={1.8} />
                                            Candidate
                                        </p>
                                        <p className="mt-1 font-medium text-[14px] text-[#14213D] m-0">
                                            {personalInfo.name || "Unknown"}
                                        </p>
                                    </div>


                                    {/* Skills */}
                                    <div className="mt-5">
                                        <p className="mb-2 text-[12.5px] text-[#6B7280] m-0">Skills</p>

                                        <div className="flex flex-wrap gap-1.5">
                                            {skills.length > 0 ? (
                                                skills.slice(0, 6).map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="rounded-[5px] bg-[#F7F7F4] border border-[#D8D9D3] px-2.5 py-1 text-[12px] text-[#4B5160]"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[13px] text-[#9CA0A8]">No skills found</span>
                                            )}

                                            {skills.length > 6 && (
                                                <span className="rounded-[5px] bg-[#F7F7F4] border border-[#D8D9D3] px-2.5 py-1 text-[12px] text-[#9CA0A8]">
                                                    +{skills.length - 6}
                                                </span>
                                            )}
                                        </div>
                                    </div>


                                    {/* Actions */}
                                    <div className="mt-6 border-t border-[#EDEEEA] pt-5 space-y-2.5">

                                        {/* Row 1 */}
                                        <div className="flex gap-2.5">
                                            <button
                                                onClick={() => navigate(`/resumes/${resume._id}/report`)}
                                                className="flex flex-1 items-center justify-center gap-1.5 rounded-[6px] bg-[#14213D] hover:bg-[#24304F] px-4 py-2.5 text-[13px] font-medium text-white transition-colors duration-150"
                                            >
                                                <ClipboardList size={14} strokeWidth={1.8} />
                                                View report
                                            </button>

                                            <button
                                                onClick={() => navigate(`/resumes/${resume._id}`)}
                                                className="flex flex-1 items-center justify-center gap-1.5 rounded-[6px] border border-[#D8D9D3] hover:bg-[#F7F7F4] px-4 py-2.5 text-[13px] font-medium text-[#14213D] transition-colors duration-150"
                                            >
                                                <Eye size={14} strokeWidth={1.8} />
                                                View details
                                            </button>
                                        </div>

                                        {/* Row 2 */}
                                        <div className="flex gap-2.5">
                                            <button
                                                onClick={() => navigate(`/resumes/job-search/${resume._id}`)}
                                                className="flex flex-1 items-center justify-center gap-1.5 rounded-[6px] border border-[#E8A33D]/40 bg-[#FBEEDA] hover:bg-[#F7E3C4] px-4 py-2.5 text-[13px] font-medium text-[#C9822A] transition-colors duration-150"
                                            >
                                                <Briefcase size={14} strokeWidth={1.8} />
                                                Search jobs
                                            </button>

                                            <button
                                                onClick={() => navigate(`/resumes/jobs-matches/${resume._id}`)}
                                                className="flex flex-1 items-center justify-center gap-1.5 rounded-[6px] border border-[#E8A33D]/40 bg-[#FBEEDA] hover:bg-[#F7E3C4] px-4 py-2.5 text-[13px] font-medium text-[#C9822A] transition-colors duration-150"
                                            >
                                                <Target size={14} strokeWidth={1.8} />
                                                Job matches
                                            </button>
                                        </div>

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