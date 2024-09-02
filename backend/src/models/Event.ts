import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  activity: string;
  createdBy: string;
  attendees: Types.ObjectId[];
}

const EventSchema: Schema<IEvent> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String },
  activity: { type: String, required: true },
  createdBy: { type: String, required: true },
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Event = mongoose.model<IEvent>("Event", EventSchema);
export default Event;
