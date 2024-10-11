import { OpenAI } from "openai";

const openai = new OpenAI("your-api-key");

async function generatePrompts(engine, prompt) {
  const response = await openai.createCompletion({
    engine: engine,
    prompt: prompt,
    max_tokens: 1024,
    temperature: 0.5,
  });
  return response.choices[0].text.trim();
}
