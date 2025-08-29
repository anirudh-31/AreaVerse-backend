import express from "express";
import dotenv from "dotenv";
import {authRouter} from './src/routes/auth.route.js'
import { authenticateToken } from "./src/middlewares/auth.middleware.js";
import cors from "cors"
import cookieParser from "cookie-parser";

dotenv.config();
const app  = express();
const port = process.env.PORT || 4000;

app.use(express.json());

const allowedOrigins = ["http://localhost:3000", "https://areaverse-4e8b9.web.app"];
app.use(cors({
  origin: function (origin, callback) {
    console.log(origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      console.log(origin)
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(cookieParser())
app.use("/auth", authRouter);

// Example protected route
app.get("/me", authenticateToken, (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
});

app.get("/yolo", (req, res) => {
  res.json({ message: "Welcome!"});
});


app.listen(port, () => console.log("🚀 Server running on port ", port));