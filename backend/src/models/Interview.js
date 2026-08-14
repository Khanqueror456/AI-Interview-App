import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    targetRole: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    difficulty: { type: String, required: true },
    questions: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question"
            }
        ], required: true
    },
    currentQuestionsIndex: {
        type: Number,
        default: 0
    },

    attemptedQuestions: { type: Number, default: null },

    totalQuestions: {
        type: Number,
        required: true
    },

    correctlyAnswered: { type: Number, default: null },
    startedAt: { type: Date, required: true, default: null },
    endedAt: { type: Date },
    pausedAt: { type: Date },
    resumedAt: { type: Date },
    status: {
        type: String,
        enum: [
            "created",
            "in-progress",
            "pending",
            "completed"
        ],
        default: "created"
    },
    score: { type: Number, default: null },
    performanceMetrics: {
        overallScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        correctlyAnswered: {
            type: Number,
            min: 0,
            default: 0
        },

        avgScorePerQuestion: {
            type: Number,
            min: 0,
            default: 0
        },

        highestScoreQuestion: {
            type: Number,
            min: 0,
            default: 0
        },

        leastScoreQuestion: {
            type: Number,
            min: 0,
            default: 0
        },

        questionsSkipped: {
            type: Number,
            min: 0,
            default: 0
        },

        completionPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    },
    skillBreakdown: {
        type: Map,
        of: {
            type: Number,
            min: 0,
            max: 100
        },
        default: {}
    }
},
    {
        timestamps: true
    }
)

const Interview = mongoose.model("Interview", InterviewSchema);

export default Interview;