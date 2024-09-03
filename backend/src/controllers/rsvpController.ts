import { Request, Response } from "express";
import Event from "../models/Event";
import jwt from "jsonwebtoken";

interface JwtPayloadWithId extends jwt.JwtPayload {
  userId: string;
}

export const rsvpEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const { action } = req.body;

  if (!req.user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  const { user } = req.user as JwtPayloadWithId;
  const email = user.email;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // Check if the user is invited
    const isInvited = event.invitees.includes(email);
    if (!isInvited) {
      return res.status(403).json({ msg: "You are not invited to this event" });
    }

    // Handle RSVP actions based on user email
    if (action === "attend") {
      // Remove user from declined if they had declined previously
      event.declined = event.declined.filter(
        (declinedUser) => declinedUser !== email,
      );

      // Add user to attendees if not already attending
      if (!event.attendees.includes(email)) {
        event.attendees.push(email);
      }
    } else if (action === "decline") {
      // Remove user from attendees if they had accepted previously
      event.attendees = event.attendees.filter(
        (attendee) => attendee !== email,
      );

      // Add user to declined if not already declined
      if (!event.declined.includes(email)) {
        event.declined.push(email);
      }
    } else if (action === "clear") {
      // Remove the user from both attendees and declined
      event.attendees = event.attendees.filter(
        (attendee) => attendee !== email,
      );
      event.declined = event.declined.filter(
        (declinedUser) => declinedUser !== email,
      );
    } else {
      return res.status(400).json({ msg: "Invalid action" });
    }

    await event.save();
    return res.status(200).json({
      msg: "RSVP updated",
      attendees: event.attendees,
      declined: event.declined,
    });
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
