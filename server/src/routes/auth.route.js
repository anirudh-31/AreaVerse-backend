import express from "express";
import { getAuthToken, login, logout, signup } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup" , signup);
authRouter.post("/login"  , login);
authRouter.post("/refresh", getAuthToken)
authRouter.post("/logout" , logout);

export {authRouter};