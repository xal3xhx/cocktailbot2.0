exports.run = async (client, message, args, level) => {
  const settings = message.settings;
  if (settings.BonkEnabled === false) return message.channel.send(`${message.author}, bonks are disabled on this server.`);

  // check if message author has the role id of "841066087772323851"
  // if not, return. 
  const role = message.guild.roles.cache.find(r => r.name === settings.Bonker);
  if (!message.member.roles.cache.has(role.id)) {
    return message.channel.send("You do not have the required role to use this command.");
  }
  
  // get member from args
  const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!user) {
    return message.channel.send("Please provide a user to bonk.");
  }
  // if user is in a voice channel and is not the bot move them to channel id "settings.hornyjailchannelID"
  if (user.voice.channel && user.id !== client.user.id) {
    const channel = await message.guild.channels.cache.get(settings.HornyjailChannelID);
    await user.voice.setChannel(channel);
    return await message.reply(`<@${message.author.id}> Bonked <@${user.user.id}>! go to horny jail!`);
    }
  else {
    return await message.reply(`<@${message.author.id}> bonked <@${user.user.id}>! they were being horny in <#${message.channel.id}>!`);
  }
};



exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "bonker"
};

exports.help = {
  name: "bonk",
  category: "Fun",
  description: "bonk the horny.",
  usage: "bonk"
};
