import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
interface JwtPayloadWithId extends jwt.JwtPayload {
  _id: string;
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

    const user: IUser | null = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(401)
        .json({ msg: "User not found, authorization denied" });
    }

    // You can attach the full IUser object or a subset (e.g., just _id and email)
    req.user = {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      squad: user.squad,
    };

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
