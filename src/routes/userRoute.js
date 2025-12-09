import express from "express";
import { login, logout, register } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { hasToken } from "../middlewares/hasToken.js";

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.get("/verify", verifyToken);
userRoute.post("/login", login);
userRoute.delete("/logout", hasToken, logout);

export default userRoute;