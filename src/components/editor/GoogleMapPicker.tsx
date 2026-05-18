"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete, Libraries } from '@react-google-maps/api';

const libraries: Libraries = ['places'];

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '12px',
  marginTop: '15px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

interface GoogleMapPickerProps {
  address?: string;
  onLocationSelect: (address: string, lat: number, lng: number, imageUrl?: string) => void;
  apiKey: string;
}

const GoogleMapPicker: React.FC<GoogleMapPickerProps> = ({ address, onLocationSelect, apiKey }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newPos = { lat, lng };
        setMarkerPosition(newPos);
        map?.panTo(newPos);
        map?.setZoom(15);
        
        let imageUrl = undefined;
        if (place.photos && place.photos.length > 0) {
          imageUrl = place.photos[0].getUrl({ maxWidth: 1200, maxHeight: 800 });
        }
        
        onLocationSelect(place.formatted_address || '', lat, lng, imageUrl);
      }
    }
  };

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newPos = { lat, lng };
      setMarkerPosition(newPos);
      
      // Use geocoder to get address from lat/lng
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: newPos }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          onLocationSelect(results[0].formatted_address, lat, lng);
        }
      });
    }
  };

  useEffect(() => {
    if (isLoaded && address && !markerPosition) {
       const geocoder = new google.maps.Geocoder();
       geocoder.geocode({ address }, (results, status) => {
         if (status === 'OK' && results?.[0]) {
           const lat = results[0].geometry.location.lat();
           const lng = results[0].geometry.location.lng();
           setMarkerPosition({ lat, lng });
           map?.panTo({ lat, lng });
           map?.setZoom(15);
         }
       });
    }
  }, [isLoaded, address, map]);

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <Autocomplete
        onLoad={(auto) => setAutocomplete(auto)}
        onPlaceChanged={onPlaceChanged}
      >
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search for a location..."
            defaultValue={address}
            style={{
              boxSizing: `border-box`,
              border: `1px solid #e2e8f0`,
              width: `100%`,
              height: `40px`,
              padding: `0 12px 0 35px`,
              borderRadius: `8px`,
              outline: `none`,
              fontSize: `14px`,
              marginBottom: '10px'
            }}
          />
          <i className="fa-solid fa-location-dot" style={{ position: 'absolute', left: '12px', top: '13px', color: '#94a3b8', fontSize: '14px' }}></i>
        </div>
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition || center}
        zoom={markerPosition ? 15 : 2}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapPicker;
