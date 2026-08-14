import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js"

export const getUser = asyncHandler(async (req, res) => {
    res.json(req.user);
})


export const updateUser = asyncHandler(async (req, res) => {

    const user = req.user;
    const {email, avatar, targetRole, experienceLevel} = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {email, avatar, targetRole, experienceLevel},
        {
            new: true,
            runValidators: true
        }
    ).select("-password");
    res.status(200).json({message : "User updated successfully", updatedUser});
})

export const deleteUser = asyncHandler(async (req, res) => {

    const user = req.user;
    const deletedUser = await User.deleteOne({_id : user._id});
    res.clearCookie("token");
    res.status(200).json({message : "User deleted successfully", deletedUser});
})