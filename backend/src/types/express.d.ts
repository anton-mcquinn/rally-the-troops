import { IUser } from "../../models/User";

declare namespace Express {
  export interface User {
    _id: string;
    username: string;
    email: string;
    squad: IUser["squad"];
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: Express.User; // Attach the custom User type to Request
  }
}
