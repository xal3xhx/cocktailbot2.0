const owoify = require('owoify-js').default

exports.run = async (client, message, args, level) => {
    let msg = args.join(" ");
    // OWOifier
    owo = owoify(msg);
    // Send the message
    message.reply(owo);


    
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["uwu"],
  permLevel: "User"
};

exports.help = {
  name: "owo",
  category: "Fun",
  description: "replys with owo text",
  usage: `
  owo <text>
  `
};
