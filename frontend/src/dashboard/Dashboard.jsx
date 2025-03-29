/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import cityData from '../assets/cityData.json'; // Only used for WQI and weather
import Sidebar from '../home/Sidebar';
import Cta from '@/assets/calltoaction.svg'


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
  const [trafficInfo, setTrafficInfo] = useState({
    index: null,
    category: 'Unknown',
    currentSpeed: 'N/A',
    freeFlowSpeed: 'N/A',
    travelTime: 'N/A',
  });
  const [weatherError, setWeatherError] = useState(null);
  const [uvError, setUvError] = useState(null);
  const [aqiLoading, setAqiLoading] = useState(true);
  const [wqiLoading, setWqiLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [trafficLoading, setTrafficLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(''); // Initially empty
  const [locationError, setLocationError] = useState(null);
  const [userCoords, setUserCoords] = useState(null); // Store live location
  const [isManualSelection, setIsManualSelection] = useState(false); // Track if user manually selected a city

  // State for historical data (simulated for sparklines)
  const [historicalTemperature, setHistoricalTemperature] = useState([]);
  const [historicalHumidity, setHistoricalHumidity] = useState([]);
  const [historicalWindSpeed, setHistoricalWindSpeed] = useState([]);
  const [historicalPressure, setHistoricalPressure] = useState([]);
  const [historicalCondition, setHistoricalCondition] = useState([]);
  const [historicalUvIndex, setHistoricalUvIndex] = useState([]);

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

  const generateHistoricalData = (baseValue, range, count = 24) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const variation = (Math.random() * range * 2) - range;
      data.push(Math.round((baseValue + variation) * 10) / 10);
    }
    return data;
  };

  // Fetch user's live location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Geolocation success:', { lat: latitude, lon: longitude });
          setUserCoords({ lat: latitude, lon: longitude });
          const nearestCity = findNearestCity(latitude, longitude);
          setSelectedCity(nearestCity); // Set initial city based on geolocation
          setLocationError(null);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Unable to fetch your location. Using default city (Mumbai).');
          setSelectedCity('Mumbai'); // Fallback to Mumbai
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error('Geolocation not supported.');
      setLocationError('Geolocation not supported. Using default city (Mumbai).');
      setSelectedCity('Mumbai');
    }
  }, []);

  // Fetch data based on userCoords (priority) or selectedCity
  useEffect(() => {
    const fetchAqi = async () => {
      if (!waqiApiToken) {
        console.error('WAQI API key missing');
        setAqiLoading(false);
        return;
      }
      try {
        console.log('WAQI API Token:', waqiApiToken);
        let url;
        if (userCoords && !isManualSelection) {
          // Use coordinates when geolocation is available and no manual selection
          url = `http://api.waqi.info/feed/geo:${userCoords.lat};${userCoords.lon}/?token=${waqiApiToken}`;
          console.log('Fetching AQI with coordinates:', url);
        } else {
          // Use city name when manually selected or no coords
          url = `http://api.waqi.info/feed/${selectedCity.toLowerCase()}/?token=${waqiApiToken}`;
          console.log('Fetching AQI with city name:', url);
        }
        const response = await axios.get(url);
        console.log('AQI Response:', response.data);

        if (response.data.status === 'ok' && response.data.data) {
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
        } else {
          throw new Error('Invalid AQI response');
        }
      } catch (error) {
        console.error('Error fetching AQI:', error.response ? error.response.data : error.message);
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
      const coords = (userCoords && !isManualSelection) ? userCoords : cityCoordinates[selectedCity];
      const { lat, lon } = coords;
      if (!weatherApiKey) {
        console.error('API key missing for OpenWeatherMap');
        setWeatherError('API key missing');
        setWeather(null);
      } else {
        try {
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`
          );
          setWeather(weatherResponse.data);
          setWeatherError(null);

          const currentTemp = weatherResponse.data.main.temp;
          const currentHumidity = weatherResponse.data.main.humidity;
          const currentWindSpeed = weatherResponse.data.wind.speed;
          const currentPressure = weatherResponse.data.main.pressure;
          const conditionMap = {
            'clear sky': 1,
            'few clouds': 2,
            'scattered clouds': 3,
            'broken clouds': 4,
            'shower rain': 5,
            'rain': 6,
            'thunderstorm': 7,
            'snow': 8,
            'mist': 9
          };
          const currentCondition = conditionMap[weatherResponse.data.weather[0].description.toLowerCase()] || 1;

          setHistoricalTemperature(generateHistoricalData(currentTemp, 5));
          setHistoricalHumidity(generateHistoricalData(currentHumidity, 10));
          setHistoricalWindSpeed(generateHistoricalData(currentWindSpeed, 2));
          setHistoricalPressure(generateHistoricalData(currentPressure, 10));
          setHistoricalCondition(generateHistoricalData(currentCondition, 2, 24).map(val => Math.max(1, Math.min(9, Math.round(val)))));
        } catch (error) {
          console.error('Error fetching weather:', error);
          setWeather(null);
          setWeatherError(error.response?.data?.message || 'Failed to fetch weather');
        }
      }

      try {
        const uvResponse = await axios.get(
          `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lon}`
        );
        if (uvResponse.data.ok) {
          setUvIndex(uvResponse.data.now.uvi);
          setUvError(null);
          setHistoricalUvIndex(generateHistoricalData(uvResponse.data.now.uvi, 2));
        } else {
          throw new Error(uvResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching UV Index:', error);
        setUvIndex(null);
        setUvError('Failed to fetch UV Index');
      } finally {
        setWeatherLoading(false);
      }
    };

    const fetchTrafficData = async () => {
      if (!tomtomApiKey) {
        console.error('API key missing for TomTom');
        setTrafficLoading(false);
        return;
      }

      setTrafficLoading(true);
      const coords = (userCoords && !isManualSelection) ? userCoords : cityCoordinates[selectedCity];
      const { lat, lon } = coords;

      try {
        const response = await axios.get(
          `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${tomtomApiKey}&point=${lat},${lon}`
        );
        const { currentSpeed, freeFlowSpeed, currentTravelTime } = response.data.flowSegmentData;
        const trafficIdx = Math.min(100, Math.round(((freeFlowSpeed - currentSpeed) / freeFlowSpeed) * 100));
        const trafficValue = trafficIdx >= 0 ? trafficIdx : 0;
        const trafficCat = trafficThresholds.find(
          (t) => trafficValue >= t.range[0] && trafficValue <= t.range[1]
        );

        setTrafficInfo({
          index: trafficValue,
          category: trafficCat ? trafficCat.category : 'Unknown',
          currentSpeed,
          freeFlowSpeed,
          travelTime: Math.round(currentTravelTime / 60), // Convert seconds to minutes
        });
      } catch (error) {
        console.error('Error fetching traffic data:', error);
        setTrafficInfo({
          index: null,
          category: 'Unknown',
          currentSpeed: 'N/A',
          freeFlowSpeed: 'N/A',
          travelTime: 'N/A',
        });
      } finally {
        setTrafficLoading(false);
      }
    };

    if (userCoords || selectedCity) {
      Promise.allSettled([fetchAqi(), fetchWqi(), fetchWeatherAndUv(), fetchTrafficData()]);
    }
  }, [waqiApiToken, weatherApiKey, tomtomApiKey, selectedCity, userCoords, isManualSelection]);

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
    stroke: { dashArray: 0, lineCap: 'round', width: 8 },
    fill: { type: 'solid', colors: [color] },
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

  const sparklineOptions = (_data) => ({
    chart: { type: 'area', sparkline: { enabled: true }, height: 40, width: '100%' },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#A5D6A7'],
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    colors: ['#4CAF50'],
    tooltip: { enabled: true, x: { show: false }, y: { formatter: (val) => val.toFixed(1) } },
  });

  const conditionSparklineOptions = (_data) => ({
    chart: { type: 'area', sparkline: { enabled: true }, height: 40, width: '100%' },
    stroke: { curve: 'stepline', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#A5D6A7'],
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    colors: ['#4CAF50'],
    tooltip: {
      enabled: true,
      x: { show: false },
      y: {
        formatter: (val) => {
          const conditionMap = {
            1: 'Clear Sky',
            2: 'Few Clouds',
            3: 'Scattered Clouds',
            4: 'Broken Clouds',
            5: 'Shower Rain',
            6: 'Rain',
            7: 'Thunderstorm',
            8: 'Snow',
            9: 'Mist',
          };
          return conditionMap[Math.round(val)] || 'Unknown';
        },
      },
    },
  });

  const aqiColor = aqi
    ? aqiThresholds.find((t) => aqi >= t.range[0] && aqi <= t.range[1])?.color || '#e0e0e0'
    : '#e0e0e0';
  const wqiColor = wqi
    ? wqiThresholds.find((t) => wqi >= t.range[0] && wqi <= t.range[1])?.color || '#e0e0e0'
    : '#e0e0e0';
  const trafficColor = trafficInfo.index
    ? trafficThresholds.find((t) => trafficInfo.index >= t.range[0] && trafficInfo.index <= t.range[1])?.color || '#e0e0e0'
    : '#e0e0e0';

  const aqiSeries = aqi ? [(aqi / 500) * 100] : [0];
  const wqiSeries = wqi ? [(wqi / 100) * 100] : [0];
  const trafficSeries = trafficInfo.index ? [trafficInfo.index] : [0];

  const wqiParameters = { pH: '7.5', do: '6.8', bod: '3.2' };

  return (
    <div className="min-h-screen bg-[#d1ebc9] flex">
      <div className="w-64 bg-white shadow-lg h-screen fixed top-0 left-0">
        <Sidebar />
      </div>
      
  

      <div className="flex-1 ml-64 p-4">
      <div className="flex-1 p-4">
  {/* Place the SVG here */}
  <div className="mb-4">
    <img src={Cta} alt="Description" className="w-full h-48" />
  </div>
</div>

        <div className="w-full max-w-md mb-4 ml-5">
          <label htmlFor="city-select" className="block text-lg font-medium text-gray-700 mb-2">
            Select City (Overrides Geolocation):
          </label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setIsManualSelection(true); // Mark as manual selection
            }}
            className="w-full p-2 border rounded-md"
          >
            <option value="" disabled>Select a city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {locationError && (
            <p className="text-red-500 text-sm mt-2">{locationError}</p>
          )}
          {userCoords && !isManualSelection && (
            <p className="text-green-500 text-sm mt-2">
              Using your current location (Lat: {userCoords.lat.toFixed(2)}, Lon: {userCoords.lon.toFixed(2)})
            </p>
          )}
        </div>

        <div className="flex-1 p-4">
          {/* Grid Layout for AQI Section */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {/* AQI Card */}
            <div className="col-span-2 row-span-2 bg-white shadow-lg rounded-xl p-6 min-h-[400px] flex flex-col">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Air Quality at {isManualSelection || !userCoords ? selectedCity : 'Current Location'}
              </h2>
              <p className="text-sm text-gray-500 mb-4">Real-time AQI Data</p>
              {aqiLoading ? (
                <p className="text-center text-gray-600 text-base">Loading AQI data...</p>
              ) : aqi ? (
                <div className="flex flex-row items-start justify-between flex-1 overflow-hidden">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="relative">
                      <Chart
                        options={aqiChartOptions(aqi, aqiColor)}
                        series={aqiSeries}
                        type="radialBar"
                        height={250}
                        width={250}
                      />
                    </div>
                    <p className="text-base text-gray-700 mt-2 text-center">
                      Air Quality:{' '}
                      <span className="font-semibold text-lg" style={{ color: aqiColor }}>
                        {aqiCategory}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col space-y-4 flex-1 pl-20 mt-4 h-full">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-base">PM</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 whitespace-nowrap">PM2.5</p>
                        <p className="text-xl font-semibold text-gray-700">
                          {pm25 !== 'N/A' ? `${pm25} µg/m³` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-base">PM</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 whitespace-nowrap">PM10</p>
                        <p className="text-xl font-semibold text-gray-700">
                          {pm10 !== 'N/A' ? `${pm10} µg/m³` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-base">O3</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 whitespace-nowrap">Ozone</p>
                        <p className="text-xl font-semibold text-gray-700">
                          {o3 !== 'N/A' ? `${o3} ppb` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500 text-base">Unable to fetch AQI data</p>
              )}
            </div>

            {/* Temperature Card */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-bold text-center mb-2">Temperature</h3>
              {weatherLoading ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : weather ? (
                <div>
                  <p className="text-center text-3xl font-semibold text-gray-700">
                    {weather.main.temp}°C
                  </p>
                  <div className="mt-2">
                    <Chart
                      options={sparklineOptions(historicalTemperature)}
                      series={[{ data: historicalTemperature }]}
                      type="area"
                      height={40}
                      width="100%"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500">{weatherError || 'Unable to fetch data'}</p>
              )}
            </div>

            {/* Humidity Card */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-bold text-center mb-2">Humidity</h3>
              {weatherLoading ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : weather ? (
                <div>
                  <p className="text-center text-3xl font-semibold text-gray-700">
                    {weather.main.humidity}%
                  </p>
                  <div className="mt-2">
                    <Chart
                      options={sparklineOptions(historicalHumidity)}
                      series={[{ data: historicalHumidity }]}
                      type="area"
                      height={40}
                      width="100%"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500">{weatherError || 'Unable to fetch data'}</p>
              )}
            </div>

            {/* Condition Card */}
            <div className="col-span-2 bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-bold text-center mb-2">Condition</h3>
              {weatherLoading ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : weather ? (
                <div>
                  <p className="text-center text-2xl font-semibold text-gray-700 capitalize">
                    {weather.weather[0].description}
                  </p>
                  <div className="mt-2">
                    <Chart
                      options={conditionSparklineOptions(historicalCondition)}
                      series={[{ data: historicalCondition }]}
                      type="area"
                      height={40}
                      width="100%"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500">{weatherError || 'Unable to fetch data'}</p>
              )}
            </div>
          </div>

          {/* Updated Section for Wind Speed, UV Index, Pressure, and WQI */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {/* Wind Speed */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-bold text-center mb-2">Wind Speed</h3>
              {weatherLoading ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : weather ? (
                <div>
                  <p className="text-center text-3xl font-semibold text-gray-700">
                    {weather.wind.speed} m/s
                  </p>
                  <div className="mt-2">
                    <Chart
                      options={sparklineOptions(historicalWindSpeed)}
                      series={[{ data: historicalWindSpeed }]}
                      type="area"
                      height={40}
                      width="100%"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500">{weatherError || 'Unable to fetch data'}</p>
              )}
            </div>

            {/* UV Index */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-bold text-center mb-2">UV Index</h3>
              {weatherLoading ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : uvIndex !== null ? (
                <div>
                  <p className="text-center text-3xl font-semibold text-gray-700">
                    {uvIndex.toFixed(1)}
                  </p>
                  <div className="mt-2">
                    <Chart
                      options={sparklineOptions(historicalUvIndex)}
                      series={[{ data: historicalUvIndex }]}
                      type="area"
                      height={40}
                      width="100%"
                    />
                  </div>
                </div>
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

            {/* WQI Card */}
            <div className="col-span-2 row-span-2 bg-white shadow-lg rounded-xl p-6 min-h-[400px] flex flex-col">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Water Quality in {selectedCity}
              </h2>
              <p className="text-sm text-gray-500 mb-4">Based on 2023 CPCB Estimates</p>
              {wqiLoading ? (
                <p className="text-center text-gray-600 text-base">Loading WQI data...</p>
              ) : wqi ? (
                <div className="flex flex-row items-start justify-between pl-4 flex-1 overflow-hidden">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="relative">
                      <Chart
                        options={wqiChartOptions(wqi, wqiColor)}
                        series={[wqi]}
                        type="radialBar"
                        height={250}
                        width={250}
                      />
                    </div>
                    <p className="text-base text-gray-700 mt-2 text-center">
                      Water Quality:{' '}
                      <span className="font-semibold text-lg" style={{ color: wqiColor }}>
                        {wqiCategory}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col space-y-4 flex-1 pl-20 mt-4 h-full">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-base">pH</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 whitespace-nowrap">pH Level</p>
                        <p className="text-xl font-semibold text-gray-700">
                          {wqiParameters.pH !== undefined ? wqiParameters.pH : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-base">DO</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 whitespace-nowrap">Dissolved O₂</p>
                        <p className="text-xl font-semibold text-gray-700">
                          {wqiParameters.do !== undefined ? `${wqiParameters.do} mg/L` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-base">BOD</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 whitespace-nowrap">BOD</p>
                        <p className="text-xl font-semibold text-gray-700">
                          {wqiParameters.bod !== undefined ? `${wqiParameters.bod} mg/L` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500 text-base">Unable to fetch WQI data</p>
              )}
            </div>

            {/* Pressure */}
            <div className="col-span-2 bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-bold text-center mb-2">Pressure</h3>
              {weatherLoading ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : weather ? (
                <div>
                  <p className="text-center text-3xl font-semibold text-gray-700">
                    {weather.main.pressure} hPa
                  </p>
                  <div className="mt-2">
                    <Chart
                      options={sparklineOptions(historicalPressure)}
                      series={[{ data: historicalPressure }]}
                      type="area"
                      height={40}
                      width="100%"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500">{weatherError || 'Unable to fetch data'}</p>
              )}
            </div>
          </div>

          {/* Traffic Tracking Section */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2 bg-white shadow-lg rounded-xl p-6 min-h-[400px] flex flex-col">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Traffic at {isManualSelection || !userCoords ? selectedCity : 'Current Location'}
              </h2>
              <p className="text-sm text-gray-500 mb-4">Real-time Traffic Data</p>
              {trafficLoading ? (
                <p className="text-center text-gray-600 text-base">Loading traffic data...</p>
              ) : trafficInfo.index !== null ? (
                <div className="flex flex-row items-start justify-between flex-1 overflow-hidden">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="relative">
                      <Chart
                        options={trafficChartOptions(trafficInfo.index, trafficColor)}
                        series={trafficSeries}
                        type="radialBar"
                        height={250}
                        width={250}
                      />
                    </div>
                    <p className="text-base text-gray-700 mt-2 text-center">
                      Traffic Condition:{' '}
                      <span className="font-semibold text-lg" style={{ color: trafficColor }}>
                        {trafficInfo.category}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col space-y-4 flex-1 pl-20 mt-4 h-full">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-base">CS</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 whitespace-nowrap">Current Speed</p>
                        <p className="text-xl font-semibold text-gray-700">
                          {trafficInfo.currentSpeed !== 'N/A' ? `${trafficInfo.currentSpeed} km/h` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-base">FS</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 whitespace-nowrap">Free Flow</p>
                        <p className="text-xl font-semibold text-gray-700">
                          {trafficInfo.freeFlowSpeed !== 'N/A' ? `${trafficInfo.freeFlowSpeed} km/h` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-base">TT</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 whitespace-nowrap">Travel Time</p>
                        <p className="text-xl font-semibold text-gray-700">
                          {trafficInfo.travelTime !== 'N/A' ? `${trafficInfo.travelTime} min` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500 text-base">Unable to fetch traffic data</p>
              )}
            </div>
            
            <div className="col-span-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;