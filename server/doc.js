const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('.env').config(); // To use GOOGLE_API_KEY from .env

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

app.post('/api/nearby-doctors', async (req, res) => {
    const { lat, lng } = req.body;

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
            {
                params: {
                    location: `${lat},${lng}`,
                    radius: 5000,
                    keyword: 'ayurvedic doctor',
                    type: 'doctor',
                    key: GOOGLE_API_KEY,
                },
            }
        );

        const doctors = response.data.results.map(doc => ({
            name: doc.name,
            address: doc.vicinity,
            rating: doc.rating,
            icon: doc.icon,
        }));

        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching doctor data' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
