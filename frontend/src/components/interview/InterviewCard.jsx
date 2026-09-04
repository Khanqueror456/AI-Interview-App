// import { useNavigate } from "react-router-dom";


// import React from 'react'
// import { resumeInterview, startInterview } from "../../services/interviewService";

// const InterviewCard = ({ interview }) => {

//     const navigate = useNavigate();

//     const {

//         _id,
//         targetRole,
//         experienceLevel,
//         difficulty,
//         status,
//         score,
//         questions,
//         currentQuestionsIndex
//     } = interview;

//     const handleAction = async () => {

//         if (status === "completed") {
//             navigate(`/interviews/${_id}/report`);
//             return;
//         }

//         if (status === "created") {
//             await startInterview(_id);
//         }

//         if (status === "pending") {
//             await resumeInterview(_id);
//         }


//         return navigate(`/interviews/${_id}`);
//     }

//     const getButtonText = () => {

//         if (status === "created") {
//             return "Start"
//         }
//         if (status === "pending") {
//             return "Resume";
//         }

//         if (status === "in-progress") {
//             return "Continue";
//         }

//         return "View Report";
//     };

//     const getStatusStyle = () => {

//         if (status === "completed") {
//             return "bg-emerald-500/10 text-emerald-400";
//         }

//         if (status === "in-progress") {
//             return "bg-indigo-500/10 text-indigo-400";
//         }

//         if (status === "pending") {
//             return "bg-amber-500/10 text-amber-400";
//         }

//         return "bg-slate-700 text-slate-300";
//     };

//     return (
//         <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:border-slate-700 hover:-translate-y-1">

//             {/* Header */}
//             <div className="flex items-start justify-between gap-4">

//                 <div>
//                     <h2 className="text-lg font-semibold text-white">
//                         {targetRole}
//                     </h2>

//                     <p className="mt-1 text-sm text-slate-400">
//                         {experienceLevel} · {difficulty}
//                     </p>
//                 </div>

//                 {/* Status */}
//                 <span
//                     className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle()}`}
//                 >
//                     {status}
//                 </span>

//             </div>


//             {/* Details */}
//             <div className="mt-6 space-y-3">

//                 <div className="flex justify-between text-sm">

//                     <span className="text-slate-400">
//                         Questions
//                     </span>

//                     <span className="font-medium text-white">
//                         {questions.length}
//                     </span>

//                 </div>


//                 {status === "in-progress" && (
//                     <div>

//                         <div className="mb-2 flex justify-between text-sm">

//                             <span className="text-slate-400">
//                                 Progress
//                             </span>

//                             <span className="text-white">
//                                 {currentQuestionsIndex} / {questions.length}
//                             </span>

//                         </div>

//                         <div className="h-2 overflow-hidden rounded-full bg-slate-800">

//                             <div
//                                 className="h-full rounded-full bg-indigo-500 transition-all"
//                                 style={{
//                                     width: `${(currentQuestionsIndex /
//                                         questions.length) *
//                                         100
//                                         }%`
//                                 }}
//                             />

//                         </div>

//                     </div>
//                 )}


//                 {status === "completed" && (
//                     <div className="flex justify-between text-sm">

//                         <span className="text-slate-400">
//                             Score
//                         </span>

//                         <span className="font-semibold text-emerald-400">
//                             {score}
//                         </span>

//                     </div>
//                 )}

//             </div>


//             {/* Action */}
//             <button
//                 onClick={handleAction}
//                 className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
//             >
//                 {getButtonText()}
//             </button>

//         </div>
//     );
// }

// export default InterviewCard


import { useNavigate } from "react-router-dom";

import React from 'react'
import { resumeInterview, startInterview } from "../../services/interviewService";
import { GraduationCap, Gauge, Play, RotateCw, ArrowRight, FileText } from "lucide-react";

const DIFFICULTY_STYLES = {
    easy: "bg-[#E3F0E8] text-[#3B7A57]",
    medium: "bg-[#FBEEDA] text-[#C9822A]",
    hard: "bg-[#FBEAEA] text-[#C24444]",
};

