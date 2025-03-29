import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import { OTP } from "../models/otp.model.js"; // Ensure consistent casing
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Middleware to parse JSON body
router.use(express.json());

const generateOTP = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

const sendOTP = async (email, generatedOTP) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "OTP for Verification",
      text: `Here is Your OTP for Verifying your Email: ${generatedOTP}`,
    });

    return true;
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    return false;
  }
};

// 🚀 Register User
export const register = async (req, res) => {
  try {
    console.log("📥 Register Request Body:", req.body);
    const { password, email, fullName } = req.body;

    if (!password || !email || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    const otpSent = await sendOTP(email, otp);

    if (!otpSent) {
      return res.status(500).json({ message: "Failed to send OTP, try again" });
    }

    await OTP.findOneAndUpdate(
      { email },
      { otp, otpExpires: Date.now() + 300000 }, // 5 minutes expiration
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "OTP sent for email verification" });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Verify OTP & Register User
export const verifyOTP = async (req, res) => {
  try {
    console.log("📥 OTP Verification Request:", req.body);
    const { email, enteredOTP, password, fullName } = req.body;

    if (!email || !enteredOTP || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "Session expired, try again" });
    }
    if (otpRecord.otp != enteredOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (otpRecord.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const initials = email.charAt(0).toUpperCase();
    const photo = `https://ui-avatars.com/api/?name=${initials}&size=150&background=ffffff&color=7c3aed`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      photo,
    });

    await newUser.save();

    await OTP.deleteOne({ email }); // Delete OTP after verification

    res.status(200).json({ message: "User verified and registered successfully" });
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🔐 Login User
export const login = async (req, res) => {
  try {
    console.log("📥 Login Request:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const userDetailsIncomplete = !user.phoneno || !user.gender || !user.dateofbirth || !user.address;

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username || "",
        fullName: user.fullName,
      },
      userDetailsIncomplete,
    });
  } catch (error) {
    console.error("❌ Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const adduserdetail = async (req, res) => {
  try {
    const {
      phoneno,
      gender,
      dateofbirth,
      address,
    } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.phoneno = phoneno;
    user.gender = gender;
    user.dateofbirth = dateofbirth;
    user.address = address;

    const userdetails = {
      phoneno: user.phoneno,
      email: user.email,
      fullName: user.fullName,
      photo: user.photo,
      _id: user._id,
    };

    await user.save();

    res
      .status(200)
      .json({ message: "Your details added successfully", user: userdetails });
  } catch (error) {
    console.error("Error adding extra data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getuserbyid = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting user by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export default router;
