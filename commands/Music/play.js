const { EmbedBuilder } = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const queue = client.player.createQueue(message.guild.id);
  // add the song to the queue
  await queue.join(message.member.voice.channel)
  let song = await queue.play(args[0]);
  // send an embed to the channel
  const embed = new EmbedBuilder()
        .setAuthor(`${message.guild.name} - Queue`, message.guild.iconURL())
        .setColor("#0099ff")
        .setDescription(`${song.name} added to the queue`)
        .setFooter(`Requested by ${message.author.tag}`);
        
    return await message.channel.send({ embeds: [embed] });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "play",
  category: "Music",
  description: "plays a song!",
  usage: "play {URL}"
};
