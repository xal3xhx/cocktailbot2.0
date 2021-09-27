exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  let guildQueue = client.player.getQueue(message.guild.id);
  let queue = client.player.createQueue(message.guild.id);
  if(!guildQueue) return message.reply("im currrent now playing any songs.")

  guildQueue.skip()
  await message.reply(`song skiped.`)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "skip",
  category: "Music",
  description: "skips the current song.",
  usage: "skip"
};
