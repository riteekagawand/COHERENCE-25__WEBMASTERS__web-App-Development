// src/components/MapView.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Custom icons with specific designs
const hospitalIcon = L.divIcon({
  className: 'custom-icon',
  html: `
    <div style="position: relative; width: 40px; height: 40px;">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="#FFFFFF" stroke="#FF0000" stroke-width="3"/>
        <line x1="20" y1="10" x2="20" y2="30" stroke="#FF0000" stroke-width="3"/>
        <line x1="10" y1="20" x2="30" y2="20" stroke="#FF0000" stroke-width="3"/>
      </svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const medicalStoreIcon = L.divIcon({
  className: 'custom-icon',
  html: `
    <div style="position: relative; width: 40px; height: 40px;">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <rect x="5" y="5" width="30" height="30" fill="#4CAF50" rx="5" ry="5"/>
        <line x1="20" y1="10" x2="20" y2="30" stroke="#FFFFFF" stroke-width="3"/>
        <line x1="10" y1="20" x2="30" y2="20" stroke="#FFFFFF" stroke-width="3"/>
      </svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const fireStationIcon = L.icon({
  iconUrl: 'https://img.icons8.com/color/48/000000/fire-station.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const evChargingIcon = L.divIcon({
  className: 'custom-icon',
  html: `
    <div style="position: relative; width: 40px; height: 40px;">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <path 
          d="M12 20 L28 20 
             L28 30 Q28 32 26 32 
             L14 32 Q12 32 12 30 Z" 
          fill="#2E8B57" 
          stroke="#1A2417" 
          stroke-width="2"
        />
        <path 
          d="M10 15 L30 15 
             Q32 15 32 17 
             L32 20 L8 20 
             L8 17 Q8 15 10 15Z" 
          fill="#4CAF50" 
          stroke="#1A2417" 
          stroke-width="2"
        />
        <path 
          d="M16 10 L24 10 
             L24 15 L16 15 Z" 
          fill="#1A2417"
        />
        <path 
          d="M14 32 L26 32 
             L26 34 Q26 36 24 36 
             L16 36 Q14 36 14 34 Z" 
          fill="#333333"
        />
        <path 
          d="M18 22 L22 22 
             L21 26 L19 26 Z" 
          fill="#FFFFFF" 
          stroke="#1A2417"
          stroke-width="1"
        />
        <path 
          d="M17 8 L23 8 
             Q25 8 25 10 
             L15 10 Q15 8 17 8Z" 
          fill="#666666"
        />
      </svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Function to select the appropriate icon based on utility type
const getIconForUtility = (utilityType) => {
  switch (utilityType) {
    case 'hospitals':
      return hospitalIcon;
    case 'medical_stores':
      return medicalStoreIcon;
    case 'fire_stations':
      return fireStationIcon;
    case 'ev_charging':
      return evChargingIcon;
    default:
      return null;
  }
};

const MapView = () => {
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default: Delhi [lat, lng]
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [utilityType, setUtilityType] = useState('');
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cities = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  ];

  // Map utility types to TomTom category codes
  const getCategoryForUtility = (utilityType) => {
    switch (utilityType) {
      case 'hospitals':
        return 'hospital'; // TomTom category for hospitals
      case 'medical_stores':
        return 'pharmacy'; // TomTom category for pharmacies
      case 'fire_stations':
        return 'fire station'; // TomTom category for fire stations
      case 'ev_charging':
        return 'electric vehicle station'; // TomTom category for EV charging stations
      default:
        return '';
    }
  };

  // Fetch utility locations from TomTom Search API when city or utility type changes
  useEffect(() => {
    const fetchUtilityLocations = async () => {
      if (!utilityType) {
        setMarkers([]);
        return;
      }
  
      const selected = cities.find((city) => city.name === selectedCity);
      if (!selected) return;
  
      const category = getCategoryForUtility(utilityType);
      if (!category) {
        setMarkers([]);
        return;
      }
  
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://api.tomtom.com/search/2/categorySearch/${encodeURIComponent(category)}.json`,
          {
            params: {
              key: import.meta.env.VITE_TOMTOM_API_KEY,
              lat: selected.lat,
              lon: selected.lng,
              radius: 10000,
              limit: 20,
            },
          }
        );
  
        const places = response.data.results || [];
        const newMarkers = places
          .filter((place) => place.position)
          .map((place) => ({
            lat: place.position.lat,
            lng: place.position.lon,
            name: place.poi?.name || 'Unknown',
          }));
  
        setMarkers(newMarkers);
      } catch (error) {
        console.error(`Error fetching ${utilityType} in ${selectedCity}:`, error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
          if (error.response.status === 403 && error.response.data.includes('Developer Inactive')) {
            setError('Your TomTom developer account is inactive. Please check your account status in the TomTom Developer Portal.');
          } else if (error.response.status === 429) {
            setError('Rate limit exceeded. Please try again later.');
          } else {
            setError(`Failed to load ${utilityType} in ${selectedCity}. Please try again later.`);
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
          setError('No response from the server. Please check your internet connection.');
        } else {
          console.error('Error message:', error.message);
          setError('An unexpected error occurred. Please try again.');
        }
        setMarkers([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUtilityLocations();
  }, [selectedCity, utilityType]);

  const mapStyles = { height: '500px', width: '100%' };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    const selected = cities.find((city) => city.name === cityName);
    if (selected) {
      setMapCenter([selected.lat, selected.lng]);
      setMarkers([]);
      setUtilityType('');
    }
  };

  const handleUtilityChange = (e) => {
    const type = e.target.value;
    setUtilityType(type);
  };

  const currentIcon = getIconForUtility(utilityType);

  return (
    <div className="ml-64 p-6">
      <div className="flex space-x-4 mb-6">
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="p-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {cities.map((city) => (
            <option key={city.name} value={city.name}>{city.name}</option>
          ))}
        </select>
        <select
          value={utilityType}
          onChange={handleUtilityChange}
          className="p-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Utility</option>
          <option value="hospitals">Hospitals</option>
          <option value="medical_stores">Medical Stores</option>
          <option value="fire_stations">Fire Stations</option>
          <option value="ev_charging">EV Charging Stations</option>
        </select>
      </div>
      {loading && (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      )}
      {error && (
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      )}
      <MapContainer center={mapCenter} zoom={12} style={mapStyles}>
        <MapUpdater center={mapCenter} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.lat, marker.lng]}
            icon={currentIcon}
          >
            <Popup>{marker.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;