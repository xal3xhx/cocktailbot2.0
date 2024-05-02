const { EmbedBuilder } = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const queue = await client.player.getQueue(message.guild.id);
    if (!queue) return message.reply('There is nothing playing.');

  queue.skip()
  const embed = new EmbedBuilder()
        .setAuthor(`${message.guild.name} - Queue`, message.guild.iconURL())
        .setColor("#0099ff")
        .setDescription(`The current song has been skip.`)
        
    return await message.channel.send({ embeds: [embed] });
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
