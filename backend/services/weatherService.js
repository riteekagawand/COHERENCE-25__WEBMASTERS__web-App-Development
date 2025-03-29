import axios from 'axios';

export const fetchWeather = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat,
          lon: lng,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric',
        },
      }
    );
    return {
      weather: response.data.weather[0].main,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};
