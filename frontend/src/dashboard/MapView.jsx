import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl } from 'react-leaflet';
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
  const [mapZoom, setMapZoom] = useState(12);

  // Map utility types to TomTom categories
  const utilityToCategory = {
    hospitals: 'hospital',
    medical_stores: 'pharmacy',
    fire_stations: 'fire station',
    ev_charging: 'charging station',
    police_stations: 'police station'
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
          setMapZoom(14); // Zoom in closer when using live location
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
      setMapZoom(13); // Adjust zoom to show the route better
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
      setMapZoom(12);
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

  const resetFilters = () => {
    setUtilityType('');
    setMarkers([]);
    setRoutes([]);
    setStartPlace('');
    setEndPlace('');
    setStartCoords(null);
    setEndCoords(null);
  };

  const mapStyles = { height: '600px', width: '100%', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' };
  const currentIcon = getIconForUtility(utilityType);

  return (
    <div className="p-6 ml-16 md:ml-64" style={{ backgroundColor: '#D1EBC9', minHeight: '100vh' }}>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Urban Navigation & Utilities</h1>
          
          {/* Control Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Location Selection */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Location</h2>
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="flex-grow p-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={useLiveLocation}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleGetLiveLocation}
                  className="p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm flex items-center justify-center"
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Use My Location
                </button>
              </div>
              
              {/* Utility Selection */}
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Services</h2>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={utilityType}
                    onChange={handleUtilityChange}
                    className="flex-grow p-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Service Type</option>
                    <option value="hospitals">Hospitals</option>
                    <option value="medical_stores">Medical Stores</option>
                    <option value="fire_stations">Fire Stations</option>
                    <option value="ev_charging">EV Charging Stations</option>
                    <option value="police_stations">Police Stations</option>
                  </select>
                  <button
                    onClick={resetFilters}
                    className="p-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 shadow-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
            
            {/* Route Planning */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Route Planning</h2>
              <form onSubmit={handleRouteSubmit} className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  <div className="flex-grow relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                    </div>
                    <input
                      type="text"
                      value={startPlace}
                      onChange={(e) => setStartPlace(e.target.value)}
                      placeholder={useLiveLocation ? 'Start place near me' : `Start place in ${selectedCity || 'selected city'}`}
                      className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex-grow relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                    </div>
                    <input
                      type="text"
                      value={endPlace}
                      onChange={(e) => setEndPlace(e.target.value)}
                      placeholder={useLiveLocation ? 'End place near me' : `End place in ${selectedCity || 'selected city'}`}
                      className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm flex items-center justify-center"
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                  </svg>
                  Find Routes
                </button>
              </form>
            </div>
          </div>
          
          {/* Status Messages */}
          {loading && (
            <div className="flex justify-center items-center p-4 mb-6 bg-blue-50 rounded-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mr-3"></div>
              <p className="text-blue-700">Loading data...</p>
            </div>
          )}
          
          {error && (
            <div className="p-4 mb-6 bg-red-50 rounded-lg flex items-start">
              <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <MapContainer center={mapCenter} zoom={mapZoom} style={mapStyles} zoomControl={false}>
            <MapUpdater center={mapCenter} zoom={mapZoom} />
            <ZoomControl position="bottomright" />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Utility Markers */}
            {markers.map((marker, index) => (
              <Marker key={index} position={[marker.lat, marker.lng]} icon={currentIcon}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold">{marker.name}</h3>
                    {marker.address && <p className="text-sm text-gray-600">{marker.address}</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
            {/* Start and End Markers */}
            {startCoords && (
              <Marker position={startCoords}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold">Start</h3>
                    <p>{startPlace}</p>
                  </div>
                </Popup>
              </Marker>
            )}
            {endCoords && (
              <Marker position={endCoords}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold">Destination</h3>
                    <p>{endPlace}</p>
                  </div>
                </Popup>
              </Marker>
            )}
            {/* Routes */}
            {routes.map((route, index) => (
              <Polyline
                key={index}
                positions={route.coords}
                color={route.color || (index === optimalRouteIndex ? '#2563eb' : '#6b7280')}
                weight={index === optimalRouteIndex ? 6 : 3}
                opacity={index === optimalRouteIndex ? 0.9 : 0.7}
                dashArray={route.isAnomaly ? '5, 10' : ''}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold">{index === optimalRouteIndex ? 'Optimal Route' : `Route ${index + 1}`}</h3>
                    <p className="mb-1">Travel time: {Math.round(route.travelTime / 60)} min</p>
                    {route.currentDelay > 0 && (
                      <p className="text-amber-600">Current delay: {Math.round(route.currentDelay / 60)} min</p>
                    )}
                    {route.predictedDelay > 0 && (
                      <p className="text-orange-600">Predicted delay: {Math.round(route.predictedDelay / 60)} min</p>
                    )}
                    {route.incidentDescription !== 'No incidents' && (
                      <p className="text-red-600 mt-1">{route.incidentDescription}</p>
                    )}
                    {route.isAnomaly && (
                      <p className="text-purple-600 mt-1">Possible anomaly - Check for live events</p>
                    )}
                  </div>
                </Popup>
              </Polyline>
            ))}
          </MapContainer>
        </div>

        {/* Route Summary */}
        {routes.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <RouteSummary routes={routes} optimalRouteIndex={optimalRouteIndex} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;