
// Function to geocode an address using OpenStreetMap's Nominatim API
export const geocodeAddress = async (address: string): Promise<{ 
  lat: number; 
  lng: number; 
  latitude: number; 
  longitude: number;
  found: boolean;
}> => {
  if (!address || address.trim().length < 3) {
    console.log("Address too short to geocode:", address);
    return { 
      lat: 0, 
      lng: 0, 
      latitude: 0, 
      longitude: 0, 
      found: false 
    };
  }

  try {
    console.log("Geocoding address:", address);
    
    // Encode address properly for URL
    const encodedAddress = encodeURIComponent(address);
    
    // Use OpenStreetMap's Nominatim API
    // Note: We're setting a custom User-Agent to be respectful of OSM's ToS
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;
    
    console.log("Geocoding URL:", url);
    
    const response = await fetch(url, {
      headers: {
        // Set a proper user agent as per Nominatim usage policy
        'User-Agent': 'InventoryManagementApp/1.0'
      }
    });
    
    if (!response.ok) {
      console.error("Geocoding API error:", response.status, response.statusText);
      return { 
        lat: 0, 
        lng: 0, 
        latitude: 0, 
        longitude: 0, 
        found: false 
      };
    }
    
    const data = await response.json();
    console.log("Geocoding API response:", data);
    
    if (data && data.length > 0) {
      const location = data[0];
      console.log("Found location:", location);
      const lat = parseFloat(location.lat);
      const lng = parseFloat(location.lon);
      return {
        lat,
        lng,
        latitude: lat,
        longitude: lng,
        found: true
      };
    } else {
      console.log("No location found for address:", address);
      return { 
        lat: 0, 
        lng: 0, 
        latitude: 0, 
        longitude: 0, 
        found: false 
      };
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return { 
      lat: 0, 
      lng: 0, 
      latitude: 0, 
      longitude: 0, 
      found: false 
    };
  }
};

// Function to reverse geocode coordinates (lat/lng) to get a physical address
export const reverseGeocode = async (lat: number, lng: number): Promise<{ 
  address: string | null; 
  found: boolean;
}> => {
  try {
    console.log("Reverse geocoding coordinates:", lat, lng);
    
    // Use OpenStreetMap's Nominatim API for reverse geocoding
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    
    console.log("Reverse geocoding URL:", url);
    
    const response = await fetch(url, {
      headers: {
        // Set a proper user agent as per Nominatim usage policy
        'User-Agent': 'InventoryManagementApp/1.0'
      }
    });
    
    if (!response.ok) {
      console.error("Reverse geocoding API error:", response.status, response.statusText);
      return { address: null, found: false };
    }
    
    const data = await response.json();
    console.log("Reverse geocoding API response:", data);
    
    if (data && data.display_name) {
      console.log("Found address:", data.display_name);
      return { address: data.display_name, found: true };
    } else {
      console.log("No address found for coordinates:", lat, lng);
      return { address: null, found: false };
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return { address: null, found: false };
  }
};

// Debounce function to prevent too many API calls
export const debounce = (fn: Function, ms = 500) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
