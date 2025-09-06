import express from "express";
import { getAuthToken, login, logout, passwordResetRequest, resetPassword, signup, verifyEmail } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup"                , signup              );
authRouter.post("/login"                 , login               );
authRouter.post("/refresh"               , getAuthToken        );
authRouter.post("/logout"                , logout              );
authRouter.post("/verify-email"          , verifyEmail         );
authRouter.post("/request-password-reset", passwordResetRequest);
authRouter.post("/reset-password"        , resetPassword       );   


export {authRouter};