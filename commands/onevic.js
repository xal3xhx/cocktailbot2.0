exports.run = async (client, message, args, level) => {
	message.guild.members.fetch()
  const settings = message.settings = client.getSettings(message.guild)
  let users = Array.from(await message.guild.roles.cache.get('852660279544381480').members.map(m=>m.user)).sort(() => .5 - Math.random()).slice(0,1)
  let victums = ""

  for (var key in users) {
  	victums = victums.concat(`<@${users[key].id}>\n`)
  }

  message.reply(`the one victum is ${victums}`)

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Party Planner"
};

exports.help = {
  name: "onevic",
  category: "fun",
  description: "picks the dab victums for this week.",
  usage: "onevic"
};
