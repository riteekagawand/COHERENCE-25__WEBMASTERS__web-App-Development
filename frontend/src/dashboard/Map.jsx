import React from 'react';
import MapView from '../dashboard/MapView';
import Sidebar from '@/components/Sidebar';

const Map = () => {
  return (
    <div className="bg-[#d1ebc9] min-h-screen w-full flex flex-col">
      <Sidebar />
      <h1 className="text-2xl font-bold text-center my-4">Traffic Map</h1>
      <MapView />
    </div>
  );
};

export default Map;