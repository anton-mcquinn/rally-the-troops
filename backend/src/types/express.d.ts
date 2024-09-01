import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload; // Adjust based on the type of decoded token
  }
}
