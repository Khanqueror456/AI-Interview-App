import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getResume } from "../services/resumeService";
import { animate, stagger } from "animejs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Link2,
  Code,
  FileText,
  Calendar,
  Building,
  Sparkles,
  Download,
  Edit,
  CheckCircle2,
  Clock,
  Star,
} from "lucide-react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * ResumeDetails – displays a parsed resume in a clean, card‑based layout.
 * All sections fade in with a staggered animation on mount.
 */
export default function ResumeDetails() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for animated sections
  const headerRef = useRef(null);
  const personalRef = useRef(null);
  const summaryRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const educationRef = useRef(null);
  const achievementsRef = useRef(null);
  const certificationsRef = useRef(null);
  const linksRef = useRef(null);

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
      personalRef,
      summaryRef,
      skillsRef,
      experienceRef,
      projectsRef,
      educationRef,
      achievementsRef,
      certificationsRef,
      linksRef,
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
          <p className="text-[#6B7280]">Loading resume…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F4] px-4">
        <div className="bg-white border border-[#D8D9D3] rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-3xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-[#14213D]">Oops, something went wrong</h2>
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
    achievements,
  } = resume.parsedData || {};

  // Helper: compute total experience (rough)
  const totalExperience = experience?.length || 0;
  const skillCount = skills?.length || 0;
  const projectCount = projects?.length || 0;

  return (
    <div className="min-h-screen bg-[#F7F7F4] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#E8A33D] flex items-center justify-center text-[#14213D] font-bold text-xl">
              {personalInfo?.name?.charAt(0) || "R"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] font-['Lora',_Georgia,_serif]">
                {personalInfo?.name || "Resume"}
              </h1>
              <p className="text-sm text-[#6B7280] flex items-center gap-1">
                <FileText size={14} />
                {resume.fileName || "Uploaded resume"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#D8D9D3] rounded-lg text-sm font-medium text-[#14213D] bg-white hover:bg-[#F7F7F4] transition-colors">
              <Edit size={16} /> Edit
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#14213D] text-white rounded-lg text-sm font-medium hover:bg-[#24304F] transition-colors">
              <Download size={16} /> Download
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div ref={personalRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-[#D8D9D3] rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[#E7EAF3] flex items-center justify-center">
              <Briefcase size={18} className="text-[#14213D]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#14213D]">{totalExperience}</p>
              <p className="text-sm text-[#6B7280]">Experience entries</p>
            </div>
          </div>
          <div className="bg-white border border-[#D8D9D3] rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[#FBEEDA] flex items-center justify-center">
              <Code size={18} className="text-[#C9822A]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#14213D]">{skillCount}</p>
              <p className="text-sm text-[#6B7280]">Skills</p>
            </div>
          </div>
          <div className="bg-white border border-[#D8D9D3] rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-[#E3F0E8] flex items-center justify-center">
              <Star size={18} className="text-[#3B7A57]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#14213D]">{projectCount}</p>
              <p className="text-sm text-[#6B7280]">Projects</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <SectionCard ref={personalRef} title="Personal Information" icon={<User size={18} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    <Building size={14} /> {exp.company || "Company"}
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

        {/* Projects */}
        <SectionCard ref={projectsRef} title="Projects" icon={<Code size={18} />}>
          {projects?.length > 0 ? (
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
          ) : (
            <p className="text-[#6B7280]">No projects listed</p>
          )}
        </SectionCard>

        {/* Achievements */}
        {achievements?.length > 0 && (
          <SectionCard ref={achievementsRef} title="Achievements" icon={<Award size={18} />}>
            <ul className="list-disc list-inside space-y-1 text-[#4B5563]">
              {achievements.map((ach, idx) => (
                <li key={idx}>{ach}</li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <SectionCard ref={certificationsRef} title="Certifications" icon={<CheckCircle2 size={18} />}>
            <ul className="list-disc list-inside space-y-1 text-[#4B5563]">
              {certifications.map((cert, idx) => (
                <li key={idx}>{cert}</li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* Links */}
        {(links?.github || links?.linkedin || links?.portfolio) && (
          <SectionCard ref={linksRef} title="Links" icon={<Link2 size={18} />}>
            <div className="flex flex-wrap gap-3">
              {links.github && (
                <a
                  href={links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#E7EAF3] text-[#14213D] rounded-lg hover:bg-[#D8D9D3] transition-colors"
                >
                  <Code size={16} /> GitHub
                </a>
              )}
              {links.linkedin && (
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#E7EAF3] text-[#14213D] rounded-lg hover:bg-[#D8D9D3] transition-colors"
                >
                  <Link2 size={16} /> LinkedIn
                </a>
              )}
              {links.portfolio && (
                <a
                  href={links.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#E7EAF3] text-[#14213D] rounded-lg hover:bg-[#D8D9D3] transition-colors"
                >
                  <Sparkles size={16} /> Portfolio
                </a>
              )}
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