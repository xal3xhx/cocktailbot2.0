const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const queue = await client.player.getQueue(message.guild.id);
    if (!queue) return message.reply('There is nothing playing.');

  queue.shuffle()
  const embed = new MessageEmbed()
        .setAuthor(`${message.guild.name} - Queue`, message.guild.iconURL())
        .setColor("#0099ff")
        .setDescription(`The queue has been shuffled.`)
        
    return await message.channel.send({ embeds: [embed] });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "shuffle",
  category: "Music",
  description: "shuffles all the songs in the queue.",
  usage: "shuffle"
};
