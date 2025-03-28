// src/components/MapView.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to handle map center updates
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const MapView = () => {
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default: Delhi [lat, lng]
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [utilityType, setUtilityType] = useState('');
  const [markers, setMarkers] = useState([]);
  const [utilityData, setUtilityData] = useState(null); // State to store loaded JSON data

  const cities = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 }
  ];

  // Load utility data from JSON file when the selected city changes
  useEffect(() => {
    const loadUtilityData = async () => {
      try {
        const cityFileName = selectedCity.toLowerCase();
        const data = await import(`../data/${cityFileName}.json`);
        setUtilityData(data.default);
      } catch (error) {
        console.error(`Error loading utility data for ${selectedCity}:`, error);
        setUtilityData(null);
      }
    };
    loadUtilityData();
  }, [selectedCity]);

  const mapStyles = { height: '500px', width: '100%' };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    const selected = cities.find(city => city.name === cityName);
    if (selected) {
      setMapCenter([selected.lat, selected.lng]);
      setMarkers([]); // Clear markers when city changes
      setUtilityType(''); // Reset utility type
    }
  };

  const fetchUtilityLocations = () => {
    if (!utilityType || !utilityData) {
      setMarkers([]);
      return;
    }

    const cityData = utilityData;
    if (cityData && cityData[utilityType]) {
      setMarkers(cityData[utilityType]);
    } else {
      setMarkers([]);
    }
  };

  const handleUtilityChange = (e) => {
    const type = e.target.value;
    setUtilityType(type);
  };

  // Use useEffect to fetch utilities whenever utilityType or utilityData changes
  useEffect(() => {
    fetchUtilityLocations();
  }, [utilityType, utilityData]); // Re-run when utilityType or utilityData changes

  return (
    <div className="ml-64 p-6">
      <div className="flex space-x-4 mb-6">
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="p-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {cities.map(city => (
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
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={mapStyles}
      >
        <MapUpdater center={mapCenter} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            <Popup>{marker.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;