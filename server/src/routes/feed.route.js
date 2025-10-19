import { Router } from "express";
import { homeFeed } from "../controllers/feed.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
const feedRouter = Router();

feedRouter.get("/", authenticateToken, homeFeed);

export {
    feedRouter
}