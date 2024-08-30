import { Client } from "@gradio/client";
async function predictDisease(text) {

    const client = await Client.connect("samyak152002/sih-hackathon");
    const result = await client.predict("/predict", { 		
		text: text, 
    });
    return result.data;
}
predictDisease("I have a headache").then(console.log);
export default predictDisease;