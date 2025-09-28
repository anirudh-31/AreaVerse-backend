import express from "express";
import dotenv from "dotenv";
import {authRouter} from './src/routes/auth.route.js'
import { authenticateToken } from "./src/middlewares/auth.middleware.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import { userRouter } from "./src/routes/user.route.js";
import imageRouter from "./src/routes/image.route.js";
import postRouter from "./src/routes/post.route.js";
import { searchRouter } from "./src/routes/search.route.js";

dotenv.config();
const app  = express();
const port = process.env.PORT || 4000;

app.use(express.json());

const allowedOrigins = ["http://localhost:3000", "https://areaverse-4e8b9.web.app"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(cookieParser());

// ROUTES
app.use("/auth"  , authRouter );
app.use("/user"  , userRouter );
app.use("/image" , imageRouter);
app.use("/report", postRouter );
app.use("/search", searchRouter);
// Example protected route
app.get("/me", authenticateToken, (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
});

app.get("/yolo", (req, res) => {
  res.json({ message: "Welcome!"});
});


app.listen(port, () => console.log("🚀 Server running on port ", port));