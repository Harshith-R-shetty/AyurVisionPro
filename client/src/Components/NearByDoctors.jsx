import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NearbyDoctors = () => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {doctors.map((doc, index) => (
        <div key={index} className="bg-white shadow-xl p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <img src={doc.icon} alt="icon" className="w-10 h-10" />
            <div>
              <h2 className="text-xl font-bold">{doc.name}</h2>
              <p>{doc.address}</p>
              {doc.rating && <p>⭐ {doc.rating}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NearbyDoctors;
