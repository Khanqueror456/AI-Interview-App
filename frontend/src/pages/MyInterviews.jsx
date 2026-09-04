import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animate, stagger } from "animejs";
import { ClipboardList, Clock3, CheckCircle2, Plus, FileQuestion, Search, X } from "lucide-react";
import { getInterviews } from "../services/interviewService";
import InterviewCard from "../components/interview/InterviewCard";
import LoadingScreen from "../components/layout/LoadingScreen";
import ErrorScreen from "../components/layout/ErrorScreen";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const EXPERIENCE_LEVELS = ["Fresher", "Junior", "Intermediate", "Senior"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const INTERVIEW_STATUS = ["Created", "Pending", "Completed"];

const MyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Search / filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [questionsFilter, setQuestionsFilter] = useState("all");

  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await getInterviews();
        setInterviews(data.interviews);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load interviews");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Distinct question counts present in the data, for the "Questions" filter.
  const questionCountOptions = useMemo(() => {
    const counts = new Set(interviews.map((interview) => interview.questions?.length ?? 0));
    return Array.from(counts).sort((a, b) => a - b);
  }, [interviews]);

  const filteredInterviews = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return interviews.filter((interview) => {
      const matchesSearch = term === "" || (interview.targetRole || "").toLowerCase().includes(term);
      const matchesExperience =
        experienceFilter === "all" || interview.experienceLevel === experienceFilter.toLowerCase();
      const matchesStatus = statusFilter === "all" || interview.status === statusFilter.toLowerCase();
      const matchesDifficulty =
        difficultyFilter === "all" || interview.difficulty === difficultyFilter.toLowerCase();
      const matchesQuestions =
        questionsFilter === "all" || (interview.questions?.length ?? 0) === Number(questionsFilter);

      return matchesSearch && matchesStatus && matchesExperience && matchesDifficulty && matchesQuestions;
    });
  }, [interviews, searchTerm, statusFilter, experienceFilter, difficultyFilter, questionsFilter]);

  const hasActiveFilters =
    searchTerm !== "" || experienceFilter !== "all" || statusFilter !== "all" || difficultyFilter !== "all" || questionsFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setExperienceFilter("all");
    setStatusFilter("all");
    setDifficultyFilter("all");
    setQuestionsFilter("all");
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
      delay: reduced ? 0 : stagger(60),
      ease: "outQuad",
    });
  }, [loading, error, filteredInterviews]);

  if (loading) {
    return <LoadingScreen title="Loading your interviews" subtitle="This usually takes a few seconds." />;
  }

  if (error) {
    return (
      <ErrorScreen
        title="Couldn't load your interviews"
        body={error}
        onReconnect={() => window.location.reload()}
        onBack={() => navigate("/")}
      />
    );
  }

  const pending = interviews.filter(
    (interview) => interview.status === "pending" || interview.status === "created"
  ).length;
  const completed = interviews.filter((interview) => interview.status === "completed").length;

  return (
    <div className="min-h-screen bg-[#EDEEEA] px-7 py-9">
      <div className="mx-auto max-w-[1080px]">
        {/* Header */}
        <div
          ref={headerRef}
          style={{ opacity: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <p className="text-[24px] font-semibold text-[#14213D] font-['Lora',_Georgia,_serif] m-0">
              Your interviews
            </p>
            <p className="text-[14.5px] text-[#6B7280] mt-1.5 m-0">
              Continue an existing interview or review your previous attempts.
            </p>
          </div>

          <button
            onClick={() => navigate("/interviews/create")}
            className="flex items-center gap-1.5 bg-[#14213D] hover:bg-[#24304F] text-white text-sm font-medium px-4 py-2.5 rounded-[6px] transition-colors duration-150 w-fit"
          >
            <Plus size={16} strokeWidth={2} />
            New interview
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <StatCard
            icon={<ClipboardList size={18} strokeWidth={1.8} className="text-[#14213D]" />}
            iconBg="bg-[#E7EAF3]"
            label="Total interviews"
            value={interviews.length}
          />
          <StatCard
            icon={<Clock3 size={18} strokeWidth={1.8} className="text-[#C9822A]" />}
            iconBg="bg-[#FBEEDA]"
            label="Pending"
            value={pending}
          />
          <StatCard
            icon={<CheckCircle2 size={18} strokeWidth={1.8} className="text-[#3B7A57]" />}
            iconBg="bg-[#E3F0E8]"
            label="Completed"
            value={completed}
          />
        </div>

        {/* Search + filters */}
        <div className="bg-white border border-[#D8D9D3] rounded-[8px] p-4 mb-6">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by target role..."
                className="w-full rounded-[6px] border border-[#D8D9D3] bg-white pl-9 pr-3 py-2.5 text-[13.5px] text-[#14213D] placeholder-[#9CA0A8] outline-none transition-colors duration-150 focus:border-[#14213D] focus:ring-1 focus:ring-[#14213D]"
              />
            </div>

            {/* Experience level */}
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="rounded-[6px] border border-[#D8D9D3] bg-white px-3 py-2.5 text-[13.5px] text-[#14213D] outline-none transition-colors duration-150 focus:border-[#14213D] focus:ring-1 focus:ring-[#14213D]"
            >
              <option value="all">All experience levels</option>
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-[6px] border border-[#D8D9D3] bg-white px-3 py-2.5 text-[13.5px] text-[#14213D] outline-none transition-colors duration-150 focus:border-[#14213D] focus:ring-1 focus:ring-[#14213D]"
            >
              <option value="all">All status</option>
              {INTERVIEW_STATUS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            {/* Difficulty */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="rounded-[6px] border border-[#D8D9D3] bg-white px-3 py-2.5 text-[13.5px] text-[#14213D] outline-none transition-colors duration-150 focus:border-[#14213D] focus:ring-1 focus:ring-[#14213D]"
            >
              <option value="all">All difficulties</option>
              {DIFFICULTIES.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            {/* Questions */}
            <select
              value={questionsFilter}
              onChange={(e) => setQuestionsFilter(e.target.value)}
              className="rounded-[6px] border border-[#D8D9D3] bg-white px-3 py-2.5 text-[13.5px] text-[#14213D] outline-none transition-colors duration-150 focus:border-[#14213D] focus:ring-1 focus:ring-[#14213D]"
            >
              <option value="all">Any # of questions</option>
              {questionCountOptions.map((count) => (
                <option key={count} value={count}>
                  {count} questions
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-[13px] font-medium text-[#6B7280] hover:text-[#14213D] transition-colors duration-150 px-2 py-2.5 whitespace-nowrap"
              >
                <X size={14} strokeWidth={2} />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Interview list */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-[17px] font-semibold text-[#14213D] m-0">All interviews</p>
            {hasActiveFilters && (
              <p className="text-[13px] text-[#6B7280] m-0">
                {filteredInterviews.length} of {interviews.length}
              </p>
            )}
          </div>

          {interviews.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-[#D8D9D3] bg-white p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F7F7F4] border border-[#D8D9D3] flex items-center justify-center mx-auto mb-4">
                <FileQuestion size={22} strokeWidth={1.8} className="text-[#6B7280]" />
              </div>
              <p className="text-[16px] font-semibold text-[#14213D] m-0">No interviews yet</p>
              <p className="text-[14px] text-[#6B7280] mt-2 mb-6">
                Create your first AI-powered interview and start practicing.
              </p>
              <button
                onClick={() => navigate("/interviews/create")}
                className="inline-flex items-center gap-1.5 bg-[#14213D] hover:bg-[#24304F] text-white text-sm font-medium px-5 py-2.5 rounded-[6px] transition-colors duration-150"
              >
                <Plus size={16} strokeWidth={2} />
                Create your first interview
              </button>
            </div>
          ) : filteredInterviews.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-[#D8D9D3] bg-white p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F7F7F4] border border-[#D8D9D3] flex items-center justify-center mx-auto mb-4">
                <Search size={22} strokeWidth={1.8} className="text-[#6B7280]" />
              </div>
              <p className="text-[16px] font-semibold text-[#14213D] m-0">No matching interviews</p>
              <p className="text-[14px] text-[#6B7280] mt-2 mb-6">
                Try adjusting your search or filters.
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
            <div ref={gridRef} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredInterviews.map((interview) => (
                <div key={interview._id} style={{ opacity: 0 }}>
                  <InterviewCard interview={interview} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function StatCard({ icon, iconBg, label, value }) {
  return (
    <div className="rounded-[8px] border border-[#D8D9D3] bg-white p-5">
      <div className={`w-9 h-9 rounded-[8px] ${iconBg} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-[22px] font-semibold text-[#14213D] m-0">{value}</p>
      <p className="text-[13px] text-[#6B7280] mt-1 m-0">{label}</p>
    </div>
  );
}

export default MyInterviews;