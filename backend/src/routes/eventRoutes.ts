// src/routes/eventRoutes.ts
import express from "express";
import { createEvent, getEvents } from "../controllers/eventController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.get("/events", auth, getEvents);
router.post("/events", auth, createEvent);

export default router;
