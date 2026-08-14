import { useNavigate } from "react-router-dom";


import React from 'react'
import { resumeInterview, startInterview } from "../../services/interviewService";

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

    const getStatusStyle = () => {

        if (status === "completed") {
            return "bg-emerald-500/10 text-emerald-400";
        }

        if (status === "in-progress") {
            return "bg-indigo-500/10 text-indigo-400";
        }

        if (status === "pending") {
            return "bg-amber-500/10 text-amber-400";
        }

        return "bg-slate-700 text-slate-300";
    };

    return (
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:border-slate-700 hover:-translate-y-1">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">

                <div>
                    <h2 className="text-lg font-semibold text-white">
                        {targetRole}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        {experienceLevel} · {difficulty}
                    </p>
                </div>

                {/* Status */}
                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle()}`}
                >
                    {status}
                </span>

            </div>


            {/* Details */}
            <div className="mt-6 space-y-3">

                <div className="flex justify-between text-sm">

                    <span className="text-slate-400">
                        Questions
                    </span>

                    <span className="font-medium text-white">
                        {questions.length}
                    </span>

                </div>


                {status === "in-progress" && (
                    <div>

                        <div className="mb-2 flex justify-between text-sm">

                            <span className="text-slate-400">
                                Progress
                            </span>

                            <span className="text-white">
                                {currentQuestionsIndex} / {questions.length}
                            </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                            <div
                                className="h-full rounded-full bg-indigo-500 transition-all"
                                style={{
                                    width: `${(currentQuestionsIndex /
                                        questions.length) *
                                        100
                                        }%`
                                }}
                            />

                        </div>

                    </div>
                )}


                {status === "completed" && (
                    <div className="flex justify-between text-sm">

                        <span className="text-slate-400">
                            Score
                        </span>

                        <span className="font-semibold text-emerald-400">
                            {score}
                        </span>

                    </div>
                )}

            </div>


            {/* Action */}
            <button
                onClick={handleAction}
                className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
                {getButtonText()}
            </button>

        </div>
    );
}

export default InterviewCard
