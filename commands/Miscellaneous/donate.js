exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.send("https://ko-fi.com/bootlegskrillex");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "donate",
  category: "Miscellaneous",
  description: "yeah theres a donaction link",
  usage: "donate"
};
