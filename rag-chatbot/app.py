from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
from dotenv import load_dotenv

app = FastAPI()

load_dotenv()

origins = [
    "http://localhost:5173",  # React app
    "https://ayurvision.vercel.app"  # Deployment on Vercel
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

port = int(os.getenv('PORT', 5000))

class Location(BaseModel):
    lat: float
    lng: float

@app.get('/')
def hello():
    return "Hello from AyurVision!"
    @app.get("/api/google-maps-key")
    def get_google_maps_key():
        return {"key": os.getenv('GOOGLE_API_KEY')}  # Fetching from environment variables

@app.post("/api/nearby-doctors")
async def get_nearby_doctors(location: Location):
    try:
        params = {
            'location': f'{location.lat},{location.lng}',
            'radius': 5000,
            'keyword': 'ayurvedic doctor',
            'type': 'doctor',
            'key': os.getenv('GOOGLE_API_KEY')
        }

        response = requests.get(
            'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
            params=params
        )

        results = response.json().get('results', [])

        doctors = [
            {
                'name': doc.get('name'),
                'address': doc.get('vicinity'),
                'lat': doc.get('geometry', {}).get('location', {}).get('lat'),
                'lng': doc.get('geometry', {}).get('location', {}).get('lng'),
                'rating': doc.get('rating'),
                'icon': doc.get('icon')
            }
            for doc in results
        ]

        return JSONResponse(content=doctors)

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching doctor data")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="localhost", port=port)