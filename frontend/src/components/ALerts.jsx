import { useState, useEffect } from "react";

const LocationFetcher = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchAlerts(latitude, longitude);
        },
        (error) => {
          setError("Please enable location access.");
          console.error(error);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const fetchAlerts = async (latitude, longitude) => {
    try {
      const response = await fetch("http://localhost:5000/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch alerts");
      }
  
      const data = await response.json();
      setAlerts(data.alerts);
    } catch (error) {
      setError("There was an error fetching alerts. Please try again later.");
      console.error("Error fetching alerts:", error);
    }
  };
  

  const getAlertColor = (type) => {
    if (type === "Weather") return "bg-red-500"; // Weather Alert (Red)
    if (type === "Air Quality") return "bg-yellow-500"; // AQI Alert (Yellow)
    if (type === "Traffic") return "bg-blue-500"; // Traffic Alert (Blue)
    return "bg-gray-500"; // Default (Gray)
  };

  return (
    <div className="p-4">
      {alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <div key={index} className={`p-3 text-white rounded my-2 ${getAlertColor(alert.type)}`}>
            🚨 <strong>{alert.type} Alert:</strong> {alert.event} - {alert.description}
          </div>
        ))
      ) : (
        <p className="text-green-500">✅ No alerts at this time.</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default LocationFetcher;
