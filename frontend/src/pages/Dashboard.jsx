import { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

const Dashboard = () => {
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);
  const city = 'mumbai'; // Fetching AQI for Mumbai
  const apiToken = import.meta.env.VITE_WAQI_API_KEY; // Correct Vite env access

  // Fetch AQI data from WAQI API
  useEffect(() => {
    const fetchAqi = async () => {
      if (!apiToken) {
        console.error('API key is missing. Please set VITE_WAQI_API_KEY in .env');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://api.waqi.info/feed/${city}/?token=${apiToken}`
        );
        const aqiData = response.data.data.aqi;
        setAqi(aqiData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching AQI:', error);
        setLoading(false);
      }
    };
    fetchAqi();
  }, [apiToken]);

  // ApexCharts configuration for segmented stroked circular gauge
  const chartOptions = {
    chart: {
      id: 'aqi-gauge',
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        startAngle: 0, // Full circle starts at 0
        endAngle: 360, // Full circle ends at 360
        hollow: {
          size: '70%', // Size of the inner empty circle
        },
        track: {
          background: '#e0e0e0', // Background track color (gray)
          strokeWidth: '100%', // Full width of the track
        },
        dataLabels: {
          show: true,
          name: {
            show: true,
            fontSize: '16px',
            color: '#888',
            offsetY: 30,
          },
          value: {
            show: true,
            fontSize: '24px',
            color: '#111',
            offsetY: -10,
            formatter: () => (aqi ? aqi : 'N/A'),
          },
        },
      },
    },
    stroke: {
      dashArray: 4, // Creates the segmented, dashed effect
      lineCap: 'butt', // Flat ends for the dashes (not rounded)
    },
    fill: {
      type: 'solid',
      colors: ['#1E90FF'], // Blue color to match the image
    },
    labels: ['AQI'],
  };

  const chartSeries = aqi ? [(aqi / 500) * 100] : [0]; // Scale AQI (0-500) to percentage

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Air Quality in Mumbai
        </h2>
        {loading ? (
          <p className="text-center text-gray-600">Loading AQI data...</p>
        ) : aqi ? (
          <div>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="radialBar"
              height={350}
            />
            <p className="text-center text-gray-700 mt-4">
              Current AQI: <span className="font-semibold">{aqi}</span>
            </p>
            <p className="text-center text-sm text-gray-500">
              Data sourced from WAQI in real-time
            </p>
          </div>
        ) : (
          <p className="text-center text-red-500">Unable to fetch AQI data</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;