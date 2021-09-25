const { MessageEmbed } = require("discord.js");
const { topdrinksany } = require("../../modules/functions.js");
const logger = require("../../modules/Logger.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  results = await topdrinksany()
  .then(results =>{return results})
  .catch(error => {logger.error(error)});

  const embed = new MessageEmbed()
  embed.setColor("RED")
  embed.setImage("https://i.imgur.com/hKxdqF0.png")

  for (const i of Array(3).keys()) {
    embed.addField(`#${i+1}`,`**name**: ${results[i].name} \n **upvotes**: ${results[i].up_vote} \n **discription**: ${results[i].discription} \n **ingredients**: ${JSON.parse(results[i].ingredients).toString().replaceAll(",","\n")} \n **instructions**: ${results[i].instructions}`) 
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
  name: "topany",
  category: "Drinks",
  description: "displays the top 3 drinks from all servers",
  usage: "topany"
};
