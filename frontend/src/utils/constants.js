export const cities = [
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
    { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
    { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Indore', lat: 22.7196, lng: 75.8577 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
    { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Kozhikode', lat: 11.2588, lng: 75.7804 },
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
    { name: 'Patna', lat: 25.5941, lng: 85.1376 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Surat', lat: 21.1702, lng: 72.8311 },
  ];
  
  export const getCategoryForUtility = (utilityType) => {
    switch (utilityType) {
      case 'hospitals': return 'hospital';
      case 'medical_stores': return 'pharmacy';
      case 'fire_stations': return 'fire station';
      case 'ev_charging': return 'electric vehicle station';
      default: return '';
    }
  };