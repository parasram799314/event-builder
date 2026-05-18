"use client";

import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Libraries } from '@react-google-maps/api';

const libraries: Libraries = ['places'];

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '200px'
};

interface GoogleMapDisplayProps {
  address?: string;
  lat?: number;
  lng?: number;
  apiKey: string;
}

const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ address, lat, lng, apiKey }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries
  });

  const [markerPosition, setMarkerPosition] = React.useState<google.maps.LatLngLiteral | null>(null);

  React.useEffect(() => {
    if (isLoaded) {
      if (lat && lng) {
        setMarkerPosition({ lat, lng });
      } else if (address) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            setMarkerPosition({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            });
          }
        });
      }
    }
  }, [isLoaded, address, lat, lng]);

  if (!isLoaded) return <div style={{ height: '250px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>;
  if (!markerPosition) return null;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPosition}
      zoom={15}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      <Marker position={markerPosition} />
    </GoogleMap>
  );
};

export default GoogleMapDisplay;
