import userSchema from "../models/user1.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import sessionSchema from "../models/sessionSchema.js";

export const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const existing = await userSchema.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already in use.."
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userSchema.create({
            userName,
            email,
            password: hashedPassword
        });
        const token = jwt.sign({ id: user._id }, process.env.secretKey, { expiresIn: "5m" });
        verifyEmail(token, email);
        user.token = token;
        await user.save();
        if (user) {
            return res.status(201).json({
                success: true,
                message: "User created successfully!",
                user
            })
        }
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userSchema.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access!"
            })
        }
        else {
            const passwordCheck = await bcrypt.compare(password, user.password,);
            if (!passwordCheck) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials!"
                });
            }
            else if (passwordCheck && user.isVerified === true) {

                await sessionSchema.findOneAndDelete({ userId: user._id });
                await sessionSchema.create({ userId: user._id });

                const accessToken = jwt.sign(
                    { id: user._id },
                    process.env.secretKey,
                    {
                        expiresIn: "7d"
                    }
                );
                const refreshToken = jwt.sign(
                    { id: user._id },
                    process.env.secretKey,
                    { expiresIn: "30d" }
                );

                user.isLoggedIn = true;
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "User logged in successfully!",
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user
                })
            }
            else {
                return res.status(200).json({
                    message: "Please verify yourself and then Login!"
                });
            }

        }
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

export const logout = async (req, res) => {

    try {
        const existing = await sessionSchema.findOne({ userId: req.userId });
        const user = await userSchema.findById({ _id: req.userId });    
        if (existing) {
            await sessionSchema.findOneAndDelete({ userId: req.userId });
            user.isLoggedIn = false;
            await user.save()
            return res.status(200).json({
                success: true,
                message: "Session successfully ended",
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "User had no session",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
