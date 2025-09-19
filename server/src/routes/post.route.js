import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { createNewPost } from "../controllers/post.controller.js";


const postRouter = express.Router()

postRouter.post("/create-new-report", authenticateToken, createNewPost);


export default postRouter;