import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js";

export const signup = asyncHandler(async (req, res) => {
    const {name, email, password, avatar, targetRole, experienceLevel } = req.body;

    const user = await User.findOne({ email });
    console.log(user)

    if (user) {
        return res.status(400).json({ message: "User already exists..." })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        avatar,
        targetRole,
        experienceLevel
    })

    await newUser.save();

    const token = jwt.sign({
        userId: newUser._id
    },
        "jsonsecret",
        {
            expiresIn: "1d"
        }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ message: "User created successfully", user : {
        id : newUser._id,
        name : newUser.name,
        email : newUser.email
    } });
})

export const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found..." })
    }

    console.log(password, user);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await jwt.sign(
        {
            userId: user._id,
        },
        "jsonsecret",
        {
            expiresIn: "1d",
        }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({ message: "Logged in successfully", user : {
        id : user._id,
        email : user.email,
    } });
    console.log("This is login")
})

export const logout = asyncHandler(async (req, res) => {

    res.clearCookie("token");

    res.status(200).json({ message: "Logged out successfully" })
    console.log("This is logout")
})

