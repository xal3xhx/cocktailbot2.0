exports.run = async (client, message, args, level) => {
  await message.guild.members.fetch()

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
