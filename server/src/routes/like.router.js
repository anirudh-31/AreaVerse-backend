import { Router } from "express";
import { toggleLikeStatus } from "../controllers/like.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
const likeRouter = Router();

likeRouter.post("/:id", authenticateToken, toggleLikeStatus);

export default likeRouter