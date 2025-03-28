import { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import cityData from '../assets/cityData.json'; // Import the JSON file
import Sidebar from '@/components/Sidebar';

const Dashboard = () => {
  const [aqi, setAqi] = useState(null);
  const [wqi, setWqi] = useState(null);
  const [aqiCategory, setAqiCategory] = useState('');
  const [wqiCategory, setWqiCategory] = useState('');
  const [weather, setWeather] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [uvError, setUvError] = useState(null);
  const [aqiLoading, setAqiLoading] = useState(true);
  const [wqiLoading, setWqiLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [locationError, setLocationError] = useState(null);
  const waqiApiToken = import.meta.env.VITE_WAQI_API_KEY;
  const weatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const cities = [
    'Ahmedabad', 'Bengaluru', 'Chennai', 'Coimbatore', 'Delhi', 'Ghaziabad',
    'Hyderabad', 'Indore', 'Jaipur', 'Kanpur', 'Kochi', 'Kolkata', 'Kozhikode',
    'Lucknow', 'Mumbai', 'Nagpur', 'Patna', 'Pune', 'Surat'
  ];

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
      const { lat, lon } = cityData.cityCoordinates[city];
      const distance = haversineDistance(userLat, userLon, lat, lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    }
    return nearestCity;
  };

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
        const aqiCat = aqiThresholds.find(
          (t) => aqiData >= t.range[0] && aqiData <= t.range[1]
        );
        setAqiCategory(aqiCat ? aqiCat.category : 'Unknown');
      } catch (error) {
        console.error('Error fetching AQI:', error);
        setAqi(null);
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
      console.log(`Fetching data for ${selectedCity} with lat=${lat}, lon=${lon}`);

      // Fetch Weather Data
      if (!weatherApiKey) {
        console.error('API key missing for OpenWeatherMap');
        setWeatherError('API key missing for OpenWeatherMap');
        setWeather(null);
      } else {
        try {
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`
          );
          console.log('Weather API response:', weatherResponse.data);
          setWeather(weatherResponse.data);
          setWeatherError(null);
        } catch (error) {
          console.error('Error fetching weather:', error.response ? error.response.data : error.message);
          setWeather(null);
          setWeatherError(error.response?.data?.message || 'Failed to fetch weather data');
        }
      }

      // Fetch UV Index Data
      try {
        const uvResponse = await axios.get(
          `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lon}`
        );
        console.log('UV Index API response:', uvResponse.data);
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

    Promise.allSettled([fetchAqi(), fetchWqi(), fetchWeatherAndUv()]).then((results) => {
      console.log('API fetch results:', results);
    });
  }, [waqiApiToken, weatherApiKey, selectedCity]);

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
    chart: { type: 'radialBar' },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: '70%' },
        track: { background: '#e0e0e0', strokeWidth: '100%' },
        dataLabels: {
          show: true,
          name: { show: false },
          value: {
            show: true,
            fontSize: '24px',
            color: '#111',
            offsetY: -10,
            formatter: () => (value ? `${value}%` : 'N/A'),
          },
        },
      },
    },
    stroke: { dashArray: 0 },
    fill: { type: 'solid', colors: [color] },
    labels: ['WQI'],
  });

  const aqiColor = aqi
    ? aqiThresholds.find((t) => aqi >= t.range[0] && aqi <= t.range[1])?.color || '#e0e0e0'
    : '#e0e0e0';
  const wqiColor = wqi
    ? wqiThresholds.find((t) => wqi >= t.range[0] && wqi <= t.range[1])?.color || '#e0e0e0'
    : '#e0e0e0';

  const aqiSeries = aqi ? [(aqi / 500) * 100] : [0];
  const wqiSeries = wqi ? [wqi] : [0];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar on the Left */}
      <div className="w-64 bg-white shadow-lg h-screen fixed top-0 left-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-4">
        {/* City Selection Dropdown */}
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

        {/* Bento Grid for Data Cards */}
        <div className="grid grid-cols-4 gap-4 auto-rows-[minmax(200px, auto)]">
          {/* AQI Card - Spans 2 columns */}
          <div className="col-span-2 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-4">Air Quality in {selectedCity}</h2>
            {aqiLoading ? (
              <p className="text-center text-gray-600">Loading AQI data...</p>
            ) : aqi ? (
              <div>
                <Chart
                  options={aqiChartOptions(aqi, aqiColor)}
                  series={aqiSeries}
                  type="radialBar"
                  height={350}
                />
                <p className="text-center text-gray-700 mt-4">
                  Current AQI: <span className="font-semibold">{aqi}</span>
                </p>
                <p className="text-center text-gray-700">
                  Air Quality:{' '}
                  <span className="font-semibold" style={{ color: aqiColor }}>
                    {aqiCategory}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-center text-red-500">Unable to fetch AQI data</p>
            )}
          </div>

          {/* WQI Card - Spans 2 columns */}
          <div className="col-span-2 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-4">Water Quality in {selectedCity}</h2>
            {wqiLoading ? (
              <p className="text-center text-gray-600">Loading WQI data...</p>
            ) : wqi ? (
              <div>
                <Chart
                  options={wqiChartOptions(wqi, wqiColor)}
                  series={wqiSeries}
                  type="radialBar"
                  height={250}
                />
                <p className="text-center text-gray-700 mt-4">
                  Current WQI: <span className="font-semibold">{wqi}</span>
                </p>
                <p className="text-center text-gray-700">
                  Water Quality:{' '}
                  <span className="font-semibold" style={{ color: wqiColor }}>
                    {wqiCategory}
                  </span>
                </p>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Data based on 2023 CPCB estimates
                </p>
              </div>
            ) : (
              <p className="text-center text-red-500">Unable to fetch WQI data</p>
            )}
          </div>

          {/* Temperature Card - Spans 1 column */}
          <div className="col-span-1 bg-white shadow-lg rounded-lg p-6">
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

          {/* Humidity Card - Spans 1 column */}
          <div className="col-span-1 bg-white shadow-lg rounded-lg p-6">
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

          {/* Wind Speed Card - Spans 1 column */}
          <div className="col-span-1 bg-white shadow-lg rounded-lg p-6">
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

          {/* UV Index Card - Spans 1 column */}
          <div className="col-span-1 bg-white shadow-lg rounded-lg p-6">
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
              Data provided by <a href="https://currentuvindex.com" target="_blank" rel="noopener noreferrer">CurrentUVIndex</a> (CC BY 4.0)
            </p>
          </div>

          {/* Pressure Card - Spans 2 columns */}
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

          {/* Weather Description Card - Spans 2 columns */}
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