exports.run = async (client, message, args, level) => {
	await message.guild.members.fetch()
  const settings = message.settings;
  let users = Array.from(await message.guild.roles.cache.get(settings.VictumRoleID).members.map(m=>m.user)).sort(() => .5 - Math.random()).slice(0,2)
  let victums = ""

  for (var key in users) {
  	victums = victums.concat(`<@${users[key].id}>\n`)
  }

  await message.guild.channels.cache.find(c => c.id === settings.EventChannelID).send(`
Hope you all @here are having a good time, but it's that time of the week again where two people get put to the firing line of the dab rule! Said people are picked randomly by me, arthur! so good luck people!
The victims are as follows:
${victums}
Cheers!
`);

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Party Planner"
};

exports.help = {
  name: "dabvictum",
  category: "Fun",
  description: "picks the dab victums for this week.",
  usage: `
  dabvictum
  `
};
