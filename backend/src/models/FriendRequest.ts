import mongoose, { Schema, Document } from "mongoose";

interface IFriendRequest extends Document {
  requester: Schema.Types.ObjectId;
  recipient: Schema.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
}

const FriendRequestSchema: Schema = new Schema({
  requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });

export default mongoose.model<IFriendRequest>("FriendRequest", FriendRequestSchema);

