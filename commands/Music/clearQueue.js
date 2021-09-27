exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  let guildQueue = client.player.getQueue(message.guild.id);
  let queue = client.player.createQueue(message.guild.id);
  if(!guildQueue) return message.reply("im currrent now playing any songs.")

  guildQueue.clearQueue();
  await message.reply(`player queue clered.`)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "clearqueue",
  category: "Music",
  description: "clears the current song queue.",
  usage: "clearqueue"
};
