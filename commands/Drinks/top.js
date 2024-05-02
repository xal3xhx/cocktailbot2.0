const { EmbedBuilder } = require("discord.js");
const { topdrinks } = require("../../modules/drinksbackend.js");
const logger = require("../../modules/Logger.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  results = await topdrinks(message.guild.id)
    .then(results =>{return results})
    .catch(error => {logger.error(error)});

  if (!results[0]) return await message.channel.send(`there are no drinks found for this server.`)

  const embed = new EmbedBuilder()
  embed.setColor("RED")
  embed.setImage("https://i.imgur.com/hKxdqF0.png")
  
  for (const i of Array(3).keys()) {
    embed.addField(`#${i+1}`,`**name**: ${results[i].name} \n **upvotes**: ${results[i].up_vote} \n **author**: ${results[i].author} \n **link**: https://discordapp.com/channels/${message.guild.id}/${settings.CocktailChannelID}/${results[i].message_id}`) 
  }
  await message.channel.send({ embeds: [embed] });
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "top",
  category: "Drinks",
  description: "displays the top 3 drinks from current server",
  usage: "top"
};
