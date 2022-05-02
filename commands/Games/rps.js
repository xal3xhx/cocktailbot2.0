const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {

  // make sure user has a valid input
  if (!args[0]) return message.channel.send("Please enter a guess");
  if (args[0] !== "rock" && args[0] !== "paper" && args[0] !== "scissors") return message.channel.send("Please enter rock, paper, or scissors");

  const rps = {
    "rock": "https://img.skal.bar/discord/rock.png",
    "paper": "https://img.skal.bar/discord/paper.png",
    "scissors": "https://img.skal.bar/discord/scissors.png"
  }

  // pick a random rps
  const rpsPick = Object.keys(rps)[Math.floor(Math.random() * Object.keys(rps).length)];

  // compare to the users choice
  // rock beats scissors, scissors beats paper, paper beats rock
  if (args[0] === 'rock' && rpsPick === 'scissors' || args[0] === 'scissors' && rpsPick === 'paper' || args[0] === 'paper' && rpsPick === 'rock') {
    const embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle(`${message.author.username} picked ${args[0]}`)
    .setDescription(`the bot picked ${rpsPick}, ${message.author} wins!`)
    .setImage(rps[rpsPick])
    await message.channel.send({ embeds: [embed] });
  }
  else if (args[0] === 'rock' && rpsPick === 'paper' || args[0] === 'scissors' && rpsPick === 'rock' || args[0] === 'paper' && rpsPick === 'scissors') {
    const embed = new Discord.MessageEmbed()
    .setColor("RED")
    .setTitle(`${message.author.username} picked ${args[0]}`)
    .setDescription(`the bot picked ${rpsPick}, ${message.author} looses!`)
    .setImage(rps[rpsPick])
    await message.channel.send({ embeds: [embed] });
  }
  else if (args[0] === 'rock' && rpsPick === 'rock' || args[0] === 'scissors' && rpsPick === 'scissors' || args[0] === 'paper' && rpsPick === 'paper') {
    const embed = new Discord.MessageEmbed()
    .setColor("YELLOW")
    .setTitle(`${message.author.username} picked ${args[0]}`)
    .setDescription(`the bot picked ${rpsPick}, ${message.author} ties!`)
    .setImage(rps[rpsPick])
    await message.channel.send({ embeds: [embed] });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "rps",
  category: "Games",
  description: "play rock paper scissors against the bot!",
  usage: `
  rps <rock/paper/scissors>
  `
};
