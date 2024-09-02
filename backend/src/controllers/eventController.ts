// src/controllers/eventController.ts
import { Request, Response } from "express";
import Event from "../models/Event";

export const createEvent = async (req: Request, res: Response) => {
  const { username, name, description, date, location, activity } = req.body;

  if (!req.user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  console.log("Body: ", req.body);
  console.log("User: ", req.user);
  try {
    const newEvent = new Event({
      name,
      description,
      date,
      location,
      activity,
      createdBy: username,
      attendees: [],
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
    const events = await Event.find();
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
// More event controllers (getEvent, updateEvent, deleteEvent) would go here...
