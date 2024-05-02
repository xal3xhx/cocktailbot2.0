const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {

  // create a 2d array for cards and their image
  const cards = {
    "king": "https://img.skal.bar/discord/front-12.png",
    "queen": "https://img.skal.bar/discord/front-11.png",
    "jack": "https://img.skal.bar/discord/front-10.png",
    "10": "https://img.skal.bar/discord/front-9.png",
    "9": "https://img.skal.bar/discord/front-8.png",
    "8": "https://img.skal.bar/discord/front-7.png",
    "7": "https://img.skal.bar/discord/front-6.png",
    "6": "https://img.skal.bar/discord/front-5.png",
    "5": "https://img.skal.bar/discord/front-4.png",
    "4": "https://img.skal.bar/discord/front-3.png",
    "3": "https://img.skal.bar/discord/front-2.png",
    "2": "https://img.skal.bar/discord/front-1.png",
    "ace": "https://img.skal.bar/discord/front-0.png",
  }

  // create an array to match the card to the rule
const rules = {
  "2": '2 is **Choose**:\nYou choose a person to drink.',
  "3": '3 is **Me**:\nYou must drink!',
  "4": '4 is **Whores**:\nAll Females must drink.',
  "5": '5 is **Thumbmaster**:\nYou are now the Thumbmaster, you can send a 👍 emoji at any time. Everyone must respond with a 👍 ASAP. The last person to do it must drink!.\nOnce this card is picked again, all powers are passed on.',
  "6": '6 is **Dicks**:\nAll men must drink.',
  "7": '7 is **Heaven**:\nAs soon as this card is picked, everyone must send this emoji 🙌.\nThe last person to do it must drink!',
  "8": '8 is **Mate**:\nYou choose someone to drink with you.',
  "9": '9 is **Rhyme**:\nYou choose a word, going round the group everyone must say a word that rhymes with it.\nIf you hesitate for too long, get it wrong or say a word that has already been said. You must drink!',
  "10": '10 is **Categories**:\nYou choose a category e.g (make of cars), going round the group everyone must say a word related to that category.\nIf you hesitate for too long, say a word that has already been said, or get it wrong. You must drink!',
  "jack": 'Jack is **Make up a rule**:\nYou make up a rule to be played in the game until the next Jack is picked.',
  "queen": 'Queen is **Question Master**:\nYou are now the Question Master, if anyone responds to a question from you they must drink.\nOnce this card is picked again, all powers are passed on.',
  "king": 'King is **Take a shot**:\nTake a shot for the first three kings, if you have picked the last king, you must finish your drink!',
  "ace": 'Ace is **Waterfall**:\nHost a waterfall, everyone must drink untill you stop.',
};

  // pick a random card
  const card = Object.keys(cards)[Math.floor(Math.random() * Object.keys(cards).length)];
  // get the rule for the card
  const rule = rules[card];
  // get the image for the card
  const image = cards[card];

  // send an embed with the card and rule
  const embed = new Discord.EmbedBuilder()
    .setColor('RANDOM')
    .setTitle('Kings cup')
    .setDescription(`${message.author} has drawn a ${card}`)
    .setImage(image)
    .setFooter(`${rule}`);

    await message.channel.send({ embeds: [embed] });
}



exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["king", "kc"],
  permLevel: "User"
};

exports.help = {
  name: "kings",
  category: "Games",
  description: "picks a random card from a deck and gives you the rule for it.",
  usage: `
  kings
  `
};
