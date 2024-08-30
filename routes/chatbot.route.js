import express from 'express'
import { predictDisease } from '../controllers/predictDisease.controller.js';


const chatbotRouter = express.Router()

chatbotRouter.post('/', async(req, res) => {
    const { text } = req.body;
    try{
        const result = await predictDisease(text);
        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json({ error: 'Error predicting disease' });
    }
});

export default chatbotRouter