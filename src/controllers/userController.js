import userSchema from "../models/userSchema.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv/config";
import jwt from "jsonwebtoken"
import { verifyMail } from "../emailVerify/verifyMail.js";

export const register = async (req, res) => {
    try {
        const { userName, password, email } = req.body;

        const existing = await userSchema.findOne({ email });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already in use",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const user = await userSchema.create({
            userName,
            password: hashedPassword,
            email
        });

        const token = jwt.sign({ id: user._id }, process.env.secretKey, {
            expiresIn: '5m'
        })

        verifyMail(token, email)
        user.token = token
        await user.save();

        if (user) {
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                user
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
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
                message: "Unauthorized Access",
            });
        } else {
            const passwordCheck = await bcrypt.compare(password, user.password);
            if (!passwordCheck) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect password",
                });
            } else if (passwordCheck && user.isVerified === true) {
                const accessToken = jwt.sign(
                    {
                        id: user._id,
                    },
                    process.env.secretKey,
                    {
                        expiresIn: "10days",
                    }
                );

                const refreshToken = jwt.sign(
                    {
                        id: user._id,
                    },
                    process.env.secretKey,
                    {
                        expiresIn: "30days",
                    }
                );

                user.isLoggedIn = true;
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "User Logged in Successfully",
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    data: user,
                });
            } else {
                res.status(200).json({
                    message: "Complete Email verification then Login..",
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};