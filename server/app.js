import express from "express";
import dotenv from "dotenv";
import {authRouter} from './src/routes/auth.route.js'
import { authenticateToken } from "./src/middlewares/auth.middleware.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());

app.use("/auth", authRouter);

// Example protected route
app.get("/me", (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
});

app.get("/yolo", (req, res) => {
  res.json({ message: "Welcome!"});
});


app.listen(port, () => console.log("🚀 Server running on port ", port));