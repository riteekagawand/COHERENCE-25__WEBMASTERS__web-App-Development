import { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import cityData from '../assets/cityData.json'; // Only used for WQI and weather
import Sidebar from '@/components/Sidebar';

const Dashboard = () => {
  const [aqi, setAqi] = useState(null);
  const [pm25, setPm25] = useState(null);
  const [pm10, setPm10] = useState(null);
  const [o3, setO3] = useState(null);
  const [wqi, setWqi] = useState(null);
  const [aqiCategory, setAqiCategory] = useState('');
  const [wqiCategory, setWqiCategory] = useState('');
  const [weather, setWeather] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [trafficData, setTrafficData] = useState({});
  const [weatherError, setWeatherError] = useState(null);
  const [uvError, setUvError] = useState(null);
  const [aqiLoading, setAqiLoading] = useState(true);
  const [wqiLoading, setWqiLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [trafficLoading, setTrafficLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [locationError, setLocationError] = useState(null);
  const waqiApiToken = import.meta.env.VITE_WAQI_API_KEY;
  const weatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const tomtomApiKey = import.meta.env.VITE_TOMTOM_API_KEY;

  const cities = [
    'Ahmedabad', 'Bengaluru', 'Chennai', 'Coimbatore', 'Delhi', 'Ghaziabad',
    'Hyderabad', 'Indore', 'Jaipur', 'Kanpur', 'Kochi', 'Kolkata', 'Kozhikode',
    'Lucknow', 'Mumbai', 'Nagpur', 'Patna', 'Pune', 'Surat'
  ];

  const cityCoordinates = {
    'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
    'Bengaluru': { lat: 12.9716, lon: 77.5946 },
    'Chennai': { lat: 13.0827, lon: 80.2707 },
    'Coimbatore': { lat: 11.0168, lon: 76.9558 },
    'Delhi': { lat: 28.7041, lon: 77.1025 },
    'Ghaziabad': { lat: 28.6692, lon: 77.4538 },
    'Hyderabad': { lat: 17.3850, lon: 78.4867 },
    'Indore': { lat: 22.7196, lon: 75.8577 },
    'Jaipur': { lat: 26.9124, lon: 75.7873 },
    'Kanpur': { lat: 26.4499, lon: 80.3319 },
    'Kochi': { lat: 9.9312, lon: 76.2673 },
    'Kolkata': { lat: 22.5726, lon: 88.3639 },
    'Kozhikode': { lat: 11.2588, lon: 75.7804 },
    'Lucknow': { lat: 26.8467, lon: 80.9462 },
    'Mumbai': { lat: 19.0760, lon: 72.8777 },
    'Nagpur': { lat: 21.1458, lon: 79.0882 },
    'Patna': { lat: 25.5941, lon: 85.1376 },
    'Pune': { lat: 18.5204, lon: 73.8567 },
    'Surat': { lat: 21.1702, lon: 72.8311 }
  };

  const aqiThresholds = [
    { range: [0, 50], category: 'Excellent', color: '#00FF00' },
    { range: [51, 100], category: 'Good', color: '#0000FF' },
    { range: [101, 150], category: 'Poor', color: '#FF0000' },
    { range: [151, 200], category: 'Unhealthy', color: '#FF0000' },
    { range: [201, 300], category: 'Very Unhealthy', color: '#800080' },
    { range: [301, 500], category: 'Hazardous', color: '#800000' },
  ];

  const wqiThresholds = [
    { range: [91, 100], category: 'Excellent', color: '#00FF00' },
    { range: [71, 90], category: 'Good', color: '#0000FF' },
    { range: [51, 70], category: 'Medium', color: '#FFA500' },
    { range: [26, 50], category: 'Poor', color: '#FF0000' },
    { range: [0, 25], category: 'Very Poor', color: '#8B4513' },
  ];

  const trafficThresholds = [
    { range: [0, 20], category: 'Free Flow', color: '#00FF00' },
    { range: [21, 40], category: 'Light', color: '#FFFF00' },
    { range: [41, 60], category: 'Moderate', color: '#FFA500' },
    { range: [61, 80], category: 'Heavy', color: '#FF0000' },
    { range: [81, 100], category: 'Severe', color: '#800000' },
  ];

  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearestCity = (userLat, userLon) => {
    let nearestCity = 'Mumbai';
    let minDistance = Infinity;

    for (const city of cities) {
      const { lat, lon } = cityCoordinates[city];
      const distance = haversineDistance(userLat, userLon, lat, lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    }
    return nearestCity;
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestCity = findNearestCity(latitude, longitude);
          setSelectedCity(nearestCity);
          setLocationError(null);
        },
        (error) => {
          console.error('Error fetching location:', error);
          setLocationError('Unable to fetch your location. Please select a city manually.');
          setSelectedCity('Mumbai');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLocationError('Geolocation is not supported by your browser.');
      setSelectedCity('Mumbai');
    }
  }, []);

  useEffect(() => {
    const fetchAqi = async () => {
      if (!waqiApiToken) {
        console.error('API key missing for WAQI');
        setAqiLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `http://api.waqi.info/feed/${selectedCity.toLowerCase()}/?token=${waqiApiToken}`
        );
        const aqiData = response.data.data.aqi;
        setAqi(aqiData);
        const iaqi = response.data.data.iaqi;
        setPm25(iaqi?.pm25?.v || 'N/A');
        setPm10(iaqi?.pm10?.v || 'N/A');
        setO3(iaqi?.o3?.v || 'N/A');
        const aqiCat = aqiThresholds.find(
          (t) => aqiData >= t.range[0] && aqiData <= t.range[1]
        );
        setAqiCategory(aqiCat ? aqiCat.category : 'Unknown');
      } catch (error) {
        console.error('Error fetching AQI:', error);
        setAqi(null);
        setPm25(null);
        setPm10(null);
        setO3(null);
        setAqiCategory('Unknown');
      } finally {
        setAqiLoading(false);
      }
    };

    const fetchWqi = async () => {
      try {
        const wqiValue = cityData.cityWqiData[selectedCity] || 65;
        setWqi(wqiValue);
        const wqiCat = wqiThresholds.find(
          (t) => wqiValue >= t.range[0] && wqiValue <= t.range[1]
        );
        setWqiCategory(wqiCat ? wqiCat.category : 'Unknown');
      } catch (error) {
        console.error('Error fetching WQI:', error);
        setWqi(null);
        setWqiCategory('Unknown');
      } finally {
        setWqiLoading(false);
      }
    };

    const fetchWeatherAndUv = async () => {
      const { lat, lon } = cityData.cityCoordinates[selectedCity];
      if (!weatherApiKey) {
        console.error('API key missing for OpenWeatherMap');
        setWeatherError('API key missing for OpenWeatherMap');
        setWeather(null);
      } else {
        try {
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`
          );
          setWeather(weatherResponse.data);
          setWeatherError(null);
        } catch (error) {
          console.error('Error fetching weather:', error.response ? error.response.data : error.message);
          setWeather(null);
          setWeatherError(error.response?.data?.message || 'Failed to fetch weather data');
        }
      }

      try {
        const uvResponse = await axios.get(
          `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lon}`
        );
        if (uvResponse.data.ok) {
          setUvIndex(uvResponse.data.now.uvi);
          setUvError(null);
        } else {
          throw new Error(uvResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching UV Index:', error.message);
        setUvIndex(null);
        setUvError('Failed to fetch UV Index data');
      } finally {
        setWeatherLoading(false);
      }
    };

    const fetchTrafficForAllCities = async () => {
      if (!tomtomApiKey) {
        console.error('API key missing for TomTom');
        setTrafficLoading(false);
        return;
      }

      const trafficMap = {};
      for (const city of cities) {
        try {
          const { lat, lon } = cityCoordinates[city];
          const response = await axios.get(
            `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${tomtomApiKey}&point=${lat},${lon}`
          );
          const { currentSpeed, freeFlowSpeed } = response.data.flowSegmentData;
          const trafficIdx = Math.min(100, Math.round(((freeFlowSpeed - currentSpeed) / freeFlowSpeed) * 100));
          const trafficValue = trafficIdx >= 0 ? trafficIdx : 0;
          const trafficCat = trafficThresholds.find(
            (t) => trafficValue >= t.range[0] && trafficValue <= t.range[1]
          );
          trafficMap[city] = {
            index: trafficValue,
            category: trafficCat ? trafficCat.category : 'Unknown',
            currentSpeed,
            freeFlowSpeed,
            travelTime: 'N/A' // Placeholder; could be calculated with additional data
          };
        } catch (error) {
          console.error(`Error fetching traffic for ${city}:`, error.message);
          trafficMap[city] = { index: null, category: 'Unknown', currentSpeed: 'N/A', freeFlowSpeed: 'N/A', travelTime: 'N/A' };
        }
        await delay(500);
      }
      setTrafficData(trafficMap);
      setTrafficLoading(false);
    };

    Promise.allSettled([fetchAqi(), fetchWqi(), fetchWeatherAndUv(), fetchTrafficForAllCities()]);
  }, [waqiApiToken, weatherApiKey, tomtomApiKey, selectedCity]);

  const aqiChartOptions = (value, color) => ({
    chart: { type: 'radialBar' },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        hollow: { size: '70%' },
        track: { background: '#e0e0e0', strokeWidth: '100%' },
        dataLabels: {
          show: true,
          name: { show: false },
          value: {
            show: true,
            fontSize: '24px',
            color: '#111',
            offsetY: 0,
            formatter: () => (value ? value : 'N/A'),
          },
        },
      },
    },
    stroke: { dashArray: 4, lineCap: 'butt', width: 8 },
    fill: { type: 'solid', colors: [color] },
    labels: ['AQI'],
  });

  const wqiChartOptions = (value, color) => ({
    chart: {
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        startAngle: -90, // Start at -90 degrees (left side of semicircle)
        endAngle: 90,   // End at 90 degrees (right side of semicircle)
        hollow: {
          size: '70%', // Size of the hollow center
        },
        track: {
          background: '#e0e0e0', // Background color of the track
          strokeWidth: '100%',
        },
        dataLabels: {
          show: true,
          name: {
            show: false, // Hide the label "WQI"
          },
          value: {
            show: true,
            fontSize: '24px',
            color: '#111',
            offsetY: -10, // Adjust position of the percentage text
            formatter: () => (value ? `${value}%` : 'N/A'), // Display value as percentage
          },
        },
      },
    },
    stroke: {
      dashArray: 0, // Solid line (no dashes)
      lineCap: 'round', // Rounded ends for the gauge
      width: 8,
    },
    fill: {
      type: 'solid',
      colors: [color], // Use the dynamic color based on WQI category
    },
    labels: ['WQI'],
  });
  const trafficChartOptions = (value, color) => ({
    chart: { type: 'radialBar' },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        hollow: { size: '70%' },
        track: { background: '#e0e0e0', strokeWidth: '100%' },
        dataLabels: {
          show: true,
          name: { show: false },
          value: {
            show: true,
            fontSize: '24px',
            color: '#111',
            offsetY: 0,
            formatter: () => (value ? `${value}%` : 'N/A'),
          },
        },
      },
    },
    stroke: { dashArray: 4, lineCap: 'butt', width: 8 },
    fill: { type: 'solid', colors: [color] },
    labels: ['Traffic'],
  });

  const aqiColor = aqi
    ? aqiThresholds.find((t) => aqi >= t.range[0] && aqi <= t.range[1])?.color || '#e0e0e0'
    : '#e0e0e0';
  const wqiColor = wqi
    ? wqiThresholds.find((t) => wqi >= t.range[0] && wqi <= t.range[1])?.color || '#e0e0e0'
    : '#e0e0e0';
  const trafficInfo = trafficData[selectedCity] || { index: null, category: 'Unknown', currentSpeed: 'N/A', freeFlowSpeed: 'N/A', travelTime: 'N/A' };
  const trafficColor = trafficInfo.index
    ? trafficThresholds.find((t) => trafficInfo.index >= t.range[0] && trafficInfo.index <= t.range[1])?.color || '#e0e0e0'
    : '#e0e0e0';

  const aqiSeries = aqi ? [(aqi / 500) * 100] : [0];
  const wqiSeries = wqi ? [(wqi / 100) * 100] : [0]; // Scale to 0-100 for consistency
  const trafficSeries = trafficInfo.index ? [trafficInfo.index] : [0];

  // Placeholder WQI parameters
  const wqiParameters = {
    pH: '7.5', // Example
    do: '6.8',  // Dissolved Oxygen in mg/L
    bod: '3.2'  // Biochemical Oxygen Demand in mg/L
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white shadow-lg h-screen fixed top-0 left-0">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-4">
        <div className="w-full max-w-md mb-4">
          <label htmlFor="city-select" className="block text-lg font-medium text-gray-700 mb-2">
            Select City:
          </label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {locationError && (
            <p className="text-red-500 text-sm mt-2">{locationError}</p>
          )}
        </div>

        {/* Main Cards (AQI, WQI, Traffic) in One Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* AQI Card */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Air Quality in {selectedCity}</h2>
            <p className="text-sm text-gray-500 mb-4">Real-time AQI Data</p>
            {aqiLoading ? (
              <p className="text-center text-gray-600">Loading AQI data...</p>
            ) : aqi ? (
              <div>
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Chart
                      options={aqiChartOptions(aqi, aqiColor)}
                      series={aqiSeries}
                      type="radialBar"
                      height={200}
                      width={200}
                    />
                  </div>
                </div>
                <p className="text-center text-gray-700 mb-6">
                  Air Quality:{' '}
                  <span className="font-semibold" style={{ color: aqiColor }}>
                    {aqiCategory}
                  </span>
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-sm">PM</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">PM2.5</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {pm25 !== 'N/A' ? `${pm25} µg/m³` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-sm">PM</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">PM10</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {pm10 !== 'N/A' ? `${pm10} µg/m³` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-sm">O3</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ozone</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {o3 !== 'N/A' ? `${o3} ppb` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-red-500">Unable to fetch AQI data</p>
            )}
          </div>

   {/* WQI Card */}
<div className="bg-white shadow-lg rounded-lg p-6">
  <h2 className="text-xl font-bold text-gray-800 mb-1">Water Quality in {selectedCity}</h2>
  <p className="text-sm text-gray-500 mb-4">Based on 2023 CPCB Estimates</p>
  {wqiLoading ? (
    <p className="text-center text-gray-600">Loading WQI data...</p>
  ) : wqi ? (
    <div>
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Chart
            options={wqiChartOptions(wqi, wqiColor)}
            series={[wqi]} // WQI value as a percentage (0-100)
            type="radialBar"
            height={250}
            width={250}
          />
        </div>
      </div>
      <p className="text-center text-gray-700 mb-6">
        Water Quality:{' '}
        <span className="font-semibold" style={{ color: wqiColor }}>
          {wqiCategory}
        </span>
      </p>
      <div className="grid grid-cols-3 gap-4 ">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-sm">pH</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">pH Level</p>
            <p className="text-lg font-semibold text-gray-700">
              {wqiParameters.pH !== undefined ? wqiParameters.pH : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-sm">DO</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Dissolved O₂</p>
            <p className="text-lg font-semibold text-gray-700">
              {wqiParameters.do !== undefined ? `${wqiParameters.do} mg/L` : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-sm">BOD</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">BOD</p>
            <p className="text-lg font-semibold text-gray-700">
              {wqiParameters.bod !== undefined ? `${wqiParameters.bod} mg/L` : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-center text-red-500">Unable to fetch WQI data</p>
  )}
</div>
          {/* Traffic Card */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Traffic in {selectedCity}</h2>
            <p className="text-sm text-gray-500 mb-4">Real-time Traffic Data</p>
            {trafficLoading ? (
              <p className="text-center text-gray-600">Loading traffic data...</p>
            ) : trafficInfo.index !== null ? (
              <div>
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Chart
                      options={trafficChartOptions(trafficInfo.index, trafficColor)}
                      series={trafficSeries}
                      type="radialBar"
                      height={200}
                      width={200}
                    />
                  </div>
                </div>
                <p className="text-center text-gray-700 mb-6">
                  Traffic Condition:{' '}
                  <span className="font-semibold" style={{ color: trafficColor }}>
                    {trafficInfo.category}
                  </span>
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-sm">CS</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Speed</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {trafficInfo.currentSpeed !== 'N/A' ? `${trafficInfo.currentSpeed} km/h` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-sm">FS</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Free Flow</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {trafficInfo.freeFlowSpeed !== 'N/A' ? `${trafficInfo.freeFlowSpeed} km/h` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-sm">TT</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Travel Time</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {trafficInfo.travelTime !== 'N/A' ? `${trafficInfo.travelTime} min` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-red-500">Unable to fetch traffic data</p>
            )}
          </div>
        </div>

        {/* Weather and UV Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-center mb-2">Temperature</h3>
            {weatherLoading ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : weather ? (
              <p className="text-center text-3xl font-semibold text-gray-700">
                {weather.main.temp}°C
              </p>
            ) : (
              <p className="text-center text-red-500">{weatherError || 'Unable to fetch data'}</p>
            )}
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-center mb-2">Humidity</h3>
            {weatherLoading ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : weather ? (
              <p className="text-center text-3xl font-semibold text-gray-700">
                {weather.main.humidity}%
              </p>
            ) : (
              <p className="text-center text-red-500">{weatherError || 'Unable to fetch data'}</p>
            )}
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-center mb-2">Wind Speed</h3>
            {weatherLoading ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : weather ? (
              <p className="text-center text-3xl font-semibold text-gray-700">
                {weather.wind.speed} m/s
              </p>
            ) : (
              <p className="text-center text-red-500">{weatherError || 'Unable to fetch data'}</p>
            )}
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-center mb-2">UV Index</h3>
            {weatherLoading ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : uvIndex !== null ? (
              <p className="text-center text-3xl font-semibold text-gray-700">
                {uvIndex.toFixed(1)}
              </p>
            ) : (
              <p className="text-center text-red-500">{uvError || 'Unable to fetch data'}</p>
            )}
            <p className="text-center text-sm text-gray-500 mt-2">
              Data provided by{' '}
              <a href="https://currentuvindex.com" target="_blank" rel="noopener noreferrer">
                CurrentUVIndex
              </a>{' '}
              (CC BY 4.0)
            </p>
          </div>
          <div className="col-span-2 bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-center mb-2">Pressure</h3>
            {weatherLoading ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : weather ? (
              <p className="text-center text-3xl font-semibold text-gray-700">
                {weather.main.pressure} hPa
              </p>
            ) : (
              <p className="text-center text-red-500">{weatherError || 'Unable to fetch data'}</p>
            )}
          </div>
          <div className="col-span-2 bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-center mb-2">Condition</h3>
            {weatherLoading ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : weather ? (
              <p className="text-center text-2xl font-semibold text-gray-700 capitalize">
                {weather.weather[0].description}
              </p>
            ) : (
              <p className="text-center text-red-500">{weatherError || 'Unable to fetch data'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;