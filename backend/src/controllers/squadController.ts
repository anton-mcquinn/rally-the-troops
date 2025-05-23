import { Request, Response } from "express";
import User from "../models/User";
import FriendRequest from "../models/FriendRequest";
import mongoose from "mongoose";

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    // Check if the user is authenticated and req.user exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    // Extract the authenticated user's ID
    const userId = req.user._id;

    // Extract friendId from the URL params
    const { id: friendId } = req.params;

    // Validate if both userId and friendId are valid MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ msg: "Invalid friend ID" });
    }

    // Find the authenticated user and the friend by their ObjectIds
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!friend) {
      return res.status(404).json({ msg: "Friend not found" });
    }

    // Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      requester: userId,
      recipient: friendId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ msg: "Friend request already sent" });
    }

    // Create a new friend request
    const friendRequest = new FriendRequest({
      requester: userId,
      recipient: friendId,
    });
    await friendRequest.save();

    res.status(200).json({ msg: "Friend request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const respondToFriendRequest = async (req: Request, res: Response) => {
  const { requestId, status } = req.body;
  /*
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }
  */

  try {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ msg: "Friend request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ msg: "Request already processed" });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      // Add both users to each other's squad
      const user = await User.findById(request.requester);
      const friend = await User.findById(request.recipient);

      if (user && friend) {
        user.squad.push(request.recipient);
        friend.squad.push(request.requester);

        await user.save();
        await friend.save();
      }

      return res.status(200).json({ msg: "Friend request accepted" });
    }

    res.status(200).json({ msg: "Friend request rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getPendingFriendRequests = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "User not authenticated" });
    }
    const userId = req.user._id;

    const pendingRequests = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("requester", "name email");

    res.status(200).json({ pendingRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get user's squad
export const getSquad = async (req: Request, res: Response) => {
  try {
    // Check if req.user is undefined
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    // Extract the user's ID from req.user
    const userId = req.user._id;

    // Find the user and populate their squad
    const user = await User.findById(userId).populate(
      "squad",
      "username email",
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return the squad
    res.status(200).json({ squad: user.squad });
  } catch (err) {
    console.error("Error fetching squad:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;
    if (typeof searchTerm !== "string") {
      return res.status(400).json({ msg: "Invalid search term" });
    }
    const users = await User.find({
      email: { $regex: searchTerm, $options: "i" },
    });
    res.status(200).json({ results: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
