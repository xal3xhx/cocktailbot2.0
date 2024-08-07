const { SlashCommandBuilder } = require("discord.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
    await interaction.deferReply();
    const reply = await interaction.editReply("Ping?");
    await interaction.editReply(`Pong! Latency is ${reply.createdTimestamp - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
  };

  exports.commandData = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('sends a ping.')
    .setDefaultPermission(true)
    .toJSON()

// Set this to false if you want it to be global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};