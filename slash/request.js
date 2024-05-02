const { SlashCommandBuilder } = require("discord.js");
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
      let val = `{ "id": "${movie.tmdbId}", "title": "${movie.title}","monitored": "${movie.monitored}" }`
      if(val.length > 100) {
        length = val.length
        let title = movie.title
        title = title.substring(0, title.length - (length - 100) - 3) + '...'
        val = `{ "id": "${movie.tmdbId}", "title": "${title}","monitored": "${movie.monitored}" }`
      }
      menu.addOptions(
        {
          label: movie.title,
          description: `${movie.overview.substring(0, 95)}...`,
          value: val,
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
    .toJSON()

// Set this to false if you want it to be global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};