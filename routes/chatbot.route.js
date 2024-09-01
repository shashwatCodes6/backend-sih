import express from 'express'
import { predictDisease } from '../controllers/predictDisease.controller.js';
import converse from '../controllers/mistral.controller.js';


const chatbotRouter = express.Router()

// chatbotRouter.post('/', async(req, res) => {
//     const { text } = req.body;
//     try{
//         const result = await predictDisease(text);
//         res.status(200).json(result);
//     }
//     catch(err){
//         res.status(500).json({ error: 'Error predicting disease' });
//     }
// });



function responseCheck(response){
    if(response.includes("Here is a summary of your symptoms and information")){
        return true;
    }
    return false;
}

chatbotRouter.post('/converse', async(req, res) => {
    const { newMessage, messages } = req.body;
    console.log("yaha hu: ", newMessage, messages);
    try{

        const response = await converse(newMessage, messages);
        // console.log(response)

        if(responseCheck(response[response.length-1].content)){
            console.log("predicting disease.....................");
            const result = await predictDisease(response[response.length-1].content);
            res.status(200).json(result);
            return;
        }
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Error conversing' });
    }
});

export default chatbotRouter