const logger = require("../modules/Logger.js");
const config = require("../config.js");
const { settings } = require("../modules/settings.js");

exports.run = async (client, message, args, level) => {
  const replying = settings.ensure(message.guild.id, config.defaultSettings).commandReply;
  
  message.reply({ content: `Bonks ${args} go to horny jail! <a:uwubonk:837991643557658624>`, allowedMentions: { repliedUser: (replying === "true") }});
		user = await message.guild.members.cache.get(message.mentions.users.first())
    console.log(user)
		if (user.id === '667339014625558540') return; // noodles
		if (user.id === '102131189187358720') return; // mine
    console.log(user.guild.channels.cache)
  	user.voice.setChannel(user.guild.channels.cache.find(id => id.id === '841058244075192330')).catch(() => logger.error(`user ${args} was not in a voice channel.`))
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "bonker"
};

exports.help = {
  name: "bonk",
  category: "fun",
  description: "bonk the horny.",
  usage: "bonk"
};
