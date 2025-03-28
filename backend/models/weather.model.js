import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
  temp: Number,
  humidity: Number,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Weather", weatherSchema);
