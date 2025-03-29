import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import user from "./routes/user.route.js";
import weatherRoutes from "./routes/weather.route.js";
import locationRoutes from "./routes/location.route.js"
import trafficRoutes from "./routes/trafficRoute.js"
import utilityRoutes from "./routes/utilityRoute.js"

dotenv.config();
const app = express();

// ✅ CORS Setup (Allows Requests from Frontend)
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // ✅ JSON Parsing
app.use(express.urlencoded({ extended: true })); // ✅ Form Data Parsing

const API_KEY = process.env.OPENWEATHER_API_KEY;

// Routes
app.use("/api/user", user);
app.use("/api", weatherRoutes);
app.use("/api", locationRoutes);
app.use('/api/traffic', trafficRoutes);
app.use('/api/utilities', utilityRoutes);


// ✅ MongoDB Connection (Updated)
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // ✅ Removed Deprecated Options
    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 4000; // ✅ Default Port
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
};

// Start the Server
startServer();
