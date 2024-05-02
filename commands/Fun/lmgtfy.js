exports.run = async (client, message, args, level) => {
    let msg = encodeURIComponent(args.join(" "));
    // replace spaces with +
    msg = msg.replace(/%20/g, "+");
    let link = `https://letmegooglethat.com/?q=${msg}`;
    await message.channel.send(link);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["google", "search", "lazy"],
  permLevel: "User"
};

exports.help = {
  name: "lmgtfy",
  category: "Fun",
  description: "posts a link to lmgtfy",
  usage: `
  lmgtfy <text>
  `
};
