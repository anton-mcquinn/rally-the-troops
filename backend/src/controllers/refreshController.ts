import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string,
    ) as any;

    // Issue a new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    // Return the new access token to the client
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Invalid refresh token");
    return res.status(403).json({ msg: "Invalid refresh token" });
  }
};
