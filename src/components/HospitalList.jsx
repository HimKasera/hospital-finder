const searchHospitals = async (location) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=hospital&format=json&limit=10&lat=${location.lat}&lon=${location.lng}`
      );
      
      return response.data.map(hospital => ({
        name: hospital.display_name,
        lat: parseFloat(hospital.lat),
        lng: parseFloat(hospital.lon)
      }));
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      return [];
    }
  };