import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config();

const GMAP_API = process.env.GMAP_API; 
const locationRouter = express.Router()


locationRouter.get('/', async (req, res) => {
  const { lat, lng, type } = req.query;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${type}&key=${GMAP_API}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default locationRouter