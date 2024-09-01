import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { registerUser, loginUser } from "./controllers/authController";

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
export default app;
