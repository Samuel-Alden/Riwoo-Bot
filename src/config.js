require('dotenv').config()

module.exports = {
    botName: process.env.BOT_NAME || 'Riwoo',
    prefix: process.env.PREFIX || '!',
    ownerNumber: process.env.OWNER_NUMBER,
    anthropicKey: process.env.ANTHROPIC_API_KEY
}