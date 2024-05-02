const { EmbedBuilder } = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const queue = await client.player.getQueue(message.guild.id);
    if (!queue) return message.reply('There is nothing playing.');

  queue.stop()
  const embed = new EmbedBuilder()
        .setAuthor(`${message.guild.name} - Queue`, message.guild.iconURL())
        .setColor("#0099ff")
        .setDescription(`The player has been stopped.`)
        
    return await message.channel.send({ embeds: [embed] });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "stop",
  category: "Music",
  description: "stops the player.",
  usage: "stop"
};
