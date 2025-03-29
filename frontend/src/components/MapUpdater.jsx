import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export default MapUpdater;