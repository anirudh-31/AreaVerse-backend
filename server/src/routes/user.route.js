import express from "express";
import { getMyDetails, getUserPosts } from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";


const userRouter = express.Router()

userRouter.get("/me", authenticateToken,  getMyDetails);
userRouter.get("/:id/posts", authenticateToken, getUserPosts)
export {userRouter};