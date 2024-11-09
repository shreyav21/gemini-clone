import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = "AIzaSyCWdbKXf0Fnu402FB9ciQfQgdAjTirRX7s";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  // Initialize a chat session
  const chatSession = model.startChat({
    generationConfig,
    history: [], // Empty history to start fresh
  });

  // Send the prompt message to the model
  const result = await chatSession.sendMessage(prompt);

  // Log the result and return the response text correctly
  console.log(result.response.text());  // Make sure to call text() on result.response
  return result.response.text();  // Return the text from the response
}

export default run;
