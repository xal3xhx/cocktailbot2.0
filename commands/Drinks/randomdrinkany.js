const { MessageEmbed } = require("discord.js");
const { randomdrinkany } = require("../../modules/functions.js");
const logger = require("../../modules/Logger.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  results = await randomdrinkany()
  .then(results =>{return results})
  .catch(error => {logger.error(error)});

  var name = results.name
  var description = results.discription
  var image = results.image
  var ingredients = JSON.parse(results.ingredients)
  var instructions = results.instructions

  const embed = new MessageEmbed()
      .setAuthor(name)
      .setColor("RED")
      .setImage(image)
      .addField(`description`, `${description}`)
      .addField(`ingredients`, `${ingredients.toString().replaceAll(",","\n")}`)
      .addField(`instructions`, `${instructions}`)
  await message.channel.send({ embeds: [embed] });
  }

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "randomdrinkany",
  category: "Drinks",
  description: "displays a random drink from any server.",
  usage: "randomdrinkany"
};
