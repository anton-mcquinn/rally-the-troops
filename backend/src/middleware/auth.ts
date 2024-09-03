import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface JwtPayloadWithId extends jwt.JwtPayload {
  userId: string;
  email: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayloadWithId;

    const user = await User.findById(decoded.userId); // Use userId instead of _id

    if (!user) {
      return res
        .status(401)
        .json({ msg: "User not found, authorization denied" });
    }
    req.user = { _id: user._id, email: user.email };

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
