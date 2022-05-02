const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  // get a random number from 1 - 6
  const randomNumber = Math.floor(Math.random() * 6) + 1;
  message.reply(`You rolled a ${randomNumber}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["roll"],
  permLevel: "User"
};

exports.help = {
  name: "d6",
  category: "Games",
  description: "rolls a d6 dice",
  usage: `
  d6
  `
};
