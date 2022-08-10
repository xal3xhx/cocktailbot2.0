const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const queue = await client.player.getQueue(message.guild.id);
    if (!queue) return message.reply('There is nothing playing.');

  queue.setPaused(true)
  const embed = new MessageEmbed()
        .setAuthor(`${message.guild.name} - Queue`, message.guild.iconURL())
        .setColor("#0099ff")
        .setDescription(`Player has been paused.`)
        
    return await message.channel.send({ embeds: [embed] });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "pause",
  category: "Music",
  description: "pauses the player.",
  usage: "pause"
};