const InterviewCard = ({ interview }) => {

    const navigate = useNavigate();

    const {

        _id,
        targetRole,
        experienceLevel,
        difficulty,
        status,
        score,
        questions,
        currentQuestionsIndex
    } = interview;

    const handleAction = async () => {

        if (status === "completed") {
            navigate(`/interviews/${_id}/report`);
            return;
        }

        if (status === "created") {
            await startInterview(_id);
        }

        if (status === "pending") {
            await resumeInterview(_id);
        }


        return navigate(`/interviews/${_id}`);
    }

    const getButtonText = () => {

        if (status === "created") {
            return "Start"
        }
        if (status === "pending") {
            return "Resume";
        }

        if (status === "in-progress") {
            return "Continue";
        }

        return "View Report";
    };

    const getButtonIcon = () => {

        if (status === "created") {
            return <Play size={15} strokeWidth={2} />;
        }
        if (status === "pending") {
            return <RotateCw size={15} strokeWidth={2} />;
        }
        if (status === "in-progress") {
            return <ArrowRight size={15} strokeWidth={2} />;
        }

        return <FileText size={15} strokeWidth={1.8} />;
    };

    const getStatusStyle = () => {

        if (status === "completed") {
            return "bg-[#E3F0E8] text-[#3B7A57]";
        }

        if (status === "in-progress") {
            return "bg-[#E7EAF3] text-[#14213D]";
        }

        if (status === "pending") {
            return "bg-[#FBEEDA] text-[#C9822A]";
        }

        if (status === "created") {
            return "bg-[#F1F1EE] text-[#6B7280]";
        }

        return "bg-[#F1F1EE] text-[#6B7280]";
    };

    const difficultyKey = (difficulty || "").toLowerCase();
    const progressPercent = questions?.length ? (currentQuestionsIndex / questions.length) * 100 : 0;

    return (
        <div className="flex flex-col rounded-[10px] border border-[#D8D9D3] bg-white p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(20,33,61,0.1)]">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">

                <div>
                    <p className="text-[16.5px] font-semibold text-[#14213D] m-0">
                        {targetRole}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                        <span className="flex items-center gap-1 text-[12px] font-medium text-[#6B7280] bg-[#F7F7F4] border border-[#D8D9D3] px-2 py-0.5 rounded-full capitalize">
                            <GraduationCap size={11} strokeWidth={2} />
                            {experienceLevel}
                        </span>
                        <span
                            className={`flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full capitalize ${DIFFICULTY_STYLES[difficultyKey] || "bg-[#F1F1EE] text-[#6B7280]"}`}
                        >
                            <Gauge size={11} strokeWidth={2} />
                            {difficulty}
                        </span>
                    </div>
                </div>

                {/* Status */}
                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-medium capitalize ${getStatusStyle()}`}
                >
                    {status}
                </span>

            </div>


            {/* Details */}
            <div className="mt-6 space-y-3">

                <div className="flex justify-between text-[13.5px]">

                    <span className="text-[#6B7280]">
                        Questions
                    </span>

                    <span className="font-medium text-[#14213D]">
                        {questions.length}
                    </span>

                </div>


                {status === "in-progress" && (
                    <div>

                        <div className="mb-2 flex justify-between text-[13.5px]">

                            <span className="text-[#6B7280]">
                                Progress
                            </span>

                            <span className="text-[#14213D] font-medium">
                                {currentQuestionsIndex} / {questions.length}
                            </span>

                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-[#EDEEEA]">

                            <div
                                className="h-full rounded-full bg-[#E8A33D] transition-[width] duration-500 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />

                        </div>

                    </div>
                )}


                {status === "completed" && (
                    <div className="flex justify-between text-[13.5px]">

                        <span className="text-[#6B7280]">
                            Score
                        </span>

                        <span className="font-semibold text-[#3B7A57]">
                            {score}
                        </span>

                    </div>
                )}

            </div>


            {/* Action */}
            <button
                onClick={handleAction}
                className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#14213D] py-3 text-[13.5px] font-medium text-white transition-colors duration-150 hover:bg-[#24304F]"
            >
                {getButtonIcon()}
                {getButtonText()}
            </button>

        </div>
    );
}

export default InterviewCard