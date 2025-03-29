const RouteSummary = ({ routes, optimalRouteIndex }) => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Available Routes:</h3>
        <ul className="list-disc pl-5">
          {routes.map((route, index) => (
            <li key={index} style={{ color: route.color }}>
              Route {index + 1}: {Math.round(route.travelTime / 60)} min
              {route.currentDelay > 0 && ` (Current Delay: ${Math.round(route.currentDelay / 60)} min)`}
              {route.predictedDelay > 0 && ` (Predicted Delay: ${Math.round(route.predictedDelay / 60)} min)`}
              {route.incidentDescription !== 'No incidents' && ` (Incident: ${route.incidentDescription})`}
              {route.isAnomaly && ' (Possible Anomaly - Check for Live Events)'}
              {index === optimalRouteIndex && ' - Optimal'}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default RouteSummary;