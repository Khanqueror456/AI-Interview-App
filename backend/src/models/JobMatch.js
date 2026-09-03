import mongoose from "mongoose";

const jobMatchSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    searchCriteria: {
      country: {
        type: String,
        default: "in",
      },

      role: {
        type: String,
        default: "network engineer",
      },

      location: {
        type: String,
        default: "Bangalore",
      },
    },

    overallRelevance: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    jobMatches: [
      {
        jobId: {
          type: String,
          required: true,
        },

        jobTitle: {
          type: String,
          required: true,
        },

        overallScore: {
          type: Number,
          min: 0,
          max: 100,
          required: true,
        },

        roleMatch: {
          score: {
            type: Number,
            min: 0,
            max: 100,
            required: true
          },

          reason: {

            type: String,
            default: ""
          }
        },

        experienceMatch: {
          score: {
            type: Number,
            min: 0,
            max: 100,
            required: true
          },

          reason: {

            type: String,
            default: ""
          }
        },

        skillMatch: {
          score: {
            type: Number,
            min: 0,
            max: 100,
            required: true
          },

          matched: {
            type: [String],
            default: []
          },

          missing: {
            type: [String],
            default: []
          },

          reason: {
            type: String,
            default: ""
          }
        },

        summary: {
          type: String,
          default: ""
        },

        applyUrl : {
          type : String,
          default : "#"
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

const JobMatch = mongoose.model("JobMatch", jobMatchSchema);

export default JobMatch;