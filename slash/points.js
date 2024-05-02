const { SlashCommandBuilder } = require("discord.js");
const { getPoints, addPoints, removePoints, getTop10 } = require('../modules/pointsbackend.js');

exports.run = async (client, interaction) => {
    await interaction.deferReply();

    // Check if no options are provided, then display user's points
    if (!interaction.options._hoistedOptions || interaction.options._hoistedOptions.length === 0) {
        let userPoints = await getPoints(interaction.user.id, interaction.guildId);
        if (userPoints === null) {
            await addPoints(interaction.user.id, 0, interaction.guildId);
            return interaction.editReply(`${interaction.user} has 0 points.`);
        } else {
            return interaction.editReply(`${interaction.user} has ${userPoints} points.`);
        }
    }

    const subcommand = interaction.options._subcommand;

    if (subcommand === "add") {
        const user = interaction.options._hoistedOptions[0].user;
        const points = interaction.options._hoistedOptions[1].value;
        await addPoints(user.id, points, interaction.guildId);
        return interaction.editReply(`${points} points added to ${user}`);
    }

    if (subcommand === "remove") {
        const user = interaction.options._hoistedOptions[0].user;
        const points = interaction.options._hoistedOptions[1].value;
        await removePoints(user.id, points, interaction.guildId);
        return interaction.editReply(`${points} points removed from ${user}`);
    }

    if (subcommand === "top") {
        const top10 = await getTop10(interaction.guildId);
        let reply = "Top 10:\n";
        top10.forEach((user, index) => {
            reply += `${index + 1}. ${user.username} - ${user.points} points\n`;
        });
        return interaction.editReply(reply);
    }
};

exports.commandData = new SlashCommandBuilder()
    .setName('points')
    .setDescription('Lists or manages user points')

    // Add a manage group
    .addSubcommandGroup((group) =>
        group
            .setName('manage')
            .setDescription('Shows or manages points in the server')
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('user_points')
                    .setDescription("Alters a user's points")
                    .addUserOption((option) =>
                        option.setName('user').setDescription('The user whose points to alter').setRequired(true),
                    )
                    .addStringOption((option) =>
                        option
                            .setName('action')
                            .setDescription('What action should be taken with the users points?')
                            .addChoices(
                                { name: 'Add points', value: 'add' },
                                { name: 'Remove points', value: 'remove' },
                                { name: 'Reset points', value: 'reset' },
                            )
                            .setRequired(true),
                    )
                    .addIntegerOption((option) => option.setName('points').setDescription('Points to add or remove')),
            ),
    )

    // Add an information group
    .addSubcommandGroup((group) =>
        group
            .setName('info')
            .setDescription('Shows information about points in the guild')
            .addSubcommand((subcommand) =>
                subcommand.setName('total').setDescription('Tells you the total amount of points given in the guild'),
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('user')
                    .setDescription("Lists a user's points")
                    .addUserOption((option) =>
                        option.setName('user').setDescription('The user whose points to list').setRequired(true),
                    ),
            ),
        )
        .toJSON();

exports.conf = {
    permLevel: "User",
    guildOnly: false
};