import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { registerUser, loginUser } from "./controllers/authController";
import { auth } from "./middleware/auth";

const app = express();

app.use(express.json());
app.use(cors());

// Routes
//app.use('/api/auth', authRoutes);
app.get("/", (req, res) => {
  res.send("Rally the Troops API is running...");
});
app.post("/register", registerUser);
app.get("/login", loginUser);
app.get("/protected-route", auth, (req, res) => {
  res.json({ msg: "This is a protected route", userId: req.user.userId });
});
export default app;
