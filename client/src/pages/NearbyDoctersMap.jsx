import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoogleMap from '../Components/GoogleMaps';
import ErrorBoundary from '../Components/ErrorBoundary';

const NearbyDoctorsMap = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

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
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/3 overflow-y-auto p-4">
        {doctors.map((doc, index) => (
          <div
            key={index}
            className="bg-white shadow-xl p-4 rounded-lg mb-4 cursor-pointer"
            onClick={() => setSelectedDoctor(doc)}
          >
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
      <div className="w-full md:w-2/3">
        <ErrorBoundary>
          <GoogleMap doctors={doctors} selectedDoctor={selectedDoctor} />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default NearbyDoctorsMap;