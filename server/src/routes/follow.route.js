import { Router } from "express";
import {authenticateToken} from '../middlewares/auth.middleware.js'
import { followUser, unfollowUser } from "../controllers/follow.controller.js";
const followRouter = Router();

followRouter.post("/:id"  , authenticateToken, followUser);
followRouter.delete("/:id", authenticateToken, unfollowUser)

export {
    followRouter
}
