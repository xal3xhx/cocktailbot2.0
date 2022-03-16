const config = require("../../config.js");
const settings = require("../../modules/settings.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  process.exit(0);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["restart"],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reboot",
  category: "System",
  description: "Shuts down the bot. If running under PM2, bot will restart automatically.",
  usage: "reboot"
};
