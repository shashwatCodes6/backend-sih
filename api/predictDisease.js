import { Client } from "@gradio/client";
import dotenv from 'dotenv';


dotenv.config();

const model_url = process.env.MODEL_URL

async function predictDisease(text) {
    const client = await Client.connect(model_url);
    const result = await client.predict("/predict", { 		
		  text: text, 
    });
    return result.data;
}

predictDisease("I have a headache")
  .then(console.log("ML Model is up"))
  .catch(err => {
    console.log("Error loading model")
  });

export default predictDisease;