import { rateLimit } from "express-rate-limit";

// Apply rate limiting to login route
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 5, // Limit each IP to 5 login requests per `window` per 15 minutes
  message: {
    msg: "Too many login attempts from this IP, please try again after 15 minutes",
  },
});

export { loginLimiter };
