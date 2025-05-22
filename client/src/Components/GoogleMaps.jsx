import React, { useEffect, useRef } from 'react';

const GoogleMap = ({ doctors }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: doctors[0]?.lat || 0, lng: doctors[0]?.lng || 0 },
        zoom: 12,
      });

      doctors.forEach(doc => {
        new window.google.maps.Marker({
          position: { lat: doc.lat, lng: doc.lng },
          map,
          title: doc.name,
        });
      });
    };

    if (doctors.length > 0) {
      loadMap();
    }
  }, [doctors]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};

export default GoogleMap;