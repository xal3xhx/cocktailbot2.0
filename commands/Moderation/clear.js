exports.run = async (client, message, args, level) => {


// clear all messages from a channel
    if (!args[0]) {
        return message.reply("You have to specify how many messages you want to delete.");
    }
    if (isNaN(args[0])) {
        return message.reply("You have to specify how many messages you want to delete.");
    }
    if (args[0] > 100) {
        return message.reply("You cannot delete more than 100 messages at once.");
    }
    if (args[0] == 0) {
        return message.reply("You cannot delete 0 messages.");
    }
    if (args[0] < 0) {
        return message.reply("You cannot delete a negative amount of messages.");
    }
    message.channel.bulkDelete(args[0]);
    message.channel.send(`Deleted ${args[0]} messages.`);
  
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
