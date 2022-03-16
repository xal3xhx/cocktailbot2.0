const fetch = require('node-fetch');
const owoify = require('owoify-js').default

exports.run = async (client, message, args, level) => {
  // get https://icanhazdadjoke.com/ as plain text
  const joke = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "text/plain"
    }
  }).then(res => res.text());
  // reply with the joke
  message.reply(owoify(joke));
  };

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["djokeowo", "owodadjoke", "dadjokeowo"],
  permLevel: "User"
};

exports.help = {
  name: "dadowo",
  category: "Fun",
  description: "get a random owo dad joke.",
  usage: `
  dadowo
  `
};
