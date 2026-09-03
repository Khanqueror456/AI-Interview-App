import { useEffect, useRef, useState } from "react";
import { animate, stagger, svg } from "animejs";
import { CheckCircle2, Clock3, TrendingUp, Briefcase, ArrowUpRight, Sparkles } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/layout/LoadingScreen";
import ErrorScreen from "../components/layout/ErrorScreen";

// Helper functions
import { getInterviews } from "../services/interviewService";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Dashboard — overview stats, performance snapshot, and a job matches teaser.
 * Interview cards live on their own page; this is summary-only.
 * Purely presentational — pass real data in via props. Entrance/number
 * animations are handled with anime.js v4 inside each sub-component.
 *
 * @param {{ name: string }} user
 * @param {{ total: number, completed: number, pending: number, avgScore: number }} stats
 * @param {{ label: string, value: number }[]} performanceTrend - last N interview scores, oldest first
 * @param {{ id: string, role: string, company: string, matchPercent: number }[]} jobMatches
 */
export default function Dashboard({

  stats = { total: 14, completed: 9, pending: 5, avgScore: 78 },
  performanceTrend = [
    { label: "1", value: 58 },
    { label: "2", value: 64 },
    { label: "3", value: 61 },
    { label: "4", value: 72 },
    { label: "5", value: 78 },
  ],
  jobMatches = [
    { id: "1", role: "Frontend Engineer", company: "Northwind Labs", matchPercent: 91 },
    { id: "2", role: "Product Designer", company: "Aster & Co", matchPercent: 84 },
    { id: "3", role: "Backend Engineer", company: "Fieldstone", matchPercent: 79 },
  ],
}) {


  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {

    const fetchInterviews = async () => {

      try {

        const data = await getInterviews();

        console.log(data);
        setInterviews(data.interviews);

      } catch (error) {

        setError(
          error.response?.data?.message || "Failed to load interviews"
        )

      } finally {

        setLoading(false);

      }
    }

    fetchInterviews();
  }, [])

  const getPendingInterviews = () => {
    return interviews.filter(
      interview =>
        interview.status === "pending" || interview.status === "created"
    ).length
  }

  const getCompletedInterviews = () => {

    return interviews.filter(
      interview =>
        interview.status === "completed"
    ).length
  }

  const getInterviewsAverage = () => {

    let totalScore = 0;
    let count = 0;

    for (let interview of interviews)
    {
      if (interview.status == "completed" )
      {
        totalScore += interview.score;
        console.log(interview.score)
        count++;

      }
    }

    return Math.round((totalScore / count));
  }

  // Design part
  const headerRef = useRef(null);

  useEffect(() => {
    animate(headerRef.current, {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: prefersReducedMotion() ? 0 : 450,
      ease: "outQuad",
    });
  }, []);


  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen body={error}/>
  }

  return (
    <div className="max-w-[1080px] mx-auto px-7 py-9">
      {/* Header */}
      <div ref={headerRef} style={{ opacity: 0 }} className="mb-8">
        <div className="flex items-center gap-2">
          <Sparkles size={18} strokeWidth={2} className="text-[#E8A33D]" />
          <p className="text-[24px] font-semibold text-[#14213D] font-['Lora',_Georgia,_serif] m-0">
            Welcome back, {user?.name}
          </p>
        </div>
        <p className="text-[14.5px] text-[#6B7280] mt-1.5 m-0 ml-[26px]">
          Here's how your interview prep is going.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          delay={80}
          iconBg="bg-[#E7EAF3]"
          icon={<Briefcase size={18} strokeWidth={1.8} className="text-[#14213D]" />}
          label="Total interviews"
          value={interviews?.length}
        />
        <StatCard
          delay={150}
          iconBg="bg-[#E3F0E8]"
          icon={<CheckCircle2 size={18} strokeWidth={1.8} className="text-[#3B7A57]" />}
          label="Completed"
          value={ getCompletedInterviews()}
          trend="+2 this week"
          trendColor="text-[#3B7A57]"
        />
        <StatCard
          delay={220}
          iconBg="bg-[#FBEEDA]"
          icon={<Clock3 size={18} strokeWidth={1.8} className="text-[#C9822A]" />}
          label="Pending"
          value={getPendingInterviews()}
        />
        <ScoreCard delay={290} value={getInterviewsAverage()} />
      </div>

      {/* Performance + job matches */}
      <div className="grid grid-cols-[1.3fr_1fr] gap-4">
        {/* Performance card */}
        <FadeInCard delay={360} className="p-6">
          <p className="text-[15px] font-semibold text-[#14213D] m-0">Your performance</p>
          <p className="text-[13px] text-[#6B7280] mt-1 mb-5">
            Score trend across your last {performanceTrend.length} interviews
          </p>
          <Sparkline data={performanceTrend} />
        </FadeInCard>

        {/* Job matches teaser */}
        <FadeInCard delay={420} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[15px] font-semibold text-[#14213D] m-0">Job matches</p>
            <span className="text-[12px] font-medium text-[#3B7A57] bg-[#E3F0E8] px-2 py-0.5 rounded-full">
              {jobMatches.length} new
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {jobMatches.map((job, i) => (
              <JobMatchRow key={job.id} job={job} index={i} />
            ))}
          </div>
        </FadeInCard>
      </div>
    </div>
  );
}

