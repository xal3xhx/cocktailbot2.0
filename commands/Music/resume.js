exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  let guildQueue = client.player.getQueue(message.guild.id);
  let queue = client.player.createQueue(message.guild.id);
  if(!guildQueue) return message.reply("im currrent now playing any songs.")

  guildQueue.resume()
  await message.reply(`resumed player.`)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "resume",
  category: "Music",
  description: "resumes the player.",
  usage: "resume"
};
