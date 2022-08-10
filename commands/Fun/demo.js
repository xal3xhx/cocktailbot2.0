exports.run = async (client, message, args, level) => {
  await message.guild.channels.cache.find(c => c.id === '922645077619273749').send(`
testing time 123
`);

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "demo",
  category: "Fun",
  description: "sends a message to #bot-testing",
  usage: `
  demo
  `
};
