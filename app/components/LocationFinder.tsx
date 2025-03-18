'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// Component to handle user location
export default function LocationFinder() {
  const map = useMap();
  
  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Center map on user location
          map.flyTo([latitude, longitude], 14, {
            duration: 1.5,
            animate: true
          });
          
          // Add a marker at user's location
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'user-location-icon',
              html: '<div>📍</div>',
              iconSize: [30, 30],
              iconAnchor: [15, 30]
            })
          }).addTo(map)
            .bindPopup('Your location')
            .openPopup();
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [map]);
  
  return null;
} 