import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { createNewComment, getCommentsByPostId } from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.post("/"    , authenticateToken, createNewComment);
commentRouter.get("/list" , authenticateToken, getCommentsByPostId);

export default commentRouter;