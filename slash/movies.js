const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { searchMovie } = require("../modules/embyapi.js");
const { VLC } = require('node-vlc-http');

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars

    const host = process.env.VLC_HOST;
    const port = process.env.VLC_PORT;
    const username = process.env.VLC_USERNAME;
    const password = process.env.VLC_PASSWORD;

    const vlc = new VLC({
        host: host,
        port: port,
        username: '',
        password: password
        });

    // get the sub command
    const subCommand = interaction.options._subcommand;
    await interaction.deferReply();
    if(subCommand === "play"){
        await interaction.editReply(`resuming playback`);
        return await vlc.resume();
    }
    else if(subCommand === "pause"){
        await interaction.editReply(`pausing playback`);
        return await vlc.stop();
        }
    else if(subCommand === "search"){
        // get the serach query
        const searchQuery = interaction.options._hoistedOptions[0].value;

        const menu = new MessageSelectMenu()
        .setCustomId('player')
        .setPlaceholder('Nothing selected')
        .addOptions({
            value: '0',
            label: 'MOVIE NOT FOUND',
            description: 'choose this if your movie is not in the list',
        })

        // search movies
        const movies = await searchMovie(searchQuery);
        for (key in movies) {
            const name = movies[key]["Name"];
            const id = movies[key]["Id"];
            // let path = await getPathByID(id);
            // path = path.replace('/Media/Movies Sorted/', '');
            console.log(`${key} - ${name} - ${id}`);
            menu.addOptions(
                {
                    label: name,
                    description: '',
                    value: String(id)
                    });
        }
    const row = new MessageActionRow()
		.addComponents(menu)
	await interaction.editReply({ content: 'please select a movie!', components: [row] });
    }
    else {
        console.log(`unknown`);
        return;
    }
};

  exports.commandData = new SlashCommandBuilder()
    .setName('movie')
    .setDescription('controls the movie player!')
    .setDefaultPermission(true)
    .addSubcommand(subcommand =>
        subcommand
          .setName('play')
          .setDescription('resumes the movie'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('pause')
            .setDescription('pauses the movie'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('search')
        .setDescription('search for a movie to play')
        .addStringOption(option =>
          option
            .setName('query')
            .setDescription('the movie to search')
            .setRequired(true)))
    .toJSON()

// Set this to false if you want it to be global.
exports.guildOnly = false;