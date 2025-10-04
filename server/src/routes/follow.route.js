import { Router } from "express";
import {authenticateToken} from '../middlewares/auth.middleware.js'
import { followUser, getFollowerList, getFollowingList, unfollowUser } from "../controllers/follow.controller.js";
const followRouter = Router();

followRouter.post("/:id"         , authenticateToken, followUser);
followRouter.delete("/:id"       , authenticateToken, unfollowUser);
followRouter.get("/:id/followers", authenticateToken, getFollowerList);
followRouter.get("/:id/following", authenticateToken, getFollowingList);

export {
    followRouter
}
