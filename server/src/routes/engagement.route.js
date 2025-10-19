import { Router } from "express";
import { recordPostView } from "../controllers/engagement.controller.js";
import { authenticateToken } from '../middlewares/auth.middleware.js'
const engagementRouter = Router();

engagementRouter.post("/view/:postId", authenticateToken, recordPostView);

export {
    engagementRouter
}