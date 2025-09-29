import express from "express";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";
import { createNewPost, fetchReviewQueue, getPostsByUserId, getReport, updatePostStatus, updateReport } from "../controllers/post.controller.js";


const postRouter = express.Router();
postRouter.post("/create-new-report", authenticateToken, createNewPost); // route to create new report
postRouter.get("/review-queue"      , authenticateToken, requireAdmin, fetchReviewQueue); // admin only route to get reports that need to be reviewed.
postRouter.get("/:id"               , authenticateToken, getReport); // route to get a report
postRouter.get("/user/:id"          , authenticateToken, getPostsByUserId); // route to get posts by a user. 
postRouter.patch("/:id"             , authenticateToken, updateReport); // route to update a report
postRouter.patch("/:id/status"      , requireAdmin     , updatePostStatus); // route to update the status of a report

export default postRouter;