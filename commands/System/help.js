const { MessageActionRow, MessageButton } = require('discord.js');

exports.run = (client, message, args, level) => {
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
    const messageActionRow1 = new MessageActionRow()
	const messageActionRow2 = new MessageActionRow()
	const messageActionRow3 = new MessageActionRow()


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
				new MessageButton()
				  .setCustomId(c.help.category)
				  .setLabel(c.help.category)
				  .setStyle('PRIMARY'),
			  );
		  }
		  // if count is 6-10, add to the second row
		  else if (count > 5 && count <= 10) {
			messageActionRow2.addComponents(
				new MessageButton()
				  .setCustomId(c.help.category)
				  .setLabel(c.help.category)
				  .setStyle('PRIMARY'),
			  );
		  }
		  // if count is 11-15, add to the third row
		  else if (count > 10 && count <= 15) {
			messageActionRow3.addComponents(
				new MessageButton()
				  .setCustomId(c.help.category)
				  .setLabel(c.help.category)
				  .setStyle('PRIMARY'),
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
}};

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