const Discord = require('discord.js');
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  results = await client.fetchalldrinks(message.guild.id)
  .then(results =>{return results})
  .catch(error => {client.logger.error(error)});

  if (!results[0]) return await message.channel.send(`there are no drinks found for this server.`)
for (i in results) {

  var name = results[i].name
  var description = results[i].discription
  var image = results[i].image
  var ingredients = JSON.parse(results[i].ingredients)
  var instructions = results[i].instructions
  var author = results[i].author
  var up_vote = results[i].up_vote
  var down_vote = results[i].downvote
  var message_id = results[i].message_id
  var server_id = results[i].server_id

  

  const embed = new Discord.MessageEmbed()
      .setAuthor(name)
      .setColor("RED")
      .setImage(image)
      .addField(`description`, `${description}`)
      .addField(`ingredients`, `${ingredients.toString().replaceAll(",","\n")}`)
      .addField(`instructions`, `${instructions}`)
  newmessage = await message.channel.send(``,{embed},{split: true}).catch(client.logger.error);
  newmessage.react("👍");
  newmessage.react("👎");
  client.updateMessageID(message_id, newmessage.id, message.guild.id)
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Server Owner"
};

exports.help = {
  name: "rebuild",
  category: "drinks",
  description: "sends all the drinks in the database for the current server.",
  usage: "rebuild"
};
