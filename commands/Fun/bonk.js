exports.run = async (client, message, args, level) => {
  const settings = message.settings;
  // check if user has the bonk role
  if (!message.member.roles.cache.has(settings.bonker)) {
    return await message.reply("You don't have the bonk role!");
  }
  // get user from args
  const user = message.mentions.users.first();
  // if user is in a voice channel and is not the bot move them to channel id "settings.hornyjailchannelID"
  if (user && user.voice.channel && user.id !== client.user.id) {
    const channel = await message.guild.channels.cache.get(settings.hornyjailchannelID);
    if (channel) {
      await user.voice.setChannel(channel);
      return await message.reply(`Bonked ${user.username}! go to horny jail!`);
    }
  else {
    return await message.reply(`${user.username} is not in a voice channel!`);
  }
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