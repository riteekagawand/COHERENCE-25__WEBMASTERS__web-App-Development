import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
});
export const getRoutes = async (startPlace, endPlace, cityLat, cityLng) => {
  const response = await api.get('/api/traffic/route', {
    params: {
      startPlace,
      endPlace,
      cityLat,
      cityLng,
    },
  });
  return response.data;
};


export const getUtilities = async (category, lat, lng) => {
  const response = await api.get('/api/utilities', {
    params: { category, lat, lng },
  });
  return response.data;
};
