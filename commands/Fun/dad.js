const fetch = require('node-fetch');

exports.run = async (client, message, args, level) => {
  // get https://icanhazdadjoke.com/ as plain text
  const joke = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "text/plain"
    }
  }).then(res => res.text());
  // reply with the joke
  message.reply(joke);
  };

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["djoke", "dadjoke"],
  permLevel: "User"
};

exports.help = {
  name: "dad",
  category: "Fun",
  description: "get a random dad joke.",
  usage: `
  dad
  `
};
