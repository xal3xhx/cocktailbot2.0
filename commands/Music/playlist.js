const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  let queue = client.player.createQueue(message.guild.id);

  if(!args.join(' ')) return message.reply("you need to provide a youtube link.")
  
  await queue.join(message.member.voice.channel);
  let song = await queue.playlist(args.join(' '))
  const embed = new MessageEmbed()
        .setAuthor(`${message.guild.name} - Queue`, message.guild.iconURL())
        .setColor("#0099ff")
        .setDescription(`Playlist ${song.name} has been added to the queue.`)
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
  name: "playlist",
  category: "Music",
  description: "adds a playlist to the queue",
  usage: "playlist {URL}"
};
