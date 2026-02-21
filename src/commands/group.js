const { isAdmin, isBotAdmin, toJID, getMentions } = require('../utils/helper')

module.exports = {

    kick: async ({ sock, from, msg, isGroup, sender }) => {
        if (!isGroup) return sock.sendMessage(from, { text: '❌ This command is for groups only!' }, { quoted: msg })
        if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ You must be an admin to use this!' }, { quoted: msg })
        if (!await isBotAdmin(sock, from)) return sock.sendMessage(from, { text: '❌ I need to be an admin to kick members!' }, { quoted: msg })

        const mentions = getMentions(msg)
        if (!mentions.length) return sock.sendMessage(from, { text: '❌ Tag the person you want to kick!\nExample: *!kick @user*' }, { quoted: msg })

        await sock.groupParticipantsUpdate(from, mentions, 'remove')
        await sock.sendMessage(from, {
            text: `✅ Kicked ${mentions.length} member(s)!`,
            mentions
        }, { quoted: msg })
    },

    add: async ({ sock, from, msg, isGroup, sender, text }) => {
        if (!isGroup) return sock.sendMessage(from, { text: '❌ This command is for groups only!' }, { quoted: msg })
        if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ You must be an admin to use this!' }, { quoted: msg })
        if (!await isBotAdmin(sock, from)) return sock.sendMessage(from, { text: '❌ I need to be an admin to add members!' }, { quoted: msg })
        if (!text) return sock.sendMessage(from, { text: '❌ Provide a number!\nExample: *!add 628xxxxxxxxxx*' }, { quoted: msg })

        const jid = toJID(text)
        await sock.groupParticipantsUpdate(from, [jid], 'add')
        await sock.sendMessage(from, { text: `✅ Added ${text} to the group!` }, { quoted: msg })
    },

    promote: async ({ sock, from, msg, isGroup, sender }) => {
        if (!isGroup) return sock.sendMessage(from, { text: '❌ This command is for groups only!' }, { quoted: msg })
        if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ You must be an admin to use this!' }, { quoted: msg })
        if (!await isBotAdmin(sock, from)) return sock.sendMessage(from, { text: '❌ I need to be an admin to promote members!' }, { quoted: msg })

        const mentions = getMentions(msg)
        if (!mentions.length) return sock.sendMessage(from, { text: '❌ Tag the person you want to promote!\nExample: *!promote @user*' }, { quoted: msg })

        await sock.groupParticipantsUpdate(from, mentions, 'promote')
        await sock.sendMessage(from, {
            text: `✅ Promoted ${mentions.length} member(s) to admin!`,
            mentions
        }, { quoted: msg })
    },

    demote: async ({ sock, from, msg, isGroup, sender }) => {
        if (!isGroup) return sock.sendMessage(from, { text: '❌ This command is for groups only!' }, { quoted: msg })
        if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ You must be an admin to use this!' }, { quoted: msg })
        if (!await isBotAdmin(sock, from)) return sock.sendMessage(from, { text: '❌ I need to be an admin to demote members!' }, { quoted: msg })

        const mentions = getMentions(msg)
        if (!mentions.length) return sock.sendMessage(from, { text: '❌ Tag the person you want to demote!\nExample: *!demote @user*' }, { quoted: msg })

        await sock.groupParticipantsUpdate(from, mentions, 'demote')
        await sock.sendMessage(from, {
            text: `✅ Demoted ${mentions.length} member(s)!`,
            mentions
        }, { quoted: msg })
    },

    mute: async ({ sock, from, msg, isGroup, sender }) => {
        if (!isGroup) return sock.sendMessage(from, { text: '❌ This command is for groups only!' }, { quoted: msg })
        if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ You must be an admin to use this!' }, { quoted: msg })
        if (!await isBotAdmin(sock, from)) return sock.sendMessage(from, { text: '❌ I need to be an admin to mute the group!' }, { quoted: msg })

        await sock.groupSettingUpdate(from, 'announcement')
        await sock.sendMessage(from, { text: '🔇 Group muted! Only admins can send messages now.' }, { quoted: msg })
    },

    unmute: async ({ sock, from, msg, isGroup, sender }) => {
        if (!isGroup) return sock.sendMessage(from, { text: '❌ This command is for groups only!' }, { quoted: msg })
        if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ You must be an admin to use this!' }, { quoted: msg })
        if (!await isBotAdmin(sock, from)) return sock.sendMessage(from, { text: '❌ I need to be an admin to unmute the group!' }, { quoted: msg })

        await sock.groupSettingUpdate(from, 'not_announcement')
        await sock.sendMessage(from, { text: '🔊 Group unmuted! Everyone can send messages now.' }, { quoted: msg })
    },

    tagAll: async ({ sock, from, msg, isGroup, sender }) => {
        if (!isGroup) return sock.sendMessage(from, { text: '❌ This command is for groups only!' }, { quoted: msg })
        if (!await isAdmin(sock, from, sender)) return sock.sendMessage(from, { text: '❌ You must be an admin to use this!' }, { quoted: msg })

        const metadata = await sock.groupMetadata(from)
        const members = metadata.participants.map(p => p.id)
        const mentions = members.map(m => `@${m.split('@')[0]}`).join(' ')

        await sock.sendMessage(from, {
            text: `📢 *Attention everyone!*\n\n${mentions}`,
            mentions: members
        }, { quoted: msg })
    }
}