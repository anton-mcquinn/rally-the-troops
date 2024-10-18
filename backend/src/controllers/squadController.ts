import { Request, Response } from "express";
import User from "../models/User";
import FriendRequest from "../models/FriendRequest";

export const sendFriendRequest = async (req: Request, res: Response) => {
  const { userId, friendId } = req.body;

  try {
    // Check if both users exist
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ msg: "User not found" });
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

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }

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
  const { userId } = req.body;

  try {
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

