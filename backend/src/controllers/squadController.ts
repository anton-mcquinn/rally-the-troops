import { Request, Response } from "express";
import User from "../models/User";

export const followUser = async (req: Request, res: Response) => {
  const { friendId } = req.body;
  const userId = req.user._id;

  try {
    // Check if both the user and friend exist
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ msg: "User not found" });
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
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate("squad");
    res.status(200).json({ squad: user.squad });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).json({ msg: "Server error" });
    } else {
      console.error("An unexpected error occurred");
      res.status(500).send({ msg: "Server error" });
    }
  }
};
