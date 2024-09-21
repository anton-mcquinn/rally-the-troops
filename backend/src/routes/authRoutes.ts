import express from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);

export default router;
