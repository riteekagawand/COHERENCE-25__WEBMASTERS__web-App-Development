import L from 'leaflet';

export const hospitalIcon = L.divIcon({
  html: '<i class="fas fa-hospital text-blue-500 text-2xl"></i>',
  iconSize: [30, 30],
  className: 'custom-icon',
});

export const medicalStoreIcon = L.divIcon({
  html: '<i class="fas fa-first-aid text-teal-600 text-2xl"></i>',
  iconSize: [30, 30],
  className: 'custom-icon',
});



export const fireStationIcon = L.divIcon({
  html: '<i class="fas fa-fire-extinguisher text-red-900 text-2xl"></i>',
  iconSize: [30, 30],
  className: 'custom-icon',
});


export const evChargingIcon = L.divIcon({
  html: '<i class="fas fa-charging-station text-green-900 text-2xl"></i>',
  iconSize: [30, 30],
  className: 'custom-icon',
});

// New police station icon (brown)
export const policeStationIcon = L.divIcon({
  html: '<i class="fas fa-shield-alt text-brown-500 text-2xl"></i>',
  iconSize: [30, 30],
  className: 'custom-icon',
});

export const getIconForUtility = (utilityType) => {
  switch (utilityType) {
    case 'hospitals':
      return hospitalIcon;
    case 'medical_stores':
      return medicalStoreIcon;
    case 'fire_stations':
      return fireStationIcon;
    case 'ev_charging':
      return evChargingIcon;
    case 'police_stations':
      return policeStationIcon; // Added police stations
    default:
      return null;
  }
};