import express from "express";
import cors from "cors";
import { registerUser, loginUser } from "./controllers/authController";
import { refreshToken } from "./controllers/refreshController";
import { createEvent, getEvents } from "./controllers/eventController";
import { auth } from "./middleware/auth";
import { rsvpEvent } from "./controllers/rsvpController";
import { loginLimiter } from "./middleware/rateLimiter";
import { followUser, getSquad } from "./controllers/squadController";

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Rally the Troops API is running...");
});

// Authentication routes
app.post("/register", registerUser);
app.post("/login", loginUser); // loginLimiter removed for testing. Add it back in production
app.post("/refresh-token", refreshToken);

// Event Routes
app.post("/event", auth, createEvent);
app.get("/event", auth, getEvents);

// RSVP route with eventId as a route parameter
app.post("/event/:eventId/rsvp", auth, rsvpEvent);

//Squad Routes
app.post("/squad", auth, followUser);
app.get("/squad", auth, getSquad);

export default app;
