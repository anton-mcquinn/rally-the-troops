// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // Attach the decoded token to the request object
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
