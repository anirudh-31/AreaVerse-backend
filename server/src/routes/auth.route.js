import express from "express";
import { getAuthToken, login, signup } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/refresh", getAuthToken)

export {authRouter};