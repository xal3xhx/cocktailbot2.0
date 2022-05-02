const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {

  // doing some weird stuff here to make it a bit more random, or atleast look that way

  const heads = [
    'https://img.skal.bar/discord/HEADS-min.gif',
    'https://img.skal.bar/discord/HEADS-min.gif',
    'https://img.skal.bar/discord/HEADS-min.gif',
    'https://img.skal.bar/discord/HEADS-min.gif',
  ]
  const tails = [
    'https://img.skal.bar/discord/TAILS-min.gif',
    'https://img.skal.bar/discord/TAILS-min.gif',
    'https://img.skal.bar/discord/TAILS-min.gif',
    'https://img.skal.bar/discord/TAILS-min.gif',
  ]
  // combine heads and tails into one array
  let flip = heads.concat(tails);
  // shuffle the array
  flip = flip.sort(() => Math.random() - 0.5);
  // pick a random flip from the array
  const rflip = flip[Math.floor(Math.random() * flip.length)];
  

  if(!args[0]) return message.channel.send('Please provide a guess for coin flip.');
  if(args[0] !== 'heads' && args[0] !== 'tails') return message.channel.send('Please provide a guess.');

  // if the user guesses red
  if (args[0] === 'heads' && heads.includes(rflip) || args[0] === 'tails' && tails.includes(rflip)) {
      const embed = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setTitle('coin flip')
      .setDescription(`${message.author} Guessed Correctly, give away 1 drink!`)
      .setImage(rflip)
      await message.channel.send({ embeds: [embed] });
  } else if (args[0] === 'heads' && !heads.includes(rflip) || args[0] === 'tails' && !tails.includes(rflip)) {
      const embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle('coin flip')
      .setDescription(`${message.author} Guessed Incorrectly, take 1 drink!`)
      .setImage(rflip)
      await message.channel.send({ embeds: [embed] });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["coin", "cflip", "cf"],
  permLevel: "User"
};

exports.help = {
  name: "flip",
  category: "Games",
  description: "flips a coin, guess heads or tails!",
  usage: `
  flip <heads/tails>
  `
};
