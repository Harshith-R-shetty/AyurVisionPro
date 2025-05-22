import React, { useEffect, useRef, useState } from 'react';

const GoogleMap = ({ doctors, selectedDoctor }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google && !document.querySelector('script[src*="maps.googleapis.com"]')) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBwJRONoDXYDkluF0nnlS888KXcyy1QCwc&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google) {
            initializeMap();
          } else {
            console.error('Google Maps API failed to load.');
          }
        };
        document.body.appendChild(script);
      } else if (window.google) {
        initializeMap();
      }
    };

    const initializeMap = () => {
      const initialMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: doctors[0]?.lat || 0, lng: doctors[0]?.lng || 0 },
        zoom: 12,
      });
      setMap(initialMap);

      doctors.forEach(doc => {
        new window.google.maps.Marker({
          position: { lat: doc.lat, lng: doc.lng },
          map: initialMap,
          title: doc.name,
        });
      });
    };

    loadGoogleMapsScript();
  }, [doctors]);

  useEffect(() => {
    if (map && selectedDoctor) {
      map.setCenter({ lat: selectedDoctor.lat, lng: selectedDoctor.lng });
      map.setZoom(15);
    }
  }, [map, selectedDoctor]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default GoogleMap;