/** Generic card wrapper that fades/slides in with anime.js on mount. */
function FadeInCard({ children, delay = 0, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    animate(ref.current, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: prefersReducedMotion() ? 0 : 500,
      delay: prefersReducedMotion() ? 0 : delay,
      ease: "outQuad",
    });
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{ opacity: 0 }}
      className={`bg-white border border-[#D8D9D3] rounded-[8px] hover:shadow-[0_8px_24px_rgba(20,33,61,0.08)] transition-shadow duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

function StatCard({ icon, iconBg, label, value, trend, trendColor, delay = 0 }) {
  const cardRef = useRef(null);
  const numRef = useRef(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    animate(cardRef.current, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: reduced ? 0 : 500,
      delay: reduced ? 0 : delay,
      ease: "outQuad",
    });

    animate(numRef.current, {
      innerHTML: [0, value],
      round: 1,
      duration: reduced ? 0 : 800,
      delay: reduced ? 0 : delay + 200,
      ease: "outExpo",
    });
  }, [value, delay]);

  return (
    <div
      ref={cardRef}
      style={{ opacity: 0 }}
      className="bg-white border border-[#D8D9D3] rounded-[8px] p-5 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(20,33,61,0.1)] transition-[transform,box-shadow] duration-300"
    >
      <div className={`w-9 h-9 rounded-[8px] ${iconBg} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-[22px] font-semibold text-[#14213D] m-0">
        <span ref={numRef}>0</span>
      </p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-[13px] text-[#6B7280] m-0">{label}</p>
        {trend && <span className={`text-[11.5px] font-medium ${trendColor}`}>{trend}</span>}
      </div>
    </div>
  );
}

function ScoreCard({ value, delay = 0 }) {
  const cardRef = useRef(null);
  const ringRef = useRef(null);
  const numRef = useRef(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    animate(cardRef.current, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: reduced ? 0 : 500,
      delay: reduced ? 0 : delay,
      ease: "outQuad",
    });

    // Animate a plain proxy object so the ring gradient and the number
    // stay perfectly in sync, driven by anime.js's onUpdate callback.
    const proxy = { value: 0 };
    animate(proxy, {
      value,
      round: 1,
      duration: reduced ? 0 : 900,
      delay: reduced ? 0 : delay + 200,
      ease: "outExpo",
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = proxy.value;
        if (ringRef.current) {
          ringRef.current.style.background = `conic-gradient(#E8A33D ${proxy.value}%, #EDEEEA 0)`;
        }
      },
    });
  }, [value, delay]);

  return (
    <div
      ref={cardRef}
      style={{ opacity: 0 }}
      className="bg-white border border-[#D8D9D3] rounded-[8px] p-5 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(20,33,61,0.1)] transition-[transform,box-shadow] duration-300 flex items-center gap-4"
    >
      <div ref={ringRef} className="w-14 h-14 rounded-full flex items-center justify-center shrink-0">
        <div className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center">
          <TrendingUp size={16} strokeWidth={1.8} className="text-[#14213D]" />
        </div>
      </div>
      <div>
        <p className="text-[22px] font-semibold text-[#14213D] m-0">
          <span ref={numRef}>0</span>%
        </p>
        <p className="text-[13px] text-[#6B7280] mt-1 m-0">Average score</p>
      </div>
    </div>
  );
}

