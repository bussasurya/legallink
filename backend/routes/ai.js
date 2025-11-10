// backend/routes/ai.js

const express = require('express');
const router = express.Router();
// We use the OpenAI library, as Groq's API is compatible with it.
const { OpenAI } = require('openai');

// 1. Check if the API key is loaded
if (!process.env.GROQ_API_KEY) {
    console.error("ERROR: GROQ_API_KEY is not set in your .env file.");
}

// 2. Initialize the OpenAI client to point to Groq's servers
const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1', // This is the magic line
});

// 3. This is the "persona" and safety guardrail for your AI
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
        // 1. Format the history for the API
        const messagesForAPI = [
            {
                role: "system",
                content: systemPrompt
            },
            // Convert our "bot/user" history to "assistant/user"
            // We skip the first "Hello" message from the bot.
            ...history.slice(1).map(msg => ({
                role: msg.sender === 'bot' ? 'assistant' : 'user',
                content: msg.text
            })),
            // Add the user's new message
            {
                role: "user",
                content: message
            }
        ];

        // 2. Call the Groq API
        const completion = await groq.chat.completions.create({
            // We'll use "Llama 3 8B", a fast and powerful model
            model: "llama-3.3-70b-versatile", 
            messages: messagesForAPI,
            max_tokens: 1000,
        });

        // 3. Get the response text
        const text = completion.choices[0].message.content;
        
        res.json({ text });

    } catch (err) {
        console.error("--- AI CHAT FAILED ---", err);
        res.status(500).json({ error: 'Failed to get a response from the AI.' });
    }
});

module.exports = router;