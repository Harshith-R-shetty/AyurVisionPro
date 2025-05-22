import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoogleMap from '../Components/GoogleMaps';

const NearbyDoctorsMap = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await axios.post('http://localhost:5000/api/nearby-doctors', {
          lat: latitude,
          lng: longitude,
        });

        setDoctors(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  if (loading) return <div>Loading nearby doctors...</div>;

  return (
    <div className="h-screen">
      <GoogleMap doctors={doctors} />
    </div>
  );
};

export default NearbyDoctorsMap;