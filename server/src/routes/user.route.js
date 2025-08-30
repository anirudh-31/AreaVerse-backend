import express from "express";
import { getMyDetails } from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";


const userRouter = express.Router()

userRouter.get("/me", authenticateToken,  getMyDetails);

export {userRouter};