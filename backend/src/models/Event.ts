import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  activity: string;
  createdBy: mongoose.Types.ObjectId;
  attendees: mongoose.Types.ObjectId[];
}

const EventSchema: Schema<IEvent> = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String },
  activity: { type: String, required: true },
  createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  attendees: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

const Event = mongoose.model<IEvent>("Event", EventSchema);
export default Event;
