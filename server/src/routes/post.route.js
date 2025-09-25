import express from "express";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";
import { createNewPost, fetchReviewQueue, getReport, updatePostStatus } from "../controllers/post.controller.js";


const postRouter = express.Router();
postRouter.post("/create-new-report", authenticateToken, createNewPost);
postRouter.get("/review-queue"      , authenticateToken, requireAdmin, fetchReviewQueue);
postRouter.get("/:id"               , authenticateToken, getReport);
// postRouter.get("/"                  , authenticateToken, getReport);
postRouter.patch("/:id/status"      , requireAdmin     , updatePostStatus);


export default postRouter;