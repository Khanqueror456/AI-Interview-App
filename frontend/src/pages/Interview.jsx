import React, { useEffect, useState, useRef } from 'react'
import { finishInterview, getInterview, pauseInterview, pauseInterviewOnExit, resumeInterview, skipCurrentQuestion, submitAnswer } from '../services/interviewService';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { animate, stagger } from 'animejs';
import {
  Mic,
  Square,
  Pause,
  Play,
  SkipForward,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  Briefcase,
  GraduationCap,
  Gauge,
  FileText,
} from 'lucide-react';
import AudioPlayer from '../components/interview/AudioPlayer';
import LoadingScreen from '../components/layout/LoadingScreen';

import api from '../services/api';

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const DIFFICULTY_STYLES = {
  easy: "bg-[#E3F0E8] text-[#3B7A57]",
  medium: "bg-[#FBEEDA] text-[#C9822A]",
  hard: "bg-[#FBEAEA] text-[#C24444]",
};

const STATUS_STYLES = {
  "in-progress": "bg-[#E7EAF3] text-[#14213D]",
  pending: "bg-[#FBEEDA] text-[#C9822A]",
  completed: "bg-[#E3F0E8] text-[#3B7A57]",
};

const Interview = () => {

  const [interview, setInterview] = useState({});
  const { id } = useParams();
  const { register, handleSubmit, formState: { isSubmitting }, setValue } = useForm();
  const [feedback, setFeedback] = useState(null);
  const [interviewSummary, setInterviewSummary] = useState(null)
  const [interviewStatus, setInterviewStatus] = useState(null);
  const navigate = useNavigate();

  const interviewStatusRef = useRef(null);

  // ---- Design-only refs for animation ----
  const headerRef = useRef(null);
  const questionCardRef = useRef(null);
  const controlsRef = useRef(null);
  const feedbackRef = useRef(null);
  const summaryRef = useRef(null);
  const scoreRingRef = useRef(null);
  const scoreNumRef = useRef(null);

  useEffect(() => {
    interviewStatusRef.current = interviewStatus;
  }, [interviewStatus]);

  useEffect(() => {

    const pauseIfActive = () => {

      if (interviewStatusRef.current === "in-progress") {
        pauseInterviewOnExit(id);
      }

    };

    window.addEventListener("pagehide", pauseIfActive);

    return () => {

      window.removeEventListener("pagehide", pauseIfActive);

      pauseIfActive();

    };

  }, [id]);


  useEffect(() => {
    const fetchInterview = async () => {

      const response = await getInterview(id);

      setInterview(response);
      setInterviewStatus(response.status);
    };
    fetchInterview();
  }, [id])

  useEffect(() => {
    if (interview?.status === "completed")
    {
      navigate("/");
    }
  }, [interview]);

  useEffect(() => {
    console.log(interviewStatus)
  }, [interviewStatus]);

  useEffect(() => {
    console.log("Interview summary", interviewSummary);
  }, [interviewSummary]);

  // Page entrance + per-question transition animation (design-only).
  useEffect(() => {
    if (!interview?.questions || interviewSummary) return;
    const reduced = prefersReducedMotion();

    animate(headerRef.current, {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: reduced ? 0 : 400,
      ease: "outQuad",
    });

    animate(questionCardRef.current, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: reduced ? 0 : 450,
      delay: reduced ? 0 : 80,
      ease: "outQuad",
    });

    if (controlsRef.current) {
      animate(controlsRef.current, {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: reduced ? 0 : 400,
        delay: reduced ? 0 : 160,
        ease: "outQuad",
      });
    }
  }, [interview?.currentQuestionsIndex, interviewSummary]);

  // Feedback card entrance (design-only).
  useEffect(() => {
    if (!feedback || !feedbackRef.current) return;
    const reduced = prefersReducedMotion();

    animate(feedbackRef.current, {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: reduced ? 0 : 400,
      ease: "outQuad",
    });
  }, [feedback]);

  // Summary screen entrance + score ring count-up (design-only).
  useEffect(() => {
    if (!interviewSummary) return;
    const reduced = prefersReducedMotion();

    animate(summaryRef.current, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: reduced ? 0 : 500,
      ease: "outQuad",
    });

    const percent = Math.round(
      (interviewSummary?.overallScore / (interviewSummary?.totalQuestions * 10)) * 100
    ) || 0;

    const proxy = { value: 0 };
    animate(proxy, {
      value: percent,
      round: 1,
      duration: reduced ? 0 : 1000,
      delay: reduced ? 0 : 200,
      ease: "outExpo",
      onUpdate: () => {
        if (scoreNumRef.current) scoreNumRef.current.textContent = proxy.value;
        if (scoreRingRef.current) {
          scoreRingRef.current.style.background = `conic-gradient(#E8A33D ${proxy.value}%, #EDEEEA 0)`;
        }
      },
    });
  }, [interviewSummary]);

  const onSubmit = async (data) => {

    if (data.answer.trim() === "") {
      return;
    }

    const id = interview._id;
    const response = await submitAnswer(id, data);

    // setInterview(response.interview);
    setFeedback(response.feedback);
  }

  const nextQuestion = async () => {
    setFeedback(null);
    setValue("answer", "");
    const response = await getInterview(id);

    setInterview(response);

  }

  const skipHandler = async () => {

    setValue("answer", "");
    const response = await skipCurrentQuestion(id);

    setInterview(response);
  }

  const handleResume = async () => {

    const response = await resumeInterview(id);
    setInterviewStatus(response.status);

  }

  const handlePause = async () => {

    const response = await pauseInterview(id);
    setInterviewStatus(response.status);
  }

  const handleBack = () => {
    leavingIntentionally.current = true;
    navigate("/");
  };

  const finishInterviewHandler = async () => {

    console.log("Finishing the interview");
    const response = await finishInterview(interview._id);
    setInterviewSummary(response);
  }




  // Audio transcribe logic

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {

    if (transcript == null) {
      setValue("answer", "");
    }

    else {
      setValue("answer", transcript);
    }

  }, [transcript])

  const uploadAudio = async (formData) => {

    try {

      setIsTranscribing(true);

      console.log("Sending audio for transcription...");

      const response = await api.post(
        "/speech/transcribe",
        formData
      );

      console.log(
        "Transcript:",
        response.data.transcript
      );

      setTranscript(response.data.transcript);

    } catch (error) {

      console.error(
        "Transcription failed:",
        error
      );
    } finally {

      setIsTranscribing(false);
    }
  };

  const startRecording = async () => {

    try {

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      })

      streamRef.current = mediaStream;

      const recorder = new MediaRecorder(streamRef.current);

      mediaRecorderRef.current = recorder;

      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      }

      recorder.onstop = async () => {

        const audioBlob = new Blob(chunks, {
          type: "audio/webm"
        })

        const audioURL = URL.createObjectURL(audioBlob);

        setAudioURL(audioURL);

        const formData = new FormData();
        formData.append("audio", audioBlob, "answer.webm");

        await uploadAudio(formData);
      }

      recorder.start();

      setIsRecording(true);

    } catch (error) {

      console.log("Microphone error", error);

    }
  };

  const stopRecording = () => {

    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();

    streamRef.current?.getTracks().forEach(track => {
      track.stop();
    });

    setIsRecording(false);

    URL.revokeObjectURL(audioURL);
  }

  const getAudioUrl = (audioPath) => {

    return `${import.meta.env.VITE_BACKEND_URL}${audioPath}`;
  };


  if (!interview) {
    return <LoadingScreen title="Loading your interview" subtitle="This usually takes a few seconds." />;
  }

  // ---------------- Completion summary ----------------
  if (interviewSummary) {

    const scorePercent = Math.round(
      (interviewSummary?.overallScore / (interviewSummary?.totalQuestions * 10)) * 100
    ) || 0;

    return (
      <div className="min-h-screen bg-[#EDEEEA] px-4 py-12 sm:px-6">
        <div ref={summaryRef} style={{ opacity: 0 }} className="mx-auto max-w-[560px]">

          {/* Completion header */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E3F0E8]">
              <CheckCircle2 size={30} strokeWidth={1.8} className="text-[#3B7A57]" />
            </div>

            <p className="mt-5 text-[24px] font-semibold text-[#14213D] font-['Lora',_Georgia,_serif] m-0">
              Interview completed
            </p>
            <p className="mt-2 text-[14.5px] text-[#6B7280] m-0">
              Nice work — here's a quick summary of your performance.
            </p>
          </div>

          {/* Score card */}
          <div className="rounded-[10px] border border-[#D8D9D3] bg-white p-8">

            <div className="flex flex-col items-center">
              <div
                ref={scoreRingRef}
                className="w-28 h-28 rounded-full flex items-center justify-center"
              >
                <div className="w-[92px] h-[92px] rounded-full bg-white flex items-center justify-center">
                  <p className="text-[28px] font-semibold text-[#14213D] m-0">
                    <span ref={scoreNumRef}>0</span>%
                  </p>
                </div>
              </div>
              <p className="text-[13px] font-medium text-[#6B7280] uppercase tracking-wide mt-3 mb-0">
                Overall score
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-[8px] bg-[#F7F7F4] border border-[#D8D9D3] p-5 text-center">
                <p className="text-[13px] text-[#6B7280] m-0">Correct answers</p>
                <p className="mt-2 text-[26px] font-semibold text-[#3B7A57] m-0">
                  {interviewSummary?.correctlyAnswered}
                </p>
              </div>

              <div className="rounded-[8px] bg-[#F7F7F4] border border-[#D8D9D3] p-5 text-center">
                <p className="text-[13px] text-[#6B7280] m-0">Total questions</p>
                <p className="mt-2 text-[26px] font-semibold text-[#14213D] m-0">
                  {interviewSummary?.totalQuestions}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => navigate(`/interviews/${id}/report`)}
                className="flex items-center justify-center gap-1.5 bg-[#14213D] hover:bg-[#24304F] text-white text-[14.5px] font-medium px-6 py-3 rounded-[6px] transition-colors duration-150"
              >
                <FileText size={16} strokeWidth={1.8} />
                View detailed report
              </button>

              <button
                onClick={() => navigate("/")}
                className="border border-[#D8D9D3] hover:border-[#9CA0A8] hover:bg-[#F7F7F4] text-[#14213D] text-[14.5px] font-medium px-6 py-3 rounded-[6px] transition-colors duration-150"
              >
                Back to dashboard
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ---------------- Active session ----------------

  const totalQuestions = interview?.questions?.length ?? 0;
  const currentIndex = interview?.currentQuestionsIndex ?? 0;
  const questionNumber = Math.min(currentIndex + 1, totalQuestions);
  const progressPercent = totalQuestions ? (questionNumber / totalQuestions) * 100 : 0;
  const difficultyKey = (interview?.difficulty || "").toLowerCase();

  return (
    <div className="min-h-screen bg-[#EDEEEA] px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-5xl">

        {/* Interview header */}
        <div ref={headerRef} style={{ opacity: 0 }} className="mb-6 rounded-[10px] border border-[#D8D9D3] bg-white p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-[19px] font-semibold text-[#14213D] font-['Lora',_Georgia,_serif] m-0">
                {interview?.targetRole} Interview
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-[12.5px] font-medium text-[#6B7280] bg-[#F7F7F4] border border-[#D8D9D3] px-2 py-0.5 rounded-full capitalize">
                  <GraduationCap size={12} strokeWidth={2} />
                  {interview?.experienceLevel}
                </span>
                <span
                  className={`flex items-center gap-1 text-[12.5px] font-medium px-2 py-0.5 rounded-full capitalize ${DIFFICULTY_STYLES[difficultyKey] || "bg-[#F1F1EE] text-[#6B7280]"}`}
                >
                  <Gauge size={12} strokeWidth={2} />
                  {interview?.difficulty}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5">

              {/* Question counter + progress */}
              <div className="text-right min-w-[90px]">
                <p className="text-[12px] text-[#6B7280] m-0">Question</p>
                <p className="text-[17px] font-semibold text-[#14213D] m-0">
                  {questionNumber} / {totalQuestions}
                </p>
                <div className="w-[90px] h-1 rounded-full bg-[#EDEEEA] mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#E8A33D] rounded-full transition-[width] duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Status */}
              <span
                className={`rounded-full px-3 py-1 text-[12.5px] font-medium capitalize ${STATUS_STYLES[interviewStatus] || "bg-[#F1F1EE] text-[#6B7280]"}`}
              >
                {interviewStatus}
              </span>

            </div>

          </div>

        </div>


        {/* Question */}
        <div ref={questionCardRef} style={{ opacity: 0 }} className="rounded-[10px] border border-[#D8D9D3] bg-white p-6 sm:p-8">

          <div className="mb-6">
            <p className="flex items-center gap-1.5 mb-3 text-[13px] font-medium uppercase tracking-wider text-[#C9822A] m-0">
              <Sparkles size={14} strokeWidth={2} />
              Question
            </p>

            <p className="text-[20px] sm:text-[22px] font-semibold leading-relaxed text-[#14213D] font-['Lora',_Georgia,_serif] m-0">
              {interview?.questions?.[currentIndex]?.question}
            </p>
          </div>


          {/* Answer */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
              <label className="mb-2 block text-[13.5px] font-medium text-[#14213D]">
                Your answer
              </label>

              {!isTranscribing && (
                <textarea
                  rows="9"
                  placeholder="Explain your answer here..."
                  {...register("answer")}
                  className="w-full resize-y rounded-[8px] border border-[#D8D9D3] bg-white px-4 py-4 text-[14.5px] text-[#14213D] placeholder-[#9CA0A8] outline-none transition-colors duration-150 focus:border-[#14213D] focus:ring-1 focus:ring-[#14213D]"
                />
              )}

              {isTranscribing && (
                <div className="flex items-center gap-2 rounded-[8px] border border-[#D8D9D3] bg-[#F7F7F4] px-4 py-4 text-[14px] text-[#6B7280]">
                  <TranscribingWaveform />
                  Transcribing your answer
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                disabled={interviewStatus !== "in-progress" || isSubmitting}
                type="submit"
                className="flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed rounded-[6px] bg-[#14213D] hover:bg-[#24304F] px-6 py-3 font-medium text-white text-[14.5px] transition-colors duration-150"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" strokeWidth={2} />
                ) : (
                  <ArrowRight size={16} strokeWidth={2} />
                )}
                Submit answer
              </button>
            </div>

          </form>

        </div>


        {/* Feedback */}
        {isSubmitting ? (

          <div className="mt-6 rounded-[10px] border border-[#D8D9D3] bg-white p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div
                className="h-10 w-10 rounded-full animate-spin"
                style={{ background: "conic-gradient(#14213D 0%, #E8A33D 50%, #EDEEEA 50%)", WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))", mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))" }}
              />

              <p className="mt-5 text-[16px] font-semibold text-[#14213D] m-0">
                Analysing your answer
              </p>

              <p className="mt-2 max-w-md text-[13.5px] text-[#6B7280] m-0">
                Our AI is evaluating your answer based on accuracy, relevance, and the
                requirements of the role.
              </p>
            </div>
          </div>

        ) : feedback ? (

          <div ref={feedbackRef} style={{ opacity: 0 }} className="mt-6 rounded-[10px] border border-[#D8D9D3] bg-white p-6 sm:p-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-wider text-[#C9822A] m-0">
                  <Sparkles size={13} strokeWidth={2} />
                  AI feedback
                </p>
                <p className="mt-1 text-[18px] font-semibold text-[#14213D] m-0">
                  Your performance
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#E8A33D] text-[20px] font-bold text-[#14213D]">
                {feedback.score}
              </div>
            </div>

            <div className="mt-6 rounded-[8px] bg-[#F7F7F4] border border-[#D8D9D3] p-5">
              <p className="leading-relaxed text-[14px] text-[#14213D] m-0">
                {feedback.feedback}
              </p>
            </div>

          </div>

        ) : null}


        {/* Controls */}
        <div ref={controlsRef} style={{ opacity: 0 }} className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Left side */}
          <div className="flex gap-3">
            <button
              onClick={handlePause}
              disabled={interviewStatus !== "in-progress"}
              className="flex items-center gap-1.5 rounded-[6px] border border-[#D8D9D3] px-5 py-3 font-medium text-[13.5px] text-[#14213D] transition-colors duration-150 hover:border-[#C9822A] hover:bg-[#FBEEDA] hover:text-[#C9822A] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Pause size={15} strokeWidth={2} />
              Pause
            </button>

            <button
              onClick={handleResume}
              disabled={interviewStatus !== "pending"}
              className="flex items-center gap-1.5 rounded-[6px] border border-[#D8D9D3] px-5 py-3 font-medium text-[13.5px] text-[#14213D] transition-colors duration-150 hover:border-[#14213D] hover:bg-[#E7EAF3] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Play size={15} strokeWidth={2} />
              Resume
            </button>
          </div>


          {/* Right side */}
          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center justify-center gap-3">

              <AudioPlayer audioUrl={getAudioUrl(interview?.questions?.[currentIndex]?.audioURL)} />

              {/* Mic controls */}
              <div className="relative flex items-center justify-center">
                {isRecording && (
                  <span className="absolute inset-0 rounded-full bg-[#C24444] opacity-60 animate-ping" />
                )}
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  aria-label="Start recording"
                  title="Start recording"
                  className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 ${
                    isRecording
                      ? "cursor-not-allowed bg-[#F1F1EE] text-[#9CA0A8]"
                      : "bg-[#14213D] text-white shadow-[0_6px_16px_rgba(20,33,61,0.25)] hover:bg-[#24304F] hover:scale-105 active:scale-95"
                  }`}
                >
                  <Mic size={20} strokeWidth={1.8} />
                </button>
              </div>

              <button
                onClick={stopRecording}
                disabled={!isRecording}
                aria-label="Stop recording"
                title="Stop recording"
                className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 ${
                  isRecording
                    ? "bg-[#FBEAEA] text-[#C24444] ring-1 ring-[#F0C9C9] hover:bg-[#F6DADA] hover:scale-105 active:scale-95"
                    : "cursor-not-allowed bg-[#F1F1EE] text-[#B9BCC2]"
                }`}
              >
                <Square size={17} strokeWidth={1.8} />
              </button>
            </div>

            <button
              onClick={skipHandler}
              disabled={
                interview?.currentQuestionsIndex >= interview?.questions?.length ||
                interviewStatus !== "in-progress" ||
                isSubmitting || feedback
              }
              className="flex items-center gap-1.5 rounded-[6px] border border-[#D8D9D3] bg-white px-5 py-3 font-medium text-[13.5px] text-[#14213D] transition-colors duration-150 hover:bg-[#F7F7F4] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SkipForward size={15} strokeWidth={1.8} />
              Skip
            </button>

            <button
              onClick={nextQuestion}
              disabled={
                (interview?.currentQuestionsIndex >= interview?.questions?.length - 1) ||
                interviewStatus !== "in-progress" ||
                isSubmitting
              }
              className="flex items-center gap-1.5 rounded-[6px] bg-[#14213D] hover:bg-[#24304F] px-5 py-3 font-medium text-[13.5px] text-white transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ArrowRight size={15} strokeWidth={2} />
            </button>

            <button
              onClick={finishInterviewHandler}
              disabled={!(interview?.currentQuestionsIndex >= interview?.questions?.length - 1)}
              className="flex items-center gap-1.5 rounded-[6px] bg-[#3B7A57] hover:bg-[#33684B] px-5 py-3 font-medium text-[13.5px] text-white transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCircle2 size={15} strokeWidth={2} />
              Finish
            </button>

          </div>

        </div>

      </div>

      <style>{`
        @keyframes wavePulse {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
      `}</style>

    </div>
  );
}

/** Tiny animated waveform shown next to the "Transcribing" label. */
function TranscribingWaveform() {
  return (
    <span className="flex items-end gap-[3px] h-3.5">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-[#C9822A]"
          style={{
            animation: "wavePulse 0.9s ease-in-out infinite",
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </span>
  );
}

export default Interview