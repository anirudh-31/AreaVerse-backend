import express from "express";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";
import { createNewPost, fetchReviewQueue, getReport } from "../controllers/post.controller.js";


const postRouter = express.Router();
postRouter.post("/create-new-report", authenticateToken, createNewPost   );
postRouter.get("/review-queue"      , requireAdmin     , fetchReviewQueue);
postRouter.get("/:id"               , authenticateToken, getReport       );


export default postRouter;