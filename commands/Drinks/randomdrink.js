const { MessageEmbed } = require("discord.js");
const { randomdrink } = require("../../modules/functions.js");
const logger = require("../../modules/Logger.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  results = await randomdrink(message.guild.id)
  .then(results =>{return results})
  .catch(error => {logger.error(error)});

  if (!results) return await message.channel.send(`there are no drinks found for this server.`)

  var name = results.name
  var description = results.discription
  var image = results.image
  var ingredients = JSON.parse(results.ingredients)
  var instructions = results.instructions
  var author = results.author
  var up_vote = results.up_vote
  var down_vote = results.downvote
  var message_id = results.message_id
  var server_id = results.server_id

  

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
  name: "randomdrink",
  category: "Drinks",
  description: "displays a random drink from current server.",
  usage: "randomdrink"
};
