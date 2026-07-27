const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
const crypto = require('crypto');

const spamHashes = new Set();
const PREFIX = '!';

async function getImageHash(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'DiscordBot' } });
  const buf = Buffer.from(await res.arrayBuffer());
  return crypto.createHash('sha256').update(buf).digest('hex');
}

client.on('ready', () => {
  console.log('Р‘РѕС‚ Р·Р°РїСѓС‰РµРЅ Рё СЂР°Р±РѕС‚Р°РµС‚!');
});

client.on('messageCreate', async msg => {
  try {
    if (msg.author.bot) return;

    const lower = msg.content.toLowerCase();
    const hasPhoto = msg.attachments.size > 0;

    if (lower.startsWith(PREFIX + 'addspam') && hasPhoto) {
      const attach = msg.attachments.first();
      const hash = await getImageHash(attach.url);
      spamHashes.add(hash);
      await msg.reply('С„РѕС‚Рѕ РґРѕР±Р°РІР»РµРЅРѕ РІ СЃРїР°Рј-Р»РёСЃС‚');
      await msg.delete().catch(()=>{});
      return;
    }

    if (msg.content.includes('@everyone') || msg.content.includes('@here')) {
      await msg.delete().catch(()=>{});
      msg.channel.send(`${msg.author} РІР°С€Рµ СЃРѕРѕР±С‰РµРЅРёРµ Р·Р°РїСЂРµС‰РµРЅРѕ РІ СЌС‚РѕРј РґРёСЃРєРѕСЂРґ РєР°РЅР°Р»Рµ`);
      return;
    }

    if (hasPhoto) {
      for (const a of msg.attachments.values()) {
        if (a.contentType && a.contentType.startsWith('image/')) {
          const hash = await getImageHash(a.url);
          if (spamHashes.has(hash)) {
            await msg.delete().catch(()=>{});
            msg.channel.send(`${msg.author} РІР°С€Рµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ Р·Р°РїСЂРµС‰РµРЅРѕ РЅР° СЌС‚РѕРј РєР°РЅР°Р»Рµ Discord`);
            return;
          }
        }
      }
    }
  } catch (e) {
    console.log('РћС€РёР±РєР°:', e.message);
  }
});

client.login(process.env.TOKEN);
