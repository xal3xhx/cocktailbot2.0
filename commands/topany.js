const Discord = require('discord.js');
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  results = await client.topdrinksany()
  .then(results =>{return results})
  .catch(error => {console.log(error)});

  const embed = new Discord.MessageEmbed()
  embed.setColor("RED")
  embed.setImage("https://i.imgur.com/hKxdqF0.png")
  for (const i of Array(3).keys()) {
    embed.addField(`#${i+1}`,`**name**: ${results[i].name} \n **upvotes**: ${results[i].up_vote} \n **discription**: ${results[i].discription} \n **ingredients**: ${JSON.parse(results[i].ingredients).toString().replaceAll(",","\n")} \n **instructions**: ${results[i].instructions}`) 
  }
  await message.channel.send(``,{embed},{split: true}).catch(console.error);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "topany",
  category: "drinks",
  description: "displays the top 3 drinks from all servers",
  usage: "topany"
};
