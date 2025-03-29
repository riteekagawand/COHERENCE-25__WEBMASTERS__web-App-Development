import express from "express";
import { register, verifyOTP, login, adduserdetail, getuserbyid } from "../controller/user.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register user and send OTP
router.post("/register", register);

router.post("/verify-otp", verifyOTP);

router.post("/login", login);

router.post("/adduserdetail", authenticateToken, adduserdetail)

router.get("/me", authenticateToken, getuserbyid)

export default router;