import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: true,
    },
    otp: {
      type: Number,
    },
    dateofbirth: {
      type: Date,
    },
    gender: {
      type: String,
    },
    photo: {
      type: String,
    },
    phoneno: {
      type: String, // Changed from Number to String to handle different formats
    },
    address: {
      type: String,
    },
    userType: {
      type: String,
      default: "citizen",
    },
    
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export { User };