import express from "express";
import { login, register } from "../controllers/userController.js";
import { verification } from "../middleware/tokenVerification.js";

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.get("/verify", verification);

export default userRoute;
