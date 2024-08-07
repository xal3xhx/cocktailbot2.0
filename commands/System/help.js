const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const logger = require("../../modules/Logger.js");

exports.run = async (client, message, args, level) => {
  // Grab the container from the client to reduce line length.
  const { container } = client;

  // If no specific command is called, show all filtered commands.
  if (!args[0]) {
    // Load guild settings (for prefixes and eventually per-guild tweaks)
    const settings = message.settings;
      
    // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
    const myCommands = message.guild ? container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level) :
      container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);
    
    // Then we will filter the myCommands collection again to get the enabled commands.
    const enabledCommands = myCommands.filter(cmd => cmd.conf.enabled);

    // Here we have to get the command names only, and we use that array to get the longest name.
    const commandNames = [...enabledCommands.keys()];

    // This make the help commands "aligned" in the output.
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = `= Command List =\n[Use ${settings.Prefix}help <commandname> for details]\n`;
    const sorted = enabledCommands.sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );

      // create a discord message row
    const messageActionRow1 = new ActionRowBuilder()
	  const messageActionRow2 = new ActionRowBuilder()
	  const messageActionRow3 = new ActionRowBuilder()


      // loop through the sorted commands and print out the categorie name
      let count = 0;
      sorted.forEach(c => {
        // incrment a counter
		// console.log(count);
        if (currentCategory !== c.help.category) {
          currentCategory = c.help.category;
		  count += 1;
          // create a disocrd message button with the category name
		  // if count is 1-5, add to the first row
		  if (count <= 5) {
			//   console.log(currentCategory);
			messageActionRow1.addComponents(
				new ButtonBuilder()
				  .setCustomId(c.help.category)
				  .setLabel(c.help.category)
				  .setStyle(ButtonStyle.Primary),
			  );
		  }
		  // if count is 6-10, add to the second row
		  else if (count > 5 && count <= 10) {
			messageActionRow2.addComponents(
				new ButtonBuilder()
				  .setCustomId(c.help.category)
				  .setLabel(c.help.category)
				  .setStyle(ButtonStyle.Primary),
			  );
		  }
		  // if count is 11-15, add to the third row
		  else if (count > 10 && count <= 15) {
			messageActionRow3.addComponents(
				new ButtonBuilder()
				  .setCustomId(c.help.category)
				  .setLabel(c.help.category)
				  .setStyle(ButtonStyle.Primary),
			  );
		  }  
      }
    });
    // send the message action row with the text "Help Menu"
	if(messageActionRow1.components.length && messageActionRow2.components.length && messageActionRow3.components.length) {
	message.reply({ content: 'Help Menu!', components: [messageActionRow1, messageActionRow2, messageActionRow3] });
	}
	else if(messageActionRow1.components.length && messageActionRow2.components.length) {
	message.reply({ content: 'Help Menu!', components: [messageActionRow1, messageActionRow2] });
	}
	else if(messageActionRow1.components.length) {
	message.reply({ content: 'Help Menu!', components: [messageActionRow1] });
	}
	else {
	message.reply({ content: 'Help Menu!', components: [messageActionRow1] });
	}
}
  // if a specific command is called, show that command's help.
  else {
	let command = args[0];
	    // Check if the command, or alias, exist in the collections.
    if (!(container.commands.has(command) || container.aliases.has(command))) {
      return message.reply('That command does not exist!');
    }

    // Load the command again, since it may have changed while awaiting a message.
    const thisCommand = container.commands.get(command) || container.aliases.get(command);

    // Create a better embed for the command help.
    const embed = new EmbedBuilder()
      .setTitle(`Help for: ${thisCommand.help.name}`)
      .setColor(0x00AE86)
      .addFields([
        {name: 'Description', value: thisCommand.help.description, inline: true },
        {name: 'Usage', value: thisCommand.help.usage, inline: true },
        {name: 'Aliases', value: thisCommand.conf.aliases.join(', ') || 'None', inline: true },
        {name: 'Permission Level', value: thisCommand.conf.permLevel, inline: true }
      ]);

    // send the message action row with the text "Help Menu"
	message.reply({ content: 'Help Menu!', embeds: [embed] });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};