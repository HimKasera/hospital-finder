// geoLocation.js - Enhanced Geolocation Service

/**
 * Retrieves the current geographic location of the device
 * @returns {Promise<Object>} Promise resolving to location object
 */
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }
      const options = {
        enableHighAccuracy: true, // Prioritize accuracy over speed
        timeout: 15000, // Increased timeout to 15 seconds
        maximumAge: 0 // Force fresh location reading
      };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy, // Meters
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            speed: position.coords.speed, // Meters/second
            heading: position.coords.heading, // Degrees from true north
            timestamp: position.timestamp
          });
        },
        (error) => {
          const errorDetails = {
            code: error.code,
            message: getErrorDescription(error.code),
            permanent: error.PERMISSION_DENIED ? true : false
          };
          reject(errorDetails);
        },
        options
      );
    });
  };
  
  /**
   * Starts watching geographic position changes
   * @param {Function} callback - Success callback
   * @param {Object} options - Configuration options
   * @returns {number} Watch ID
   */
  export const watchLocation = (callback, options = {}) => {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported");
    }
    const defaultOptions = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 10000
    };
    const watchOptions = { ...defaultOptions, ...options };
    return navigator.geolocation.watchPosition(
      (position) => {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          timestamp: position.timestamp
        });
      },
      (error) => {
        throw new Error(`Location watch error: ${getErrorDescription(error.code)}`);
      },
      watchOptions
    );
  };
  
  /**
   * Stops watching geographic position changes
   * @param {number} watchId - ID returned by watchLocation
   */
  export const clearLocationWatch = (watchId) => {
    if (!watchId) return;
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  };
  
  /**
   * Calculates distance between two coordinates (Haversine formula)
   * @param {Object} coord1 - {lat, lng}
   * @param {Object} coord2 - {lat, lng}
   * @returns {number} Distance in kilometers
   */
  export const calculateDistance = (coord1, coord2) => {
    const toRadians = (degree) => degree * (Math.PI / 180);
    const R = 6371; // Earth radius in km
    const dLat = toRadians(coord2.lat - coord1.lat);
    const dLon = toRadians(coord2.lng - coord1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(2)); // 2 decimal places
  };
  
  // Helper function for error descriptions
  const getErrorDescription = (errorCode) => {
    const errors = {
      1: "Location access denied. Please enable permissions in browser settings",
      2: "Location unavailable. Please check your network connection",
      3: "Location request timed out. Try again in better reception area",
      0: "Unknown location error occurred"
    };
    return errors[errorCode] || errors[0];
  };