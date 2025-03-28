import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// OpenWeather API Key
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
// AQI API Key
const AQI_API_KEY = process.env.AQI_API_KEY;
// TomTom API Key
const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;

export const getAlerts = async (req, res) => {
  try {
    // Static Latitude and Longitude values (example: New York City)
    const latitude = 40.7128;   // Latitude for New York City
    const longitude = -74.0060; // Longitude for New York City

    // Fetch Weather Alerts from OpenWeather API
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
    );

    // Fetch AQI Alerts from AQI API (Air Quality)
    const aqiResponse = await axios.get(
      `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${AQI_API_KEY}`
    );

    // Fetch Traffic Alerts from TomTom API
    const trafficResponse = await axios.get(
      `https://api.tomtom.com/traffic/services/4/incidentDetails?key=${TOMTOM_API_KEY}&bbox=${longitude-0.1},${latitude-0.1},${longitude+0.1},${latitude+0.1}&fields=incidents{type,impact}`
    );

    // Initialize an array to hold the alerts
    const alerts = [];

    // Weather Alert
    if (weatherResponse.data.alerts) {
      weatherResponse.data.alerts.forEach((alert) => {
        alerts.push({
          type: "Weather",
          event: alert.event,
          description: alert.description,
        });
      });
    }

    // AQI Alert - Harmful if AQI > 80
    if (aqiResponse.data.status === "ok" && aqiResponse.data.data.aqi > 80) {
      alerts.push({
        type: "Air Quality",
        event: "Harmful Pollution Level",
        description: `Current AQI: ${aqiResponse.data.data.aqi}. Avoid outdoor activities.`,
      });
    }

    // Traffic Alert
    if (trafficResponse.data.incidents.length > 0) {
      trafficResponse.data.incidents.forEach((incident) => {
        alerts.push({
          type: "Traffic",
          event: "Traffic Congestion",
          description: `Traffic impact: ${incident.impact}. Expect delays.`,
        });
      });
    }

    // If no alerts are present, show the "No alerts at this time" message
    if (alerts.length === 0) {
      alerts.push({
        event: "No alerts at this time",
        description: "✅ No alerts at this time. You're safe!",
      });
    }

    // Send response with the alerts
    res.json({ alerts });

  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
};
