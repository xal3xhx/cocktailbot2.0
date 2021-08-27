exports.run = async (client, message, args, level) => {

const settings = message.settings = client.getSettings(message.guild)
console.log(settings.eventchannelID)
let msg = await message.guild.channels.cache.find(c => c.id === settings.eventchannelID).send(`Hello @everyone, as you know <@102131189187358720> hosts movies almost everyday, in an effort to reduce pings for everyone please react to this if you want to be pinged when we are watching a movie!`).catch(console.error);
await msg.react("🎥");

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "owner"
};

exports.help = {
  name: "ddd",
  category: "fun",
  description: "send message",
  usage: "ddd"
};
