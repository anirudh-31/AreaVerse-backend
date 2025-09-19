import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { getSignedImageUploadURL } from "../controllers/image.controller.js";


const imageRouter = express.Router();

imageRouter.post("/get-signed-upload-url", authenticateToken, getSignedImageUploadURL)

export default imageRouter;