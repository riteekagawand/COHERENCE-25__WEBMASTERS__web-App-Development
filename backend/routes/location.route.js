import express from "express";
const router = express.Router();

router.post("/location", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    console.log(`Received Location: Latitude ${latitude}, Longitude ${longitude}`);

    res.json({ success: true, message: "Location received successfully", latitude, longitude });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

export default router;
