import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        originalFile: {
            filename: {
                type: String,
                required: true
            },

            path: {
                type: String,
                required: true
            }
        },

        rawText: {
            type: String,
            required: true
        },

        parsedData: {
            personalInfo: {
                name: String,
                email: String,
                phone: String,
                location: String
            },

            summary: {
                type: String
            },

            education: [
                {
                    institution: String,
                    degree: String,
                    field: String,
                    startDate: String,
                    endDate: String
                }
            ],

            experience: [
                {
                    company: String,
                    position: String,
                    startDate: String,
                    endDate: String,
                    description: String
                }
            ],

            projects: [
                {
                    name: String,
                    description: String,
                    technologies: [String]
                }
            ],

            skills: [String],

            achievements : [String],

            certifications: [String],

            links: {
                github: String,
                linkedin: String,
                portfolio: String
            }
        },

        analysis: {
            score: {
                type: Number,
                min: 0,
                max: 100
            },

            strengths: {
                type: [String],
                default: []
            },

            weaknesses: {
                type: [String],
                default: []
            },

            suggestions: {
                type: [String],
                default: []
            },

            missingSkills: {
                type: [String],
                default: []
            }
        }
    },
    {
        timestamps: true
    }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;