const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const { addQuote, removeQuote, getAllQuotes, getRandomQuote, getRandomQuoteFromUser } = require("../modules/quotesbackend.js");
const { getSettings } = require("../modules/functions.js");
const owoify = require('owoify-js').default

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
    const userID = interaction.options._hoistedOptions[0].value
    const user = await client.users.fetch(userID)
    const quote = `"${interaction.options._hoistedOptions[1].value}"`
    const settings = await getSettings(interaction.guild);
    const quote_id = await addQuote(userID, quote, interaction.guildId);
    const quoteChannel = interaction.guild.channels.cache.find(c => c.id === settings.QouteChannelID);
    
    const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`${user.username} said:`)
            .setDescription(quote)
            .setFooter(`Quote ID: ${quote_id}`);
        
        await interaction.reply({ content: 'Quote added!', ephemeral: true });
        return quoteChannel.send({ embeds: [embed] });
};

  exports.commandData = new SlashCommandBuilder()
    .setName('quote')
    .setDescription('manage quotes')
    .setDefaultPermission(true)
    .addSubcommand(subcommand =>
        subcommand
          .setName('add')
          .setDescription('add a new quote to the database')
          .addUserOption(option =>
            option
              .setName('user')
              .setDescription('the user to add the quote to')
              .setRequired(true))
          .addStringOption(option =>
            option
              .setName('quote')
              .setDescription('the quote to add')
              .setRequired(true)))
    .toJSON()

// Set this to false if you want it to be global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};