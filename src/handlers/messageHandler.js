const config = require('../config')
const downloader = require('../commands/downloader')
const sticker = require('../commands/sticker')
const group = require('../commands/group')
const ai = require('../commands/ai')

module.exports = async (sock, msg) => {
    try {
        const from = msg.key.remoteJid
        const isGroup = from.endsWith('@g.us')
        const sender = isGroup ? msg.key.participant : msg.key.remoteJid
        if (!sender) return
        const senderNumber = sender.replace('@s.whatsapp.net', '')
        const isOwner = senderNumber === config.ownerNumber

        // Extract message text
        const body =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            msg.message?.imageMessage?.caption ||
            msg.message?.videoMessage?.caption ||
            ''

        const isCommand = body.startsWith(config.prefix)
        if (!isCommand) return

        const args = body.slice(config.prefix.length).trim().split(/\s+/)
        const command = args.shift().toLowerCase()
        const text = args.join(' ')

        // Context object passed to every command
        const ctx = {
            sock,
            msg,
            from,
            sender,
            senderNumber,
            isGroup,
            isOwner,
            args,
            text,
            command,
            body
        }

        console.log(`[CMD] ${command} | From: ${senderNumber} | Group: ${isGroup}`)

        // Route to the right command
        switch (command) {
            // --- DOWNLOADER ---
            case 'ytmp3':
            case 'ytmp4':
                await downloader.youtube(ctx)
                break
            case 'tiktok':
            case 'tt':
                await downloader.tiktok(ctx)
                break

            // --- STICKER ---
            case 'sticker':
            case 's':
                await sticker.makeSticker(ctx)
                break

            // --- GROUP TOOLS ---
            case 'kick':
                await group.kick(ctx)
                break
            case 'add':
                await group.add(ctx)
                break
            case 'promote':
                await group.promote(ctx)
                break
            case 'demote':
                await group.demote(ctx)
                break
            case 'mute':
                await group.mute(ctx)
                break
            case 'unmute':
                await group.unmute(ctx)
                break
            case 'tagall':
                await group.tagAll(ctx)
                break

            // --- AI ---
            case 'ai':
            case 'chat':
                await ai.chat(ctx)
                break

            // --- HELP MENU ---
            case 'menu':
            case 'help':
                await sendMenu(ctx)
                break

            default:
                await sock.sendMessage(from, {
                    text: `❌ Unknown command: *${command}*\nType *${config.prefix}menu* to see all commands.`
                }, { quoted: msg })
        }

    } catch (err) {
        console.error('[ERROR] messageHandler:', err)
    }
}

async function sendMenu({ sock, from, msg }) {
    const { prefix, botName } = require('../config')
    const menu = `
╔══════════════════╗
║   *${botName} Menu*   ║
╚══════════════════╝

📥 *DOWNLOADER*
├ ${prefix}ytmp3 [url] - YouTube to MP3
├ ${prefix}ytmp4 [url] - YouTube to MP4
└ ${prefix}tiktok [url] - TikTok video

🖼️ *STICKER*
└ ${prefix}sticker - Reply an image/video

👥 *GROUP TOOLS*
├ ${prefix}kick @user - Kick a member
├ ${prefix}add [number] - Add a member
├ ${prefix}promote @user - Make admin
├ ${prefix}demote @user - Remove admin
├ ${prefix}mute - Mute the group
├ ${prefix}unmute - Unmute the group
└ ${prefix}tagall - Tag all members

🤖 *AI*
└ ${prefix}ai [question] - Ask AI anything

Type a command to get started!
    `.trim()

    await sock.sendMessage(from, { text: menu }, { quoted: msg })
}