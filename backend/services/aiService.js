const axios = require('axios');

const predictTrafficDelay = async (recentDelays, timeOfDay, dayOfWeek, weather, accidents, concerts, strikes, otherEvents, start, end) => {
  try {
    const response = await axios.post(`${process.env.AI_API_URL}/predict-delay`, {
      recentDelays,
      timeOfDay,
      dayOfWeek,
      weather,
      accidents,
      concerts,
      strikes,
      otherEvents,
      start,
      end
    });
    return response.data.predictedDelay;
  } catch (error) {
    console.error('Error predicting traffic delay:', error);
    return 0;
  }
};

const detectAnomaly = async (delay, hour, dayOfWeek) => {
  try {
    const response = await axios.post(`${process.env.AI_API_URL}/detect-anomaly`, {
      delay,
      hour,
      dayOfWeek,
    });
    return response.data.isAnomaly;
  } catch (error) {
    console.error('Error detecting anomaly:', error);
    return false;
  }
};

module.exports = { predictTrafficDelay, detectAnomaly };