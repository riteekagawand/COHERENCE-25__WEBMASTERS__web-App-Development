import React from 'react';
import MapView from './MapView';
import Sidebar from '../components/Sidebar';

const Map = () => {
  return (
    <div>
        <Sidebar />
      <h1 className="text-2xl font-bold text-center my-4">Traffic Map</h1>
      <MapView />
    </div>
  );
};

export default Map;