const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {

  const blackCards = [
    'https://img.skal.bar/discord/front-0.png',
    'https://img.skal.bar/discord/front-1.png',
    'https://img.skal.bar/discord/front-2.png',
    'https://img.skal.bar/discord/front-3.png',
    'https://img.skal.bar/discord/front-4.png',
    'https://img.skal.bar/discord/front-5.png',
    'https://img.skal.bar/discord/front-6.png',
    'https://img.skal.bar/discord/front-7.png',
    'https://img.skal.bar/discord/front-8.png',
    'https://img.skal.bar/discord/front-9.png',
    'https://img.skal.bar/discord/front-10.png',
    'https://img.skal.bar/discord/front-11.png',
    'https://img.skal.bar/discord/front-12.png',
    'https://img.skal.bar/discord/front-26.png',
    'https://img.skal.bar/discord/front-27.png',
    'https://img.skal.bar/discord/front-28.png',
    'https://img.skal.bar/discord/front-29.png',
    'https://img.skal.bar/discord/front-30.png',
    'https://img.skal.bar/discord/front-31.png',
    'https://img.skal.bar/discord/front-32.png',
    'https://img.skal.bar/discord/front-33.png',
    'https://img.skal.bar/discord/front-34.png',
    'https://img.skal.bar/discord/front-35.png',
    'https://img.skal.bar/discord/front-36.png',
    'https://img.skal.bar/discord/front-37.png',
    'https://img.skal.bar/discord/front-38.png',

  ]

  const redCards = [
    'https://img.skal.bar/discord/front-13.png',
    'https://img.skal.bar/discord/front-14.png',
    'https://img.skal.bar/discord/front-15.png',
    'https://img.skal.bar/discord/front-16.png',
    'https://img.skal.bar/discord/front-17.png',
    'https://img.skal.bar/discord/front-18.png',
    'https://img.skal.bar/discord/front-19.png',
    'https://img.skal.bar/discord/front-20.png',
    'https://img.skal.bar/discord/front-21.png',
    'https://img.skal.bar/discord/front-22.png',
    'https://img.skal.bar/discord/front-23.png',
    'https://img.skal.bar/discord/front-24.png',
    'https://img.skal.bar/discord/front-25.png',
    'https://img.skal.bar/discord/front-39.png',
    'https://img.skal.bar/discord/front-40.png',
    'https://img.skal.bar/discord/front-41.png',
    'https://img.skal.bar/discord/front-42.png',
    'https://img.skal.bar/discord/front-43.png',
    'https://img.skal.bar/discord/front-44.png',
    'https://img.skal.bar/discord/front-45.png',
    'https://img.skal.bar/discord/front-46.png',
    'https://img.skal.bar/discord/front-47.png',
    'https://img.skal.bar/discord/front-48.png',
    'https://img.skal.bar/discord/front-49.png',
    'https://img.skal.bar/discord/front-50.png',
    'https://img.skal.bar/discord/front-51.png',
  ]

    // combine the two arrays
    let allCards = blackCards.concat(redCards);
    // shuffle the array
    allCards = allCards.sort(() => Math.random() - 0.5);
    // pick a random card
    const card = allCards[Math.floor(Math.random() * allCards.length)];
    if(!args[0]) return message.channel.send('Please provide a guess for the card.');
    if(args[0] !== 'black' && args[0] !== 'red') return message.channel.send('Please provide a valid card type.');

    // if the user guesses red
    if (args[0] === 'red' && redCards.includes(card) || args[0] === 'black' && blackCards.includes(card)) {
        const embed = new Discord.EmbedBuilder()
        .setColor("GREEN")
        .setTitle('baseball cards')
        .setDescription(`${message.author} Guessed Correctly, give away 1 drink!`)
        .setImage(card)
        await message.channel.send({ embeds: [embed] });
    } else if (args[0] === 'red' && !redCards.includes(card) || args[0] === 'black' && !blackCards.includes(card)) {
        const embed = new Discord.EmbedBuilder()
        .setColor("RED")
        .setTitle('baseball cards')
        .setDescription(`${message.author} Guessed Incorrectly, take 1 drink!`)
        .setImage(card)
        await message.channel.send({ embeds: [embed] });
    }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["baseball", "bb"],
  permLevel: "User"
};

exports.help = {
  name: "baseball",
  category: "Games",
  description: "guess red or black",
  usage: `
  baseball <red/black>
  `
};
