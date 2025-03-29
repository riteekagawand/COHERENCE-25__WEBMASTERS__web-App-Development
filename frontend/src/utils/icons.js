import L from 'leaflet';

export const hospitalIcon = L.divIcon({
  html: '<i class="fas fa-hospital text-red-500 text-2xl"></i>',
  iconSize: [30, 30],
  className: 'custom-icon',
});

export const medicalStoreIcon = L.divIcon({
  html: '<i class="fas fa-prescription-bottle-alt text-green-500 text-2xl"></i>',
  iconSize: [30, 30],
  className: 'custom-icon',
});

export const fireStationIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1442/1442915.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export const evChargingIcon = L.divIcon({
  html: '<i class="fas fa-charging-station text-blue-500 text-2xl"></i>',
  iconSize: [30, 30],
  className: 'custom-icon',
});

export const getIconForUtility = (utilityType) => {
  switch (utilityType) {
    case 'hospitals': return hospitalIcon;
    case 'medical_stores': return medicalStoreIcon;
    case 'fire_stations': return fireStationIcon;
    case 'ev_charging': return evChargingIcon;
    default: return null;
  }
};