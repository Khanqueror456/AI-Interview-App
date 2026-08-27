import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
        required: true
    },

    question: {
        type: String,
        required: true
    },

    answer: {
        type: String,
        default: ""
    },

    idealAnswer : {
        type : String,
        default : ""
    },

    feedback: {
        type: String,
        default: ""
    },

    score: {
        type: Number,
        default: null
    },

    audioURL : {
        type : String,
        default : null
    }
});

const Question = mongoose.model("Question", QuestionSchema);

export default Question;