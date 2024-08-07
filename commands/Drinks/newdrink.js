const { EmbedBuilder } = require("discord.js");
const { addDrink } = require("../../modules/drinksbackend.js");
const { awaitReply } = require("../../modules/functions.js");
const imgur = require('imgur');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  async function uploadImgur(url) {
    let json = await imgur.uploadUrl(url)
    let imgurURL = String(json.data.link)
    return imgurURL
  }


  let ingredients = [];
  const name = await awaitReply(message, `Whats the name of the drink/cocktail?`)
  const description = await awaitReply(message, `Whats the description of "${name}"?`)
  var image = await awaitReply(message, `please provide an image of "${name}"? you can provide a file or an imgur link.`)
  
  if(image.proxyURL) {
    image = await uploadImgur(image.proxyURL)
  }

  do {
  var count = await awaitReply(message, `How many ingredients are there in "${name}"? (number only)`)
} while (!Number.isInteger(Number(count)));

  const range = [...Array(Number(count)).keys()].map(i => i + 1)
  for (var i in range) {
    i = Number(i) + 1
    ingredients.push(await awaitReply(message, `What is ingredient #${i}?`))
  }
  const instructions = await awaitReply(message, `now how do you make "${name}"?`)

  ingredients = JSON.stringify(ingredients);

  const embed = new EmbedBuilder()
      .setAuthor(name)
      .setColor("RED")
      .setImage(image)
      .addField(`description`, `${description}`)
      .addField(`ingredients`, `${JSON.parse(ingredients).toString().replaceAll(",","\n")}`)
      .addField(`instructions`, `${instructions}`)
      .addField(`added by`, `${message.author.username}:${message.author.discriminator}`)
  let sent = await message.channel.send({ embeds: [embed] });
  sent.react("👍");
  sent.react("👎");

  let author = `${message.author.username}:${message.author.discriminator}`

  addDrink(name,description,image,ingredients,instructions,author,sent.id,message.guild.id)




}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "newdrink",
  category: "Drinks",
  description: "walk you through adding a drink to the database.",
  usage: "newdrink"
};
