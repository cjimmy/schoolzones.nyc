'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import CSS here as well to be safe
import LocationFinder from './components/LocationFinder';

const zoneStyle = {
  fillColor: '#3388ff',
  weight: 1.8,
  opacity: 0.5,
  color: '#555',
  fillOpacity: 0.3,
  dashArray: '',
};

const zoneStyleOnMouseOver = {
  fillOpacity: 0.4,
  weight: 2.5,
};

// Component to add labels after the map is ready
function FeatureLabels({ data }: { data: GeoJSON.FeatureCollection }) {
  const map = useMap();
  
  useEffect(() => {
    if (!data) return;
    // Add labels for each feature
    data.features.forEach((feature: GeoJSON.Feature) => {
      if (feature.properties && feature.properties.label) {
        // Create a temporary layer to get the bounds
        const layer = L.geoJSON(feature);
        const center = layer.getBounds().getCenter();
        // Create the label
        L.marker(center, {
          icon: L.divIcon({
            className: 'label-icon',
            html: `<div>${feature.properties.label}</div>`,
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
  // Downtown Manhattan coordinates
  const initialPosition: [number, number] = [40.7128, -74.0060];

  useEffect(() => {
    fetch('./elem-school-zones-with-names.geojson')
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
  }, []);

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    let popup: L.Popup | null = null;
    
    // Prepare popup content
    if (feature.properties) {
      const popupContent = [];
      
      if (feature.properties.name) {
        popupContent.push(`<strong>${feature.properties.name}</strong>`);
      }
      
      if (feature.properties.remarks && feature.properties.remarks !== "null") {
        popupContent.push(`<div>Remarks: ${feature.properties.remarks}</div>`);
      }
      
      if (popupContent.length > 0) {
        // Create popup but don't bind it yet
        popup = L.popup({
          closeButton: false,
          offset: L.point(0, -10),
          className: 'hover-popup'
        }).setContent(popupContent.join('<br>'));
      }
    }
    
    // Hover effects
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          ...zoneStyle,
          ...zoneStyleOnMouseOver
        });
        
        // Show popup if we have one
        if (popup) {
          popup.setLatLng(e.latlng).openOn(e.target._map);
        }
      },
      mousemove: (e) => {
        // Move popup with cursor
        if (popup && popup.isOpen()) {
          popup.setLatLng(e.latlng);
        }
      },
      mouseout: (e) => {
        e.target.setStyle(zoneStyle);
        
        // Close popup
        if (popup) {
          e.target._map.closePopup(popup);
        }
      },
    });
  };

  return (
    <>
      <MapContainer 
        center={initialPosition} 
        zoom={14} 
        style={{ height: 'calc(100% - 48px)', width: '100%', marginTop: '48px' }}
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
          url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`}
          attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`}
        />
        <LocationFinder />
        {geoJsonData && (
          <>
            <GeoJSON 
              data={geoJsonData} 
              onEachFeature={onEachFeature}
              style={zoneStyle}
            />
            <FeatureLabels data={geoJsonData} />
          </>
        )}
      </MapContainer>
    </>
  );
}
