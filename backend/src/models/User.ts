import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  squad: mongoose.Schema.Types.ObjectId[]; // Array of User ObjectIds
}

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  squad: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of User references
});

export default mongoose.model<IUser>("User", UserSchema);
