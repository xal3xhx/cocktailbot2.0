const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  // array of links for take/give dice
  const dice = {
    "give1": "https://img.skal.bar/discord/Give_One.gif",
    "give2": "https://img.skal.bar/discord/Give_Two.gif",
    "give3": "https://img.skal.bar/discord/Give_Three.gif",
    "take1": "https://img.skal.bar/discord/Take_One.gif",
    "take2": "https://img.skal.bar/discord/Take_Two.gif",
    "take3": "https://img.skal.bar/discord/Take_Three.gif",

  }

  // randomize the 2d array
  const diceRoll = Object.keys(dice).sort(() => Math.random() - 0.5);
  // pick a random dice from the array
  const rdice = diceRoll[Math.floor(Math.random() * diceRoll.length)];


  // send an embed with the dice roll
  const embed = new Discord.EmbedBuilder()
  .setColor("RANDOM")
  .setTitle('Drinking Dice')
  .setDescription(`${message.author} rolled,`)
  .setImage(dice[rdice])
  await message.channel.send({ embeds: [embed] });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["ddice", "dd"],
  permLevel: "User"
};

exports.help = {
  name: "dice",
  category: "Games",
  description: "rolls the drinking dice!",
  usage: `
  dice
  `
};
