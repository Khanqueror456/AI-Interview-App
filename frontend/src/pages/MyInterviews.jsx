import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animate, stagger } from "animejs";
import { ClipboardList, Clock3, CheckCircle2, Plus, FileQuestion } from "lucide-react";
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

const MyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

    if (gridRef.current) {
      animate(gridRef.current.children, {
        opacity: [0, 1],
        translateY: [14, 0],
        duration: reduced ? 0 : 450,
        delay: reduced ? 0 : stagger(70, { start: 150 }),
        ease: "outQuad",
      });
    }
  }, [loading, error]);

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

        {/* Interview list */}
        <div>
          <div className="mb-5">
            <p className="text-[17px] font-semibold text-[#14213D] m-0">All interviews</p>
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
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {interviews.map((interview) => (
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