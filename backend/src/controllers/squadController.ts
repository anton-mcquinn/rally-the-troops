import { Request, Response } from "express";
import User from "../models/User";

export const followUser = async (req: Request, res: Response) => {
  const { friendId, userId } = req.body;

  try {
    // Check if both the user and friend exist
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ msg: "User not found" });
    }

    //Don't alow user to follow themselves
    if (userId === friendId) {
      return res.status(400).json({ msg: "You can't follow yourself" });
    }

    // Check if the friend is already in the squad
    if (user.squad.includes(friendId)) {
      return res.status(400).json({ msg: "Already following this user" });
    }

    // Add friendId to the user's squad
    user.squad.push(friendId);
    await user.save();

    res
      .status(200)
      .json({ msg: "Friend added to your squad", squad: user.squad });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getSquad = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  console.log("UserID: ", userId);

  try {
    // Retrieve the user's squad and populate basic info for each friend
    const user = await User.findById(userId).populate("squad");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ squad: user.squad });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
