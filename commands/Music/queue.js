const { EmbedBuilder } = require("discord.js");
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    const queue = await client.player.getQueue(message.guild.id);
    if (!queue) return message.reply('There is nothing playing.');
    // list 10 songs in queue
    const embed = new EmbedBuilder()
        .setAuthor(`${message.guild.name} - Queue`, message.guild.iconURL())
        .setColor("#0099ff")
        .setDescription(`${queue.songs.map(song => `**-** ${song.name}`).join('\n')}`);
    return await message.channel.send({ embeds: [embed] });
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
  };
  
  exports.help = {
    name: "queue",
    category: "Music",
    description: "lists the songs in the queue",
    usage: "queue"
  };