exports.run = async (client, message, args, level) => {


// clear all messages from a channel
  if (message.deletable) message.delete();
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You do not have permission to use this command!").then(m => m.delete(5000));
  if (!args[0]) return message.reply("Please specify how many messages you want to delete!").then(m => m.delete(5000));
  if (isNaN(args[0])) return message.reply("Please specify a valid number!").then(m => m.delete(5000));
  if (args[0] > 100) return message.reply("Please specify a number less than 100!").then(m => m.delete(5000));
  if (args[0] < 1) return message.reply("Please specify a number greater than 1!").then(m => m.delete(5000));
  message.channel.bulkDelete(args[0]).then(() => {
    message.channel.send(`Cleared ${args[0]} messages!`).then(m => m.delete(5000));
  }
  );
  
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
