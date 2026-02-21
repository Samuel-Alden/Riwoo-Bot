const { GoogleGenerativeAI } = require('@google/generative-ai')
require('dotenv').config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: 'You are a helpful WhatsApp bot assistant. Keep responses concise and friendly. Use simple formatting since this is WhatsApp.'
})

// Store chat sessions per user
const sessions = {}

module.exports = {
    chat: async ({ sock, from, msg, sender, text }) => {
        if (!text) {
            await sock.sendMessage(from, {
                text: '❓ Please provide a question!\nExample: *!ai what is the capital of France?*'
            }, { quoted: msg })
            return
        }

        try {
            await sock.sendMessage(from, { text: '🤖 Thinking...' }, { quoted: msg })

            // Create a new chat session per user if it doesn't exist
            if (!sessions[sender]) {
                sessions[sender] = model.startChat({
                    history: [],
                    generationConfig: { maxOutputTokens: 1024 }
                })
            }

            const result = await sessions[sender].sendMessage(text)
            const reply = result.response.text()

            await sock.sendMessage(from, { text: reply }, { quoted: msg })

        } catch (err) {
            console.error('[AI ERROR]', err)
            await sock.sendMessage(from, {
                text: '❌ AI error. Make sure your GEMINI_API_KEY is set correctly in .env!'
            }, { quoted: msg })
        }
    }
}