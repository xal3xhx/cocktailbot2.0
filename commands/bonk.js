exports.run = async (client, message, args, level) => {
  message.reply(`Bonks ${args} go to horny jail! <a:uwubonk:837991643557658624>`);
		user = await message.guild.member(message.mentions.users.first()) || await message.guild.members.fetch(target).catch(() => client.logger.error(`could not find user.`))
		if (user.id === '667339014625558540') return; // noodles
		if (user.id === '102131189187358720') return; // mine
		try {
  		user.voice.setChannel(message.guild.channels.cache.find(id => id.id === '841058244075192330'))
		} catch(e){
			client.logger.error(`user ${args} was not in a voice channel.`)
			return;
		}
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
