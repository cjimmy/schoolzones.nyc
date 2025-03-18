'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import CSS here as well to be safe
import LocationFinder from './components/LocationFinder';
import InfoModal from './components/InfoModal';

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

export default function Map() {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    // Fix Leaflet's default icon loading in React - see https://github.com/Leaflet/Leaflet/issues/4968
    // Webpack interferes with Leaflet's default icon loading, so we need to reset and specify URLs manually
    delete (L.Icon.Default.prototype as ExtendedIconPrototype)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Auto-open modal after 3 seconds
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
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
    <>
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

      {/* Info Button */}
      <button
        onClick={() => setIsModalOpen(prev => !prev)}
        className="fixed bottom-4 right-4 z-[400] bg-gray-900 rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer"
        aria-label="Information"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <InfoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
