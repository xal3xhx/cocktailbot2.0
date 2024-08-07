const { EmbedBuilder } = require("discord.js");
const { fetchalldrinksany } = require("../../modules/drinksbackend.js");
const logger = require("../../modules/Logger.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  results = await fetchalldrinksany()
  .then(results =>{return results})
  .catch(error => {logger.error(error)});

  if (!results) return await message.channel.send(`there are no drinks found for this server.`)
for (i in results) {

  var name = results[i].name
  var description = results[i].discription
  var image = results[i].image
  var ingredients = JSON.parse(results[i].ingredients)
  var instructions = results[i].instructions

  const embed = new EmbedBuilder()
      .setAuthor(name)
      .setColor("RED")
      .setImage(image)
      .addField(`description`, `${description}`)
      .addField(`ingredients`, `${ingredients.toString().replaceAll(",","\n")}`)
      .addField(`instructions`, `${instructions}`)
  await message.channel.send({ embeds: [embed] });
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Server Owner"
};

exports.help = {
  name: "rebuildall",
  category: "Drinks",
  description: "sends all the drinks in the database from every server.",
  usage: "rebuildall"
};
