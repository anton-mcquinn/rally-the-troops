import express from "express";
import cors from "cors";
import { registerUser, loginUser } from "./controllers/authController";
import { createEvent, getEvents } from "./controllers/eventController";
import { auth } from "./middleware/auth";
import { rsvpEvent } from "./controllers/rsvpController";
import { loginLimiter } from "./middleware/rateLimiter";

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Rally the Troops API is running...");
});

app.post("/register", registerUser);
app.post("/login", loginUser); // loginLimiter removed for testing. Add it back in production
app.get("/protected-route", auth, (req, res) => {
  res.json({ msg: "This is a protected route", userId: req.user });
});

app.post("/event", auth, createEvent);
app.get("/event", auth, getEvents);

// RSVP route with eventId as a route parameter
app.post("/event/:eventId/rsvp", auth, rsvpEvent);

export default app;
