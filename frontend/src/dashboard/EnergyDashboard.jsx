/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import Sidebar from '@/components/Sidebar';

const API_KEY = import.meta.env.VITE_ELECTRICITY_MAPS_API_KEY;
const ZONE = 'IN-WE'; // India West zone

function EnergyDashboard() {
  const [powerBreakdownData, setPowerBreakdownData] = useState(null);
  const [carbonIntensityData, setCarbonIntensityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const powerBreakdownResponse = await fetch(
          `https://api.electricitymap.org/v3/power-breakdown/latest?zone=${ZONE}`,
          {
            method: 'GET',
            headers: {
              'auth-token': API_KEY,
            },
          }
        );
        if (!powerBreakdownResponse.ok) throw new Error('Failed to fetch power breakdown');
        const powerBreakdown = await powerBreakdownResponse.json();

        const carbonIntensityResponse = await fetch(
          `https://api.electricitymap.org/v3/carbon-intensity/latest?zone=${ZONE}`,
          {
            method: 'GET',
            headers: {
              'auth-token': API_KEY,
            },
          }
        );
        if (!carbonIntensityResponse.ok) throw new Error('Failed to fetch carbon intensity');
        const carbonIntensity = await carbonIntensityResponse.json();

        setPowerBreakdownData(powerBreakdown);
        setCarbonIntensityData(carbonIntensity);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Bar Chart for Power Breakdown (similar to AQI chart in the image)
  const powerBreakdownOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }, // Hide toolbar for a cleaner look
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%', // Thinner bars like in the image
        borderRadius: 4, // Slightly rounded bars
      },
    },
    colors: ['#28a745', '#dc3545'], // Green for positive, red for negative (like the AQI chart)
    xaxis: {
      categories: powerBreakdownData
        ? Object.keys(powerBreakdownData.powerConsumptionBreakdown || {}).map(
            (key) => key.charAt(0).toUpperCase() + key.slice(1)
          )
        : [],
      title: {
        text: 'Energy Sources',
        style: { fontSize: '14px', fontWeight: 600, color: '#333' },
      },
      labels: { style: { fontSize: '12px', fontWeight: 500 } },
    },
    yaxis: {
      title: {
        text: 'Power Consumption (MW)',
        style: { fontSize: '14px', fontWeight: 600, color: '#333' },
      },
      labels: { style: { fontSize: '12px', fontWeight: 500 } },
      min: 0, // Power consumption is typically positive
    },
    title: {
      text: 'Power Consumption Breakdown',
      align: 'left',
      style: { fontSize: '16px', fontWeight: 'bold', color: '#333' },
    },
    legend: { show: false }, // No legend needed for a single series
    dataLabels: { enabled: false },
    tooltip: {
      shared: true,
      intersect: false,
      style: { fontSize: '12px' },
    },
    grid: {
      borderColor: '#e9ecef', // Light grid lines
      strokeDashArray: 4, // Dashed grid lines for a modern look
    },
  };

  const powerBreakdownSeries = powerBreakdownData
    ? [
        {
          name: 'Power Consumption',
          data: Object.values(powerBreakdownData.powerConsumptionBreakdown || {}),
        },
      ]
    : [];

  // Donut Chart for Energy Source Distribution (similar to Departmental Employee Distribution in the image)
  const energySourceOptions = {
    chart: {
      type: 'donut',
      height: 350,
    },
    colors: ['#28a745', '#fd7e14', '#6f42c1'], // Green, orange, purple (matching the image)
    labels: ['Renewable', 'Fossil', 'Other'],
    title: {
      text: 'Energy Source Distribution',
      align: 'left',
      style: { fontSize: '16px', fontWeight: 'bold', color: '#333' },
    },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      fontWeight: 500,
      labels: { colors: '#333' },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`, // Show percentage on the chart
      style: { fontSize: '14px', fontWeight: 'bold', colors: ['#fff'] },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%', // Thicker donut like in the image
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '16px',
              fontWeight: 600,
              color: '#333',
              formatter: () => '100%',
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: 'bottom' },
        },
      },
    ],
  };

  const energySourceSeries = powerBreakdownData
    ? [
        powerBreakdownData.renewablePercentage || 0,
        100 -
          (powerBreakdownData.renewablePercentage || 0) -
          (powerBreakdownData.fossilFreePercentage || 0),
        powerBreakdownData.fossilFreePercentage || 0,
      ]
    : [0, 0, 0];

  return (
    <div className="font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg h-screen fixed top-0 left-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-left mb-8 text-2xl font-bold text-gray-800">
          Energy Dashboard - Western India
        </h1>

        {loading && <p className="text-center text-gray-500">Loading energy data...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="flex flex-wrap justify-center gap-6">
            {/* Power Breakdown Bar Chart */}
            {powerBreakdownData && (
              <div className="w-full md:w-[55%] p-4 bg-white shadow-md rounded-lg">
                <Chart
                  options={powerBreakdownOptions}
                  series={powerBreakdownSeries}
                  type="bar"
                  height={350}
                />
              </div>
            )}

            {/* Energy Source Distribution Donut Chart */}
            {powerBreakdownData && (
              <div className="w-full md:w-[40%] p-4 bg-white shadow-md rounded-lg">
                <Chart
                  options={energySourceOptions}
                  series={energySourceSeries}
                  type="donut"
                  height={350}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EnergyDashboard;