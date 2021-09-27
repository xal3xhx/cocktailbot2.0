exports.run = async (client, message, [action, ...value], level) => {

message.channel.bulkDelete(action).then(messages => client.logger.log(`Bulk deleted ${messages.size} message(s)`)).catch(client.logger.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "clear",
  category: "Moderation",
  description: "WARNING CLEARS ALL THE MESSAGES IN THE CURRENT CHANNEL!",
  usage: "clear"
};
