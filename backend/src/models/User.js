import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name : {type : String , default : "User"},
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        avatar : {type : String, default : "P"},
        targetRole : {type : String, default : "N/A"},
        experienceLevel : {type : String, default : "N/A"}
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;


