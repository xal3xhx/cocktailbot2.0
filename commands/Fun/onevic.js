exports.run = async (client, message, args, level) => {
<<<<<<< HEAD
	await message.guild.members.fetch()
  const settings = message.settings;
  let users = Array.from(await message.guild.roles.cache.get('852660279544381480').members.map(m=>m.user)).sort(() => .5 - Math.random()).slice(0,1)
  let victums = ""
=======
  
  await message.guild.members.fetch()
>>>>>>> 3083767eb054c4048a46bc3a609138ce6c910b9e

  // get one random user with the role id "852660279544381480"
  const one = message.guild.members.cache.filter(member => member.roles.cache.has('852660279544381480')).random().user;
  message.reply(`the one victum is <@${one.id}>\n`)
  };

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Party Planner"
};

exports.help = {
  name: "onevic",
  category: "Fun",
  description: "picks the dab victums for this week.",
  usage: "onevic"
};
