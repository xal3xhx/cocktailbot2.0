exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  let guildQueue = client.player.getQueue(message.guild.id);
  let queue = client.player.createQueue(message.guild.id);

  if(!args.join(' ')) return message.reply("you need to provide a youtube link.")
  
  await queue.join(message.member.voice.channel);
  let song = await queue.play(args.join(' '))
  await message.reply(`the song ***${song.name}*** has been added to the queue.`)
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
