import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';

const MapContainer = ({ location, hospitals, searchQuery = '' }) => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const mapStyles = {
    height: "70vh",
    width: "100%"
  };

  // Filter hospitals based on search query
  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Custom marker icons
  const userIcon = {
    path: window.google?.maps.SymbolPath.CIRCLE,
    fillColor: "#4285F4",
    fillOpacity: 1,
    scale: 8,
    strokeColor: "#FFFFFF",
    strokeWeight: 2
  };

  const hospitalIcon = {
    path: window.google?.maps.SymbolPath.CIRCLE,
    fillColor: "#EA4335",
    fillOpacity: 1,
    scale: 6,
    strokeColor: "#FFFFFF",
    strokeWeight: 2
  };

  return (
    <Box position="relative">
      {!mapLoaded && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(255,255,255,0.7)"
          zIndex={1}
        >
          <CircularProgress />
          <Typography variant="body2" ml={2}>
            Loading Map...
          </Typography>
        </Box>
      )}

      <LoadScript
       googleMapsApiKey="AIzaSyDOzBpaWX0qwnqf8vLrhtuZGdtE9Tqpszo"
        libraries={['places']}
        onLoad={() => setMapLoaded(true)}
        onError={() => console.error("Error loading Google Maps")}
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={location}
          options={{
            streetViewControl: false,
            mapTypeControlOptions: {
              position: window.google?.maps.ControlPosition.TOP_RIGHT
            }
          }}
        >
          {/* User Location Marker */}
          {location && (
            <Marker
              position={location}
              icon={userIcon}
              title="Your Current Location"
            />
          )}

          {/* Hospital Markers */}
          {filteredHospitals.map((hospital, index) => (
            <Marker
              key={`hospital-${index}`}
              position={{ lat: hospital.lat, lng: hospital.lng }}
              icon={hospitalIcon}
              onClick={() => setSelectedHospital(hospital)}
            >
              {selectedHospital?.name === hospital.name && (
                <InfoWindow
                  onCloseClick={() => setSelectedHospital(null)}
                  position={{ lat: hospital.lat, lng: hospital.lng }}
                >
                  <Box p={1} minWidth={200}>
                    <Typography variant="subtitle1" color="primary">
                      🏥 {hospital.name}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      {hospital.address || 'Address not available'}
                    </Typography>
                    {hospital.distance && (
                      <Typography variant="caption" display="block" mt={1}>
                        {hospital.distance} km away
                      </Typography>
                    )}
                  </Box>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default MapContainer;