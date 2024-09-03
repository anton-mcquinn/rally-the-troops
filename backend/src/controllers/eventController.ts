// src/controllers/eventController.ts
import { Request, Response } from "express";
import Event from "../models/Event";

export const createEvent = async (req: Request, res: Response) => {
  const { title, description, date, location, activity, createdBy } = req.body;

  if (!req.user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  console.log("Body: ", req.body);
  console.log("User: ", req.user);
  try {
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      activity,
      createdBy,
      invitees: [],
      attendees: [],
      declined: [],
    });

    const savedEvent = await newEvent.save();

    res.status(201).json(savedEvent);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).send("Server error");
    } else {
      console.error("An unexpected error occurred");
      res.status(500).send("Server error");
    }
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    // Build a filter object based on query parameters
    const filter: any = {};

    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" }; // Case-insensitive regex search
    }

    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: "i" }; // Case-insensitive regex search
    }

    if (req.query.createdBy) {
      filter.createdBy = req.query.createdBy; // Exact match on createdBy
    }

    if (req.query.activity) {
      filter.activity = { $regex: req.query.activity, $options: "i" }; // Case-insensitive regex search
    }

    // Date range filtering
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate as string); // Greater than or equal to startDate
      }
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate as string); // Less than or equal to endDate
      }
    }

    // Fetch events based on the filter
    const events = await Event.find(filter);
    res.status(200).json(events);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).send("Server error");
    } else {
      console.error("An unexpected error occurred");
      res.status(500).send("Server error");
    }
  }
};
