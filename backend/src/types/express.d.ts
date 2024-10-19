import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { IUser } from "../../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Make sure req.user is typed as IUser
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload; // Adjust based on the type of decoded token
  }
}
