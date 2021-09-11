const Discord = require('discord.js');
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  results = await client.topdrinks(message.guild.id)
    .then(results =>{return results})
    .catch(error => {client.logger.error(error)});
  const settings = message.settings = client.getSettings(message.guild);
  if (!results[0]) return await message.channel.send(`there are no drinks found for this server.`)

  const embed = new Discord.MessageEmbed()
  embed.setColor("RED")
  embed.setImage("https://i.imgur.com/hKxdqF0.png")
  for (const i of Array(3).keys()) {
    embed.addField(`#${i+1}`,`**name**: ${results[i].name} \n **upvotes**: ${results[i].up_vote} \n **author**: ${results[i].author} \n **link**: https://discordapp.com/channels/${message.guild.id}/${settings.cocktailchannelID}/${results[i].message_id}`) 
  }
  await message.channel.send(``,{embed},{split: true}).catch(client.logger.error);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "top",
  category: "drinks",
  description: "displays the top 3 drinks from current server",
  usage: "top"
};
