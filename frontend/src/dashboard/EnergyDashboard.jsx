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

  // Mixed Line and Column Chart for Power Breakdown
  const powerBreakdownOptions = {
    chart: {
      type: 'line',
      height: 400,
      stacked: false,
    },
    stroke: {
      width: [0, 4],
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    xaxis: {
      categories: powerBreakdownData
        ? Object.keys(powerBreakdownData.powerConsumptionBreakdown || {}).map(
            key => key.charAt(0).toUpperCase() + key.slice(1)
          )
        : [],
      title: { text: 'Energy Sources' }
    },
    yaxis: [
      {
        seriesName: 'Power Consumption',
        title: { text: 'Power Consumption (MW)' },
      },
      {
        opposite: true,
        seriesName: 'Power Consumption Trend',
        title: { text: 'Power Consumption (MW)' },
      }
    ],
    title: {
      text: `Power Breakdown for Western Region of India`,
      align: 'center',
    },
    legend: { position: 'top' },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0]
    },
    tooltip: { shared: true },
  };

  const powerBreakdownSeries = powerBreakdownData
    ? [
        {
          name: 'Power Consumption',
          type: 'column',
          data: Object.values(powerBreakdownData.powerConsumptionBreakdown || {}),
        },
        {
          name: 'Power Consumption Trend',
          type: 'line',
          data: Object.values(powerBreakdownData.powerConsumptionBreakdown || {}),
        }
      ]
    : [];

  // Radial Bar Chart for Carbon Intensity
  const carbonIntensityOptions = {
    chart: {
      type: 'radialBar',
      height: 400,
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { margin: 0, size: '70%' },
        track: { background: '#e7e7e7', strokeWidth: '97%' },
        dataLabels: {
          show: true,
          name: { show: true },
          value: {
            offsetY: 10,
            fontSize: '22px',
            formatter: function (val) {
              return `${val} gCO2eq/kWh`;
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#FF4560'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    title: {
      text: `Carbon Intensity for Western Region`,
      align: 'center',
    },
    labels: ['Current Intensity'],
  };

  const carbonIntensitySeries = carbonIntensityData
    ? [(carbonIntensityData.carbonIntensity / 1000) * 100]
    : [];

  const cardStyle = {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '20px',
    margin: '20px auto',
    maxWidth: '800px'
  };

  return (
    
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
        <div className="w-64 bg-white shadow-lg h-screen fixed top-0 left-0">
        <Sidebar />
      </div>
      <h1 style={{ textAlign: 'center' }}>Energy Dashboard - Western India</h1>

      {loading && <p style={{ textAlign: 'center' }}>Loading energy data...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Power Breakdown Card */}
          {powerBreakdownData && (
            <div style={cardStyle}>
              <Chart
                options={powerBreakdownOptions}
                series={powerBreakdownSeries}
                type="line"
                height={400}
              />
              <div style={{ marginTop: '20px' }}>
                <p style={{ textAlign: 'center' }}>
                  Real-time energy mix distribution for Western India region (Columns) with consumption trend (Line)
                </p>
                <div style={{ marginTop: '10px' }}>
                  <p><strong>Total Consumption:</strong> {powerBreakdownData.powerConsumptionTotal || 0} MW</p>
                  <p><strong>Renewable Percentage:</strong> {powerBreakdownData.renewablePercentage || 0}%</p>
                  <p><strong>Fossil Free Percentage:</strong> {powerBreakdownData.fossilFreePercentage || 0}%</p>
                  <p><strong>Last Updated:</strong> {new Date(powerBreakdownData.datetime).toLocaleString()}</p>
                  <p><strong>Data Status:</strong> {powerBreakdownData.isEstimated ? 'Estimated' : 'Actual'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Carbon Intensity Card */}
          {carbonIntensityData && (
            <div style={cardStyle}>
              <Chart
                options={carbonIntensityOptions}
                series={carbonIntensitySeries}
                type="radialBar"
                height={400}
              />
              <div style={{ marginTop: '20px' }}>
                <p style={{ textAlign: 'center' }}>
                  Current carbon footprint of electricity generation in Western India
                </p>
                <div style={{ marginTop: '10px' }}>
                  <p><strong>Carbon Intensity:</strong> {carbonIntensityData.carbonIntensity} gCO2eq/kWh</p>
                  <p><strong>Last Updated:</strong> {new Date(carbonIntensityData.datetime).toLocaleString()}</p>
                  <p><strong>Data Status:</strong> {carbonIntensityData.isEstimated ? 'Estimated' : 'Actual'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EnergyDashboard;