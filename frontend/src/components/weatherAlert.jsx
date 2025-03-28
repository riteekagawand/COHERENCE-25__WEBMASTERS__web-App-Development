// controllers/weather.controller.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getWeather = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Weather API key is missing." });
    }

    // Fetch weather data from OpenWeather API
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    const response = await axios.get(weatherUrl);
    const weatherData = response.data;

    // Analyze weather conditions for alerts
    const alerts = [];
    if (weatherData.main.temp > 40) alerts.push("⚠️ Heatwave Alert! Stay Hydrated.");
    if (weatherData.weather[0].main.includes("Rain")) alerts.push("🌧️ Rain Alert! Carry an umbrella.");
    if (weatherData.wind.speed > 20) alerts.push("🌬️ High Wind Alert! Be cautious.");

    res.json({ weather: weatherData, alerts });
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
};

// routes/weather.route.js
import express from 'express';
import { getWeather } from '../controllers/weather.controller.js';

const router = express.Router();
router.post('/location', getWeather);

export default router;
