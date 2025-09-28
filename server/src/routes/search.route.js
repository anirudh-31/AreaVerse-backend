import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { search } from "../controllers/search.controller.js";


const searchRouter = express.Router();

searchRouter.use(authenticateToken);

searchRouter.get("/", search);

export {
    searchRouter
}