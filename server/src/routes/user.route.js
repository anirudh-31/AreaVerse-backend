import express from "express";
import { getMyDetails, getUserDetails, getUserPosts } from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";


const userRouter = express.Router()

userRouter.get("/me", authenticateToken,  getMyDetails);
userRouter.get("/:id/posts", authenticateToken, getUserPosts);
userRouter.get("/:id", authenticateToken, getUserDetails)
export {userRouter};