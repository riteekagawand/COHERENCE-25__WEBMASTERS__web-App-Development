import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { getIconForUtility } from '../utils/icons'; // Ensure correct path
import { getRoutes } from '../api/api'; // Ensure correct path

const UtilityMarker = ({ utility }) => {
  const [details, setDetails] = useState(null);

  const handleClick = async () => {
    try {
      const data = await getRoutes(utility.id);
      setDetails(data);
    } catch (error) {
      console.error('Error fetching utility details:', error);
    }
  };

  return (
    <Marker position={[utility.lat, utility.lng]} icon={getIconForUtility(utility.type)} onClick={handleClick}>
      <Popup>
        {details ? (
          <>
            <h3>{details.name}</h3>
            <p><strong>Address:</strong> {details.address}</p>
            <p><strong>Contact:</strong> {details.contact}</p>
            <p><strong>Open Hours:</strong> {details.openHours}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Popup>
    </Marker>
  );
};

export default UtilityMarker;
