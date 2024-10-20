import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  squad: mongoose.Schema.Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  squad: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
