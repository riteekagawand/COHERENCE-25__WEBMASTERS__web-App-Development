import express from "express";
import { register, verifyOTP, login } from "../controller/user.controller.js";

const router = express.Router();

// Register user and send OTP
router.post("/register", register);

router.post("/verify-otp", verifyOTP);

router.post("/login", login);

export default router;