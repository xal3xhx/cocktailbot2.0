const logger = require("../modules/Logger.js");
const { permlevel, getSettings } = require("../modules/functions.js");
const { addMovie } = require("../modules/radarrapi.js");
const { codeBlock } = require("@discordjs/builders");
const { getPathByID } = require("../modules/embyapi.js");
const { VLC } = require('node-vlc-http');

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

module.exports = async (client, interaction) => {  
  if (interaction.isButton()) {
    const { container } = client;
    // get users permlevel
    const level = permlevel(interaction.member)
    const settings = await getSettings(interaction.guild);
    // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
    const myCommands = await interaction.guild ? container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level) :
      await container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);
    // Then we will filter the myCommands collection again to get the enabled commands.
    const enabledCommands = await myCommands.filter(cmd => cmd.conf.enabled);
    // Here we have to get the command names only, and we use that array to get the longest name.
    const commandNames = [...enabledCommands.keys()];

    // This make the help commands "aligned" in the output.
    const longest = await commandNames.reduce((long, str) => Math.max(long, str.length), 0);

  // get the commands for the category interaction.customid
    const commands = await enabledCommands.filter(cmd => cmd.help.category === interaction.customId);
    // get the description for the category interaction.customid
    // const description = await commands.reduce((desc, cmd) => desc + `${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}\n`, "");
    let output = "";

    commands.forEach( c => {
      output += `${settings.Prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });

    const helpMsg = `= ${interaction.customId} commands =\n\n`;
    const endMsg = `\n[Use ${settings.Prefix}help <commandname> for details]`;
    const finalstring = helpMsg + codeBlock("asciidoc", output) + endMsg;
    
    // edit the interaction with the new message
    // after 5 seconds, reset the interaction to the original message

    await interaction.deferUpdate();
    await interaction.editReply(finalstring);
    // await wait(5000);
    // await interaction.editReply(interaction.content);
  }  
  if (interaction.isCommand()) {
    // Grab the command data from the client.container.slashcmds Collection
    const cmd = client.container.slashcmds.get(interaction.commandName);
    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;
    // Run the command
    if(cmd.conf.GuildLock && interaction.guild.id !== cmd.conf.GuildLock){
      return interaction.reply(`This command is locked to the ${cmd.conf.GuildLock} guild.`);
    }
    try {
      await cmd.run(client, interaction);
      logger.log(`${interaction.user.id} ran slash command ${interaction.commandName}`, "cmd");

    } catch (e) {
      console.error(e);
      if (interaction.replied) 
        interaction.followUp({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
          .catch(e => console.error("An error occurred following up on an error", e));
      else 
      if (interaction.deferred)
        interaction.editReply({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
          .catch(e => console.error("An error occurred following up on an error", e));
      else 
        interaction.reply({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
          .catch(e => console.error("An error occurred replying on an error", e));
    }
  }
  if (interaction.isSelectMenu()) {
    if (interaction.customId === 'player') {
      if(parseInt(interaction.values[0]) === 0) return interaction.message.delete();
      let path = await getPathByID(interaction.values);
      path = path.replace('/Media/Movies Sorted/', '');
      path = `file:///z:/Movies Sorted/${path}`;

      await interaction.update({ content: `playing!`, components: [] });
      vlc.addToQueueAndPlay(path);
    }
    if (interaction.customId === 'select') {
      const data = JSON.parse(interaction.values)
      if(data === false) return interaction.message.delete();
      if(data.monitored == "true") return interaction.update({ content: `movie ***${data.title}*** already exists!`, components: [] });
      await interaction.update({ content: `movie ***${data.title}*** requested!`, components: [] });
      await addMovie(data);
    };
  }
};
