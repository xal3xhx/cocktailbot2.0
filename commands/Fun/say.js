exports.run = async (client, message, args, level) => {
    await message.delete();
    await message.channel.send(args.join(' '));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Server Owner"
};

exports.help = {
  name: "say",
  category: "Fun",
  description: "makes the bot say something",
  usage: "say <message>"
};
