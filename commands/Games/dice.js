const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  // array of links for take/give dice
  const typeLink = [
    'http://ided.online/discord/give.gif',
    'http://ided.online/discord/take.gif',
  ]
  // array of links for number dice
  const modifierLink = [
    'http://ided.online/discord/1shot.gif',
    'http://ided.online/discord/2shot.gif',
    'http://ided.online/discord/3shot.gif',
  ]

  // pick a random typelink and modifierlink
  const type = typeLink[Math.floor(Math.random() * typeLink.length)]
  const modifier = modifierLink[Math.floor(Math.random() * modifierLink.length)]

  // send an embed with the 2 links
  const embed1 = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('Dice Roll')
    .setDescription(`${message.author} rolled there first dice as`)
    .setImage(type)
  
  const embed2 = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('Dice Roll')
    .setDescription(`${message.author} rolled their second dice as`)
    .setImage(modifier)
  await message.channel.send({ embeds: [embed1] });
  await message.channel.send({ embeds: [embed2] });
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
