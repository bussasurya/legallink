// backend/routes/ai.js

const express = require('express');
const router = express.Router();
// --- CRITICAL FIX: Use the standard, stable library ---
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Check if the API key is loaded
if (!process.env.GOOGLE_AI_API_KEY) {
    console.error("ERROR: GOOGLE_AI_API_KEY is not set in your .env file.");
}

// 2. Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const systemPrompt = `
    You are "Harshi's AI," a helpful legal assistant for a platform in India called LegalLink.
    Your primary purpose is to provide general legal information and explain complex legal topics in simple, understandable terms for a client.

    CRITICAL RULES:
    1.  **DO NOT GIVE LEGAL ADVICE.** You must never, under any circumstances, tell a user what they "should do," or analyze the "merits of their case," or predict an outcome (e.g., "you have a strong case").
    2.  If a user asks for advice (e.g., "what should I do?" or "did I commit a crime?"), you must refuse and explain your purpose.
    3.  **Correct format:** Instead of "You should do X," say "In a situation like X, common legal options *might include*..."
    4.  **Disclaimer:** You MUST end every single response with the following disclaimer, on a new line:
        "*I am an AI assistant and this is not legal advice. Please consult a verified lawyer on our platform for your specific situation.*"
`;

router.post('/chat', async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        // --- CRITICAL FIX: Use the stable model name ---
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-exp", // This is the most reliable model name right now
            systemInstruction: systemPrompt,
        });
        
        const chatHistory = history.slice(1).map(msg => ({
            role: msg.sender === 'bot' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        const chat = model.startChat({
            history: chatHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        
        res.json({ text });

    } catch (err) {
        console.error("--- AI CHAT FAILED ---", err);
        // Send the actual error message back to the frontend for better debugging
        res.status(500).json({ error: err.message || 'Failed to get a response from the AI.' });
    }
});

module.exports = router;