const { version } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  const duration = durationFormatter.format(client.uptime);
  const stats = codeBlock("asciidoc", `= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString()}
• Servers    :: ${client.guilds.cache.size.toLocaleString()}
• Channels   :: ${client.channels.cache.size.toLocaleString()}
• Discord.js :: v${version}
• Node       :: ${process.version}`);
  await interaction.reply(stats);
};

exports.commandData = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('shows current stats of the bot.')
    .setDefaultPermission(true)
    .toJSON()

// Set this to false if you want it to be global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};