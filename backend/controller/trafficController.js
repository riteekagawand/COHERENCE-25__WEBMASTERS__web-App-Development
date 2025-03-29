import { promises as fs } from 'fs';
import { fetchRoutesFromTomTom, fetchTrafficIncidents, geocodePlace } from '../services/tomTomService.js';
import { fetchWeather } from '../services/weatherService.js';
import { predictTrafficDelay, detectAnomaly } from '../services/aiService.js';

export const getRoutes = async (req, res, next) => {
  try {
    const { startPlace, endPlace, cityLat, cityLng } = req.query;

    if (!startPlace || !endPlace || !cityLat || !cityLng) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const start = await geocodePlace(startPlace, cityLat, cityLng);
    const end = await geocodePlace(endPlace, cityLat, cityLng);

    if (!start || !end) {
      return res.status(400).json({ error: 'Could not find one or both places' });
    }

    const weather = await fetchWeather(cityLat, cityLng);
    const routeData = await fetchRoutesFromTomTom(start, end);
    if (routeData.length === 0) {
      return res.status(404).json({ error: 'No routes found between these locations' });
    }

    const allPoints = routeData.flatMap(route =>
      route.legs[0].points.map(p => [p.latitude, p.longitude])
    );
    const lats = allPoints.map(p => p[0]);
    const lngs = allPoints.map(p => p[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const boundingBox = `${minLng},${minLat},${maxLng},${maxLat}`;

    const incidents = await fetchTrafficIncidents(boundingBox);

    const currentTime = new Date();
    const timeOfDay = currentTime.getHours();
    const dayOfWeek = currentTime.getDay();
    const formattedRoutes = await Promise.all(
      routeData.map(async (route) => {
        const coords = route.legs[0].points.map(p => [p.latitude, p.longitude]);
        const travelTime = route.summary.travelTimeInSeconds;
        let currentDelay = route.summary.trafficDelayInSeconds || 0;

        let accidents = 0;
        let incidentDescription = 'No incidents';
        incidents.forEach(incident => {
          const incidentCoords = incident.geometry.coordinates;
          const isOnRoute = coords.some(coord =>
            Math.abs(coord[0] - incidentCoords[1]) < 0.01 && Math.abs(coord[1] - incidentCoords[0]) < 0.01
          );
          if (isOnRoute) {
            currentDelay += incident.properties.delayInSeconds || 0;
            accidents += (incident.properties.iconCategory === 'Accident' ? 1 : 0);
            incidentDescription = incident.properties.iconCategory;
          }
        });

        if (weather && (weather.weather === 'Rain' || weather.weather === 'Fog')) {
          currentDelay += 60;
        }

        const concerts = "no";
        const strikes = "no";
        const otherEvents = "none";

        const recentDelays = [currentDelay, currentDelay, currentDelay, currentDelay];
        const predictedDelay = await predictTrafficDelay(
          recentDelays,
          timeOfDay,
          dayOfWeek,
          weather?.weather || 'Clear',
          accidents,
          concerts,
          strikes,
          otherEvents,
          startPlace,
          endPlace
        );

        const combinedDelay = currentDelay * 0.4 + predictedDelay * 0.6;
        const isAnomaly = await detectAnomaly(combinedDelay, timeOfDay, dayOfWeek);

        const logEntry = {
          timestamp: new Date().toISOString(),
          route: { start: startPlace, end: endPlace },
          delay: currentDelay,
          timeOfDay,
          dayOfWeek,
          weather: weather?.weather || 'Clear',
          accidents,
          concerts,
          strikes,
          otherEvents
        };
        await fs.appendFile('traffic_data.json', JSON.stringify(logEntry) + '\n');

        return {
          coords,
          travelTime,
          currentDelay,
          predictedDelay,
          delay: combinedDelay,
          incidentDescription,
          isAnomaly,
        };
      })
    );

    const sortedRoutes = [...formattedRoutes].sort((a, b) => b.delay - a.delay);
    sortedRoutes.forEach((route, index) => {
      if (route.isAnomaly) {
        route.color = 'purple';
      } else if (index === 0) {
        route.color = 'red';
      } else if (index === sortedRoutes.length - 1) {
        route.color = 'green';
      } else {
        route.color = 'blue';
      }
    });

    const optimalIndex = formattedRoutes.reduce((minIdx, route, idx) =>
      route.travelTime < formattedRoutes[minIdx].travelTime ? idx : minIdx, 0);

    res.json({ routes: formattedRoutes, optimalRouteIndex: optimalIndex, startCoords: start, endCoords: end });
  } catch (error) {
    next(error);
  }
};