function JobMatchRow({ job, index }) {
  const rowRef = useRef(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    animate(rowRef.current, {
      opacity: [0, 1],
      translateX: [-10, 0],
      duration: reduced ? 0 : 400,
      delay: reduced ? 0 : 500 + index * 80,
      ease: "outQuad",
    });
  }, [index]);

  const palette = ["#14213D", "#E8A33D", "#3B7A57", "#6B7280"];
  const bg = palette[index % palette.length];
  const badgeColor =
    job.matchPercent >= 85
      ? "text-[#3B7A57] bg-[#E3F0E8]"
      : job.matchPercent >= 70
        ? "text-[#C9822A] bg-[#FBEEDA]"
        : "text-[#6B7280] bg-[#F1F1EE]";

  return (
    <div
      ref={rowRef}
      style={{ opacity: 0 }}
      className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-[6px] hover:bg-[#F7F7F4] transition-colors duration-150"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
          style={{ backgroundColor: bg }}
        >
          {job.company.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-[13.5px] font-medium text-[#14213D] m-0">{job.role}</p>
          <p className="text-[12.5px] text-[#6B7280] m-0">{job.company}</p>
        </div>
      </div>
      <span className={`flex items-center gap-0.5 text-[12px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
        {job.matchPercent}%
        <ArrowUpRight size={12} strokeWidth={2.2} />
      </span>
    </div>
  );
}

/**
 * Lightweight, dependency-free trend line (no chart lib assumed). Line draw-in
 * uses anime.js v4's svg.createDrawable(); dot pop-in uses stagger().
 */
function Sparkline({ data }) {
  const width = 100;
  const height = 40;
  const lineRef = useRef(null);
  const dotsWrapRef = useRef(null);

  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;

  const coords = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - min) / range) * height;
    return { x, y };
  });

  const linePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const areaPoints = `0,${height} ${linePoints} ${width},${height}`;

  const last = data[data.length - 1].value;
  const first = data[0].value;
  const isUp = last >= first;
  const stroke = isUp ? "#3B7A57" : "#C24444";

  useEffect(() => {
    const reduced = prefersReducedMotion();

    const [drawable] = svg.createDrawable(lineRef.current);
    animate(drawable, {
      draw: reduced ? "0 1" : ["0 0", "0 1"],
      duration: reduced ? 0 : 1000,
      delay: reduced ? 0 : 250,
      ease: "inOutSine",
    });

    animate(dotsWrapRef.current.querySelectorAll(".spark-dot"), {
      scale: [0, 1],
      opacity: [0, 1],
      duration: reduced ? 0 : 300,
      delay: reduced ? 0 : stagger(70, { start: 1050 }),
      ease: "outBack",
    });
  }, []);

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparklineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#sparklineFill)" />
        <polyline
          ref={lineRef}
          points={linePoints}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g ref={dotsWrapRef}>
          {coords.map((c, i) => (
            <circle
              key={i}
              className="spark-dot"
              cx={c.x}
              cy={c.y}
              r="2.2"
              fill={stroke}
              style={{ opacity: 0, transformOrigin: "center", transformBox: "fill-box" }}
            />
          ))}
        </g>
      </svg>
      <div className="flex justify-between mt-2">
        <span className="text-[12px] text-[#6B7280]">{data[0].label}</span>
        <span className="text-[12px] text-[#6B7280]">{data[data.length - 1].label}</span>
      </div>
    </div>
  );
}