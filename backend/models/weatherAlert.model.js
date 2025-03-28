import mongoose from "mongoose";

const weatherAlertSchema = new mongoose.Schema({
  location: {
    latitude: Number,
    longitude: Number,
    city: String,
  },
  alert: {
    severity: String, // Critical, Warning, Normal
    message: String,
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("WeatherAlert", weatherAlertSchema);
