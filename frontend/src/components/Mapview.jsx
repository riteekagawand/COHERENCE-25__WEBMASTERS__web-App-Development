import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapUpdater from './MapUpdater';
import RouteSummary from './RouteSummary';
import { getRoutes, getUtilities } from '../api/api';
import { getIconForUtility } from '../utils/icons';
import { cities } from '../utils/constants';

const MapView = () => {
  const [mapCenter, setMapCenter] = useState([28.7041, 77.1025]); // Default: Delhi
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [utilityType, setUtilityType] = useState('');
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startPlace, setStartPlace] = useState('');
  const [endPlace, setEndPlace] = useState('');
  const [routes, setRoutes] = useState([]);
  const [optimalRouteIndex, setOptimalRouteIndex] = useState(-1);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [useLiveLocation, setUseLiveLocation] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Map utility types to TomTom categories
  const utilityToCategory = {
    hospitals: 'hospital',
    medical_stores: 'pharmacy',
    fire_stations: 'fire station',
    ev_charging: 'charging station',
    police_stations: 'police station' // Added police stations
  };

  // Fetch utility locations (city-based or live location)
  useEffect(() => {
    const fetchUtilityLocations = async () => {
      if (!utilityType) {
        setMarkers([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let lat, lng;
        if (useLiveLocation && userLocation) {
          lat = userLocation.lat;
          lng = userLocation.lng;
          setMapCenter([lat, lng]);
        } else {
          const selected = cities.find((city) => city.name === selectedCity);
          if (!selected) return;
          lat = selected.lat;
          lng = selected.lng;
        }

        const category = utilityToCategory[utilityType] || utilityType;
        const utilities = await getUtilities(category, lat, lng);
        setMarkers(utilities);
      } catch (error) {
        console.error(`Error fetching ${utilityType}${useLiveLocation ? ' near me' : ` in ${selectedCity}`}:`, error);
        setError(error.response?.status === 429 ? 'Rate limit exceeded.' : 'Failed to load data.');
        setMarkers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUtilityLocations();
  }, [selectedCity, utilityType, useLiveLocation, userLocation]);

  // Get user's live location
  const handleGetLiveLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setUseLiveLocation(true);
          setSelectedCity('');
          setRoutes([]);
          setStartPlace('');
          setEndPlace('');
          setStartCoords(null);
          setEndCoords(null);
          setLoading(false);
        },
        (err) => {
          setError('Failed to get live location. Please allow location access.');
          setLoading(false);
          console.error('Geolocation error:', err);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const fetchRoutes = async () => {
    if (!startPlace || !endPlace) {
      setError('Please enter both start and end places.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const selected = cities.find((city) => city.name === selectedCity);
      if (!selected && !useLiveLocation) throw new Error('Selected city not found');
      const lat = useLiveLocation && userLocation ? userLocation.lat : selected.lat;
      const lng = useLiveLocation && userLocation ? userLocation.lng : selected.lng;

      const data = await getRoutes(startPlace, endPlace, lat, lng);
      setRoutes(data.routes);
      setOptimalRouteIndex(data.optimalRouteIndex);
      setStartCoords(data.startCoords);
      setEndCoords(data.endCoords);
      setMapCenter(data.routes[data.optimalRouteIndex].coords[0]);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError(error.response?.data?.error || 'Failed to fetch routes. Please try again.');
      setRoutes([]);
      setStartCoords(null);
      setEndCoords(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    setUseLiveLocation(false);
    const selected = cities.find((city) => city.name === cityName);
    if (selected) {
      setMapCenter([selected.lat, selected.lng]);
      setMarkers([]);
      setUtilityType('');
      setRoutes([]);
      setStartPlace('');
      setEndPlace('');
      setStartCoords(null);
      setEndCoords(null);
    }
  };

  const handleUtilityChange = (e) => {
    setUtilityType(e.target.value);
    setRoutes([]);
  };

  const handleRouteSubmit = (e) => {
    e.preventDefault();
    fetchRoutes();
  };

  const mapStyles = { height: '500px', width: '100%' };
  const currentIcon = getIconForUtility(utilityType);

  return (
    <div className="p-4 md:p-6 ml-16 md:ml-64">
      <div className="flex flex-col space-y-4 mb-6">
        {/* City and Utility Selection */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="w-full sm:w-auto p-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={useLiveLocation}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
          <select
            value={utilityType}
            onChange={handleUtilityChange}
            className="w-full sm:w-auto p-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Utility</option>
            <option value="hospitals">Hospitals</option>
            <option value="medical_stores">Medical Stores</option>
            <option value="fire_stations">Fire Stations</option>
            <option value="ev_charging">EV Charging Stations</option>
            <option value="police_stations">Police Stations</option> {/* Added police stations */}
          </select>
          <button
            onClick={handleGetLiveLocation}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Use My Location
          </button>
        </div>

        {/* Route Input Form */}
        <form onSubmit={handleRouteSubmit} className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <input
            type="text"
            value={startPlace}
            onChange={(e) => setStartPlace(e.target.value)}
            placeholder={useLiveLocation ? 'Start place near me' : `Start place in ${selectedCity} (e.g., India Gate)`}
            className="w-full sm:w-auto p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={endPlace}
            onChange={(e) => setEndPlace(e.target.value)}
            placeholder={useLiveLocation ? 'End place near me' : `End place in ${selectedCity} (e.g., Connaught Place)`}
            className="w-full sm:w-auto p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Get Routes
          </button>
        </form>
      </div>

      {loading && <div className="text-center"><p>Loading...</p></div>}
      {error && <div className="text-center text-red-500"><p>{error}</p></div>}

      <MapContainer center={mapCenter} zoom={12} style={mapStyles}>
        <MapUpdater center={mapCenter} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Utility Markers */}
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]} icon={currentIcon}>
            <Popup>{marker.name}</Popup>
          </Marker>
        ))}
        {/* Start and End Markers */}
        {startCoords && (
          <Marker position={startCoords}>
            <Popup>Start: {startPlace}</Popup>
          </Marker>
        )}
        {endCoords && (
          <Marker position={endCoords}>
            <Popup>End: {endPlace}</Popup>
          </Marker>
        )}
        {/* Routes */}
        {routes.map((route, index) => (
          <Polyline
            key={index}
            positions={route.coords}
            color={route.color}
            weight={index === optimalRouteIndex ? 5 : 3}
            opacity={0.8}
          >
            <Popup>
              Route {index + 1}: {Math.round(route.travelTime / 60)} min
              {route.currentDelay > 0 && ` (Current Delay: ${Math.round(route.currentDelay / 60)} min)`}
              {route.predictedDelay > 0 && ` (Predicted Delay: ${Math.round(route.predictedDelay / 60)} min)`}
              {route.incidentDescription !== 'No incidents' && ` (Incident: ${route.incidentDescription})`}
              {route.isAnomaly && ' (Possible Anomaly - Check for Live Events)'}
              {index === optimalRouteIndex && ' - Optimal Route'}
            </Popup>
          </Polyline>
        ))}
      </MapContainer>

      {routes.length > 0 && (
        <RouteSummary routes={routes} optimalRouteIndex={optimalRouteIndex} />
      )}
    </div>
  );
};

export default MapView;