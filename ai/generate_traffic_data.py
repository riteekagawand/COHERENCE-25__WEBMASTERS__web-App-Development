import json
from datetime import datetime, timedelta
import random

city_routes = {
    "Ahmedabad": {"start": "Sabarmati Ashram", "end": "Kankaria Lake"},
    "Bengaluru": {"start": "MG Road", "end": "Lalbagh"},
    "Chennai": {"start": "Marina Beach", "end": "Anna Nagar"},
    "Coimbatore": {"start": "Gandhipuram", "end": "RS Puram"},
    "Delhi": {"start": "India Gate", "end": "Connaught Place"},
    "Ghaziabad": {"start": "Vaishali", "end": "Indirapuram"},
    "Hyderabad": {"start": "Charminar", "end": "Hitech City"},
    "Indore": {"start": "Vijay Nagar", "end": "Rajwada"},
    "Jaipur": {"start": "Hawa Mahal", "end": "Jal Mahal"},
    "Kanpur": {"start": "Mall Road", "end": "Bara Bazar"},
    "Kochi": {"start": "Fort Kochi", "end": "Ernakulam"},
    "Kolkata": {"start": "Howrah Bridge", "end": "Salt Lake"},
    "Kozhikode": {"start": "Beach Road", "end": "Kozhikode Railway"},
    "Lucknow": {"start": "Hazratganj", "end": "Gomti Nagar"},
    "Mumbai": {"start": "Marine Drive", "end": "Bandra"},
    "Nagpur": {"start": "Sitabuldi", "end": "Kamptee Road"},
    "Patna": {"start": "Gandhi Maidan", "end": "Patna Junction"},
    "Pune": {"start": "Shivaji Nagar", "end": "Kothrud"},
    "Surat": {"start": "Udhna", "end": "Varachha"}
}

city_factors = {
    "Pune": {"accidents": 0.3}, "Delhi": {"accidents": 0.3, "otherEvents": 0.2}, "Bengaluru": {"accidents": 0.3, "concerts": 0.2},
    "Mumbai": {"concerts": 0.2, "otherEvents": 0.2}, "Kolkata": {"strikes": 0.1, "concerts": 0.2}, "Chennai": {"strikes": 0.1}
}

start_date = datetime(2025, 3, 1)
end_date = datetime(2025, 3, 28)
interval = timedelta(minutes=15)
weather_options = ["Clear", "Rain", "Fog", "Clouds"]

with open('../backend/traffic_data.json', 'w') as json_file:
    current_time = start_date
    while current_time <= end_date:
        for city in city_routes:
            time_of_day = current_time.hour
            day_of_week = current_time.weekday()

            base_delay = random.choice([30, 60, 120, 180])
            factors = city_factors.get(city, {})
            accidents = 1 if random.random() < factors.get("accidents", 0.2) else 0
            concerts = "Concert at Venue" if (day_of_week >= 4 and random.random() < factors.get("concerts", 0.1)) else "no"
            strikes = "Transport Strike" if random.random() < factors.get("strikes", 0.05) else "no"
            other_events = random.choice(["Festival", "Protest"]) if random.random() < factors.get("otherEvents", 0.15) else "none"

            delay = base_delay
            if accidents: delay += 30
            if concerts != "no": delay += 30
            if strikes != "no": delay += 60
            if other_events != "none": delay += 30

            weather = random.choices(weather_options, weights=[0.7, 0.2, 0.05, 0.05])[0]
            if weather in ["Rain", "Fog"]: delay += 20

            data = {
                "timestamp": current_time.isoformat(),
                "route": city_routes[city],
                "delay": delay,
                "timeOfDay": time_of_day,
                "dayOfWeek": day_of_week,
                "weather": weather,
                "accidents": accidents,
                "concerts": concerts,
                "strikes": strikes,
                "otherEvents": other_events
            }
            json_file.write(json.dumps(data) + '\n')
        current_time += interval

print("Generated traffic_data.json with ~43,000 entries.")