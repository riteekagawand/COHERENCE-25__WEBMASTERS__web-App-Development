import { useState } from "react";
import ApexCharts from "react-apexcharts";
import Sidebar from '../components/Sidebar';
import travelData from "../assets/travelData.json"; // Import the JSON file

const CarbonFootprintCalculator = () => {
  const [fromLocation, setFromLocation] = useState("Virar"); // Default to Virar
  const [toLocation, setToLocation] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [timeUnit, setTimeUnit] = useState("minutes");
  const [modeOfTravel, setModeOfTravel] = useState("");
  const [carbonFootprint, setCarbonFootprint] = useState(0);

  const tips = [
    "Opt for public transport or carpooling to cut emissions.",
    "Switch to electric or hybrid vehicles for greener travel.",
    "Lower your home's energy use with efficient appliances.",
    "Choose a plant-based diet to reduce food-related emissions.",
    "Recycle and reuse to minimize waste and emissions.",
  ];

  const emissionRates = {
    car: 0.00333,
    bus: 0.00167,
    train: 0.00083,
    bicycle: 0,
    walking: 0,
    airplane: 0.00417,
    boat: 0.0025,
    ship: 0.001,
    helicopter: 0.00833,
  };

  const travelModes = ["car", "bus", "train", "bicycle", "walking", "airplane", "boat", "ship", "helicopter"];
  const timeUnits = ["minutes", "hours", "days"];
  const cities = [
    "Ahmedabad", "Bengaluru", "Chennai", "Coimbatore", "Delhi", "Ghaziabad",
    "Hyderabad", "Indore", "Jaipur", "Kanpur", "Kochi", "Kolkata", "Kozhikode",
    "Lucknow", "Mumbai", "Nagpur", "Patna", "Pune", "Surat"
  ];

  const convertTimeToMinutes = (value, unit) => {
    const numValue = parseFloat(value) || 0;
    switch (unit) {
      case "hours": return numValue * 60;
      case "days": return numValue * 1440;
      case "minutes":
      default: return numValue;
    }
  };

  const calculateCarbonFootprint = () => {
    if (!modeOfTravel) {
      alert("Please select a mode of travel.");
      return;
    }
    if (!toLocation) {
      alert("Please select a destination.");
      return;
    }

    const data = travelData.travelData[fromLocation][toLocation];
    const distanceInKm = data ? data.distance : 0; // Fetch distance from JSON
    const timeInMinutes = convertTimeToMinutes(timeValue, timeUnit);
    const emissionRate = emissionRates[modeOfTravel] || 0;

    const carbonEmissions = emissionRate * distanceInKm * timeInMinutes;
    setCarbonFootprint(carbonEmissions.toFixed(2));
  };

  const getDistance = () => {
    if (!toLocation || !travelData.travelData[fromLocation][toLocation]) return 0;
    return travelData.travelData[fromLocation][toLocation].distance;
  };

  const maxCarbonFootprint = 1000;
  const carbonFootprintPercentage = Math.min((carbonFootprint / maxCarbonFootprint) * 100, 100);

  const chartData = {
    series: [carbonFootprintPercentage],
    options: {
      chart: { type: "radialBar" },
      plotOptions: {
        radialBar: {
          startAngle: 0,
          endAngle: 360,
          hollow: { size: "70%", background: "#f8fafc" },
          track: { background: "#e5e7eb", strokeWidth: "100%" },
          dataLabels: {
            show: true,
            name: { show: true, fontSize: "18px", fontFamily: "Inter, sans-serif", color: "#6b7280", offsetY: 30, formatter: () => "Carbon Footprint" },
            value: { show: true, fontSize: "28px", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#1f2937", offsetY: -10, formatter: () => `${carbonFootprint} g` },
          },
        },
      },
      stroke: { lineCap: "round" },
      fill: { type: "gradient", gradient: { shade: "light", type: "horizontal", shadeIntensity: 0.5, gradientToColors: ["#10b981"], inverseColors: false, opacityFrom: 1, opacityTo: 1, stops: [0, 100], colorStops: [{ offset: 0, color: "#34d399", opacity: 1 }, { offset: 100, color: "#10b981", opacity: 1 }] } },
      labels: ["Carbon Footprint"],
    },
  };

  const sparklineData = () => {
    if (!toLocation || !travelData.travelData[fromLocation][toLocation]) return { series: [], options: {} };
    const data = travelData.travelData[fromLocation][toLocation];
    const times = travelModes.map(mode => data[mode] || 0).filter(time => time > 0); // Exclude null values
    return {
      series: [{ name: "Travel Time (min)", data: times }],
      options: {
        chart: { type: "line", sparkline: { enabled: true } },
        stroke: { curve: "smooth", width: 2 },
        colors: ["#10b981"],
        tooltip: { x: { show: false }, y: { formatter: val => `${val} min` } },
      },
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2e9] to-[#c7e9b0] p-4 flex items-start justify-center">
        <Sidebar />
      <div className="w-64 bg-white shadow-lg h-screen fixed top-0 left-0">
        
      </div>
      <div className="w-full max-w-5xl p-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center font-sans tracking-tight">
          Carbon Footprint Calculator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fromLocation" className="block text-sm font-medium text-gray-700 mb-1">From Location</label>
            <input
              id="fromLocation"
              type="text"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter departure location (default: Virar)"
              disabled // Fixed to Virar
            />
          </div>

          <div>
            <label htmlFor="toLocation" className="block text-sm font-medium text-gray-700 mb-1">To Location</label>
            <select
              id="toLocation"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
            >
              <option value="" disabled>Select a destination</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="modeOfTravel" className="block text-sm font-medium text-gray-700 mb-1">Mode of Travel</label>
            <select
              id="modeOfTravel"
              value={modeOfTravel}
              onChange={(e) => setModeOfTravel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
            >
              <option value="" disabled>Select a mode of travel</option>
              {travelModes.map(mode => (
                <option key={mode} value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Taken (approx)</label>
            <div className="flex gap-3">
              <input
                id="timeValue"
                type="number"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                className="w-2/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Enter time"
                min="0"
                step="0.1"
              />
              <select
                id="timeUnit"
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value)}
                className="w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
              >
                {timeUnits.map(unit => (
                  <option key={unit} value={unit}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={calculateCarbonFootprint}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
          >
            Calculate Carbon Footprint
          </button>
        </div>

        {carbonFootprint > 0 && (
          <div className="mt-8 bg-gray-50 rounded-2xl p-8 shadow-inner">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center font-sans tracking-tight">
              Your Carbon Footprint For <span className="text-emerald-600">{fromLocation || "Unknown"}</span> to <span className="text-emerald-600">{toLocation || "Unknown"}</span> is:
            </h3>
            <div className="flex justify-center items-center gap-8 mb-8">
              <div className="text-center">
                <ApexCharts options={chartData.options} series={chartData.series} type="radialBar" height={320} width={320} />
                <p className="text-gray-500 mt-2 text-sm uppercase tracking-wide">Gradient Circle Chart</p>
              </div>
              <div className="text-center">
                <p className="text-gray-700 text-sm font-medium mb-2">Distance Travelled: {getDistance()} km</p>
                <ApexCharts options={sparklineData().options} series={sparklineData().series} type="line" height={100} width={200} />
                <p className="text-gray-500 mt-2 text-sm uppercase tracking-wide">Travel Time Sparkline</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Tips to Reduce Your Carbon Footprint</h4>
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span className="text-gray-700 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarbonFootprintCalculator;