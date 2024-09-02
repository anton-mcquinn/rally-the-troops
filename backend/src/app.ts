import express from "express";
import cors from "cors";
import { registerUser, loginUser } from "./controllers/authController";
import { createEvent } from "./controllers/eventController";
import { auth } from "./middleware/auth";
import { loginLimiter } from "./middleware/rateLimiter";

const app = express();

app.use(express.json());
app.use(cors());

// Routes
//app.use('/api/auth', authRoutes);
app.get("/", (req, res) => {
  res.send("Rally the Troops API is running...");
});
app.post("/register", registerUser);
app.get("/login", loginLimiter, loginUser);
app.get("/protected-route", auth, (req, res) => {
  res.json({ msg: "This is a protected route", userId: req.user });
});

app.use("/event", auth, createEvent);
export default app;
