const { fetchMore } = require("../../modules/functions.js");

exports.run = async (client, message, args, level) => {

// clear messages without using bulkdelete
if(!args[0]) return message.channel.send('Please provide a number of messages to clear.');
if(isNaN(args[0])) return message.channel.send('Please provide a number of messages to clear.');
message.delete();
const messages = await fetchMore(message.channel, args[0]);
// for each mesage in the array, delete it, wait .5 seconds, then delete the next one
messages.forEach(async (message) => {
    setTimeout(() => {
        message.delete();
    }, 1300);
});
// send a message saying that the messages were deleted
let finished = await message.channel.send(`${args[0]} messages were deleted.`);
// after 5 seconds delete the message
setTimeout(() => finished.delete(), 5000);

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
