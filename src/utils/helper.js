// Check if a user is an admin in a group
async function isAdmin(sock, groupId, userId) {
    const metadata = await sock.groupMetadata(groupId)
    const admins = metadata.participants
        .filter(p => p.admin !== null)
        .map(p => p.id)
    return admins.includes(userId)
}

// Check if the bot itself is an admin
async function isBotAdmin(sock, groupId) {
    const botId = sock.user.id.replace(/:.*@/, '@')
    return await isAdmin(sock, groupId, botId)
}

// Format a number to WhatsApp JID format
function toJID(number) {
    return number.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
}

// Extract mentioned users from a message
function getMentions(msg) {
    return msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
}

// Get quoted message info
function getQuoted(msg) {
    return msg.message?.extendedTextMessage?.contextInfo?.quotedMessage || null
}

module.exports = { isAdmin, isBotAdmin, toJID, getMentions, getQuoted }