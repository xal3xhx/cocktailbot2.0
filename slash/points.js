const { SlashCommandBuilder } = require('@discordjs/builders');
const {getPoints, addPoints, removePoints, getTop10} = require('../modules/pointsbackend.js');


exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
    await interaction.deferReply();
    let userPoints = await getPoints(interaction.user.id, interaction.guildId);
    if (userPoints === null) {
        await addPoints(interaction.user.id, 0, interaction.guildId);
        return interaction.editReply(`${interaction.user} has 0 points.`);
    }
    else {
        return interaction.editReply(`${interaction.user} has ${userPoints} points.`);
    }
};

  exports.commandData = new SlashCommandBuilder()
    .setName('points')
    .setDescription('displays your current points')
    .setDefaultPermission(true)
    .toJSON()

// Set this to false if you want it to be global.
exports.guildOnly = false;