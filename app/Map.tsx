'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import CSS here as well to be safe


// Component to add labels after the map is ready
function FeatureLabels({ data }: { data: GeoJSON.FeatureCollection }) {
  const map = useMap();
  
  useEffect(() => {
    if (!data) return;
    // Add labels for each feature
    data.features.forEach((feature: GeoJSON.Feature) => {
      if (feature.properties && feature.properties.Label) {
        // Create a temporary layer to get the bounds
        const layer = L.geoJSON(feature);
        const center = layer.getBounds().getCenter();
        // Create the label
        L.marker(center, {
          icon: L.divIcon({
            className: 'label-icon',
            html: `<div>${feature.properties.Label}</div>`,
            iconSize: [100, 20],
            iconAnchor: [50, 10]
          })
        }).addTo(map);
      }
    });
  }, [data, map]);
  
  return null;
}

// Component to handle user location
function LocationFinder() {
  const map = useMap();
  
  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Center map on user location
          map.setView([latitude, longitude], 14);
          
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

export default function Map() {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null);
  // Downtown Manhattan coordinates
  const initialPosition: [number, number] = [40.7128, -74.0060];

  useEffect(() => {
    fetch('./data.geojson')
      .then(response => response.json())
      .then(data => setGeoJsonData(data));
      
    // Fix Leaflet's default icon path issues
    interface ExtendedIconPrototype extends L.Icon.Default {
      _getIconUrl?: () => string;
    }

    delete (L.Icon.Default.prototype as ExtendedIconPrototype)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    // Popup with properties
    if (feature.properties) {
      // Check if REMARKS exists and is not null
      if (feature.properties.REMARKS && feature.properties.REMARKS !== "null") {
        // Only show REMARKS in the popup
        layer.bindPopup(`<strong>Remarks:</strong> ${feature.properties.REMARKS}`);
      }
    }
    
    // Hover effects
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.7,
          weight: 2,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.5,
          weight: 1,
        });
      },
    });
  };

  const style = {
    fillColor: '#3388ff',
    weight: 1,
    opacity: 1,
    color: '#666',
    fillOpacity: 0.5,
  };

  return (
    <MapContainer 
      center={initialPosition} 
      zoom={14} 
      style={{ height: '100%', width: '100%' }}
      // Add these props to ensure proper rendering
      scrollWheelZoom={true}
      zoomControl={true}
      attributionControl={true}
      whenReady={() => {
        // Force a resize event after map is loaded
        window.dispatchEvent(new Event('resize'));
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationFinder />
      {geoJsonData && (
        <>
          <GeoJSON 
            data={geoJsonData} 
            onEachFeature={onEachFeature}
            style={style}
          />
          <FeatureLabels data={geoJsonData} />
        </>
      )}
    </MapContainer>
  );
}
