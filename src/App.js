import { useEffect, useState } from 'react';
import { signInWithGoogle, auth } from './services/firebase';
import { getCurrentLocation } from './services/geoLocation';
import Map from './components/Map';
import { 
  Button, 
  CircularProgress, 
  Container, 
  Typography, 
  TextField,
  Grid,
  Alert,
  Card,
  CardContent,
  Chip,
  Box,
  InputAdornment
} from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function App() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) fetchLocationAndHospitals();
    });
    return () => unsubscribe();
  }, [fetchLocationAndHospitals]);

  const fetchLocationAndHospitals = async (customLocation) => {
    try {
      setLoading(true);
      setError('');
      setSelectedHospital(null);

      let position = location;
      if (!customLocation) {
        position = await getCurrentLocation();
        setLocation(position);
      }

      const hospitals = await searchHospitals(customLocation || position);
      setHospitals(hospitals);

    } catch (err) {
      setError(err.message || "Failed to get location or hospitals");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchHospitals = async (position) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: searchQuery || 'hospital',
            format: 'json',
            lat: position.lat,
            lon: position.lng,
            viewbox: [
              position.lng - 0.1, 
              position.lat - 0.1, 
              position.lng + 0.1, 
              position.lat + 0.1
            ].join(','),
            bounded: 1,
            addressdetails: 1,
            limit: 15
          }
        }
      );

      if (!response.data?.length) {
        throw new Error('No hospitals found in this area');
      }

      return response.data.map(hospital => ({
        name: hospital.display_name.split(',')[0] || 'Hospital',
        address: hospital.display_name,
        lat: parseFloat(hospital.lat),
        lng: parseFloat(hospital.lon),
        distance: calculateDistance(
          position.lat, 
          position.lng, 
          hospital.lat, 
          hospital.lon
        )
      }));
    } catch (error) {
      console.error("Hospital search failed:", error);
      throw error;
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: searchQuery,
            format: 'json',
            addressdetails: 1,
            limit: 1
          }
        }
      );

      if (response.data?.[0]) {
        const newLocation = {
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon)
        };
        setLocation(newLocation);
        fetchLocationAndHospitals(newLocation);
      }
    } catch (error) {
      setError('Invalid location entered');
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error("Authentication Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="xs" sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <Box sx={{ 
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: 3,
          textAlign: 'center'
        }}>
          <MedicalServicesIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Hospital Locator
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Find nearby medical facilities quickly
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 50,
              textTransform: 'none',
              fontSize: 16
            }}
          >
            Continue with Google
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ height: '100vh' }}>
      <Box sx={{ 
        p: 3,
        bgcolor: 'background.paper',
        boxShadow: 1,
        display: 'flex',
        gap: 2,
        alignItems: 'center'
      }}>
        <MedicalServicesIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search hospitals or locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <Button 
                variant="contained" 
                color="primary"
                sx={{ borderRadius: 30, px: 3 }}
                onClick={handleManualSearch}
              >
                Search
              </Button>
            ),
            sx: { borderRadius: 30, paddingLeft: 2 }
          }}
        />
        <Chip
          icon={<LocationOnIcon />}
          label={location ? "Live Location" : "Manual Location"}
          color={location ? "success" : "warning"}
          sx={{ minWidth: 160 }}
        />
      </Box>

      <Grid container sx={{ height: 'calc(100vh - 100px)' }}>
        <Grid item xs={12} md={4} sx={{ 
          p: 3,
          borderRight: 1,
          borderColor: 'divider',
          overflowY: 'auto'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
            Nearby Hospitals
          </Typography>
          {hospitals.map((hospital, index) => (
            <Card 
              key={index} 
              sx={{ 
                mb: 2,
                transition: '0.3s',
                cursor: 'pointer',
                border: selectedHospital?.name === hospital.name ? '2px solid' : 'none',
                borderColor: 'primary.main',
                '&:hover': { transform: 'translateX(5px)' }
              }}
              onClick={() => setSelectedHospital(hospital)}
            >
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {hospital.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <LocationOnIcon fontSize="small" /> 
                  {hospital.address.substring(0, 50)}...
                </Typography>
                {hospital.distance && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {hospital.distance} km away
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={8}>
          {location ? (
            <Map 
              location={location} 
              hospitals={hospitals} 
              selectedHospital={selectedHospital}
              onSelectHospital={setSelectedHospital}
            />
          ) : (
            <Box sx={{ 
              display: 'flex', 
              height: '100%', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <CircularProgress />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
