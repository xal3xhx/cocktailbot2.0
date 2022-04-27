const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { searchMovie } = require("../modules/radarrapi.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars

    // get the serach query
    const searchQuery = interaction.options._hoistedOptions[0].value;
    await interaction.deferReply();
    interaction.editReply(`Searching for ${searchQuery}`);
    const movies = await searchMovie(searchQuery);
    const menu = new MessageSelectMenu()
      .setCustomId('select')
      .setPlaceholder('Nothing selected')
      .addOptions({
        value: 'false',
        label: 'MOVIE NOT FOUND',
        description: 'choose this if your movie is not in the list',
      })
    // for each movie, add an option
    movies.forEach(movie => {
      menu.addOptions(
        {
          label: movie.title,
          description: `${movie.overview.substring(0, 95)}...`,
          value: `{ "id": "${movie.tmdbId}", "title": "${movie.title}","monitored": "${movie.monitored}" }`,
        }
      )
    });
    const row = new MessageActionRow()
			.addComponents(menu)
		await interaction.editReply({ content: 'please select a movie!', components: [row] });
  };

  exports.commandData = new SlashCommandBuilder()
    .setName('request')
    .setDescription('request a movie or tv show')
    .setDefaultPermission(true)
    .addSubcommand(subcommand =>
      subcommand
        .setName('movie')
        .setDescription('requests a movie')
        .addStringOption(option =>
          option
            .setName('query')
            .setDescription('the movie to request')
            .setRequired(true)))
    // .addSubcommand(subcommand =>
    //   subcommand
    //     .setName('series')
    //     .setDescription('requests a series')
    //     .addStringOption(option =>
    //       option
    //         .setName('query')
    //         .setDescription('the series to request')
    //         .setRequired(true)))
    .toJSON()

// Set this to false if you want it to be global.
  exports.guildOnly = true;