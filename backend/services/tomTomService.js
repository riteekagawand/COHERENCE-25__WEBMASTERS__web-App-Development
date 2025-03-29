import axios from 'axios';
import { promises as fs } from 'fs';

export const fetchRoutesFromTomTom = async (start, end) => {
  const response = await axios.get(
    `https://api.tomtom.com/routing/1/calculateRoute/${start[0]},${start[1]}:${end[0]},${end[1]}/json`,
    {
      params: {
        key: process.env.TOMTOM_API_KEY,
        routeType: 'fastest',
        traffic: true,
        maxAlternatives: 2,
        computeTravelTimeFor: 'all',
      },
    }
  );
  return response.data.routes || [];
};

export const fetchTrafficIncidents = async (boundingBox) => {
  try {
    const response = await axios.get(
      `https://api.tomtom.com/traffic/services/4/incidentDetails`,
      {
        params: {
          key: process.env.TOMTOM_API_KEY,
          bbox: boundingBox,
          fields: '{incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,delayInSeconds}}}',
        },
      }
    );
    return response.data.incidents || [];
  } catch (error) {
    console.error('Error fetching traffic incidents:', error);
    return [];
  }
};

export const geocodePlace = async (placeName, cityLat, cityLng) => {
  if (!placeName) return null;
  try {
    const response = await axios.get(
      `https://api.tomtom.com/search/2/search/${encodeURIComponent(placeName)}.json`,
      {
        params: {
          key: process.env.TOMTOM_API_KEY,
          lat: cityLat,
          lon: cityLng,
          radius: 10000,
          limit: 1,
        },
      }
    );
    const result = response.data.results[0];
    if (result && result.position) {
      return [result.position.lat, result.position.lon];
    }
    return null;
  } catch (error) {
    console.error(`Error geocoding ${placeName}:`, error);
    return null;
  }
};

export const fetchUtilityLocations = async (category, lat, lng) => {
  try {
    const response = await axios.get(
      `https://api.tomtom.com/search/2/categorySearch/${encodeURIComponent(category)}.json`,
      {
        params: {
          key: process.env.TOMTOM_API_KEY,
          lat,
          lon: lng,
          radius: 10000,
          limit: 20,
        },
      }
    );
    const places = response.data.results || [];
    return places
      .filter((place) => place.position)
      .map((place) => ({
        lat: place.position.lat,
        lng: place.position.lon,
        name: place.poi?.name || 'Unknown',
      }));
  } catch (error) {
    console.error(`Error fetching utilities:`, error);
    throw error;
  }
};
