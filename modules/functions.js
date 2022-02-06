const logger = require("./Logger.js");
const config = require("../config.js");
const settings = require("./settings.js");
const { codeBlock } = require("@discordjs/builders");
const { Collection } = require('discord.js');
const wait = require('util').promisify(setTimeout);

// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.


// Button interaction handler
// used to edit interaction with the correct help commands
async function buttonHandler(client, interaction) {
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
/*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!

  */
function permlevel(message) {
  let permlvl = 0;

  const permOrder = config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

  while (permOrder.length) {
    const currentLevel = permOrder.shift();
    if (message.guild && currentLevel.guildOnly) continue;
    if (currentLevel.check(message)) {
      permlvl = currentLevel.level;
      break;
    }
  }
  return permlvl;
}

/*
  GUILD SETTINGS FUNCTION

  This function merges the default settings (from config.defaultSettings) with any
  guild override you might have for particular guild. If no overrides are present,
  the default settings are used.

*/

async function getSettings(guild) {
  // console.log(`Fetching settings for ${guild}`);
  if (guild.id) {
    const guildConf = await settings.get(guild.id).then(results =>{return results}).catch(error => {logger.error(error)});
    await settings.ensure(guild.id, JSON.stringify(config.defaultSettings));
    return await guildConf;
  }
  else {
    const dbdefaults = await settings.get("default").then(results =>{return results}).catch(error => {logger.error(error)});
    return await dbdefaults;
  }
}

/*
  SINGLE-LINE AWAIT MESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

*/
async function awaitReply(msg, question, limit = 60000) {
  const filter = m => m.author.id === msg.author.id;
  await msg.channel.send(question);
  try {
    const collected = await msg.channel.awaitMessages({ filter, max: 1, time: limit, errors: ["time"] });
    return collected.first().content;
  } catch (e) {
    return false;
  }
}

// fetches as many message as you want form a given channel
// will lag if you try to fetch more than 100 messages
async function fetchMore(channel, limit = 1000) {
  if (!channel) {
    throw new Error(`Expected channel, got ${typeof channel}.`);
  }
  if (limit <= 100) {
    return channel.messages.fetch({ limit });
  }

  let collection = new Collection();
  let lastId = null;
  let options = {};
  let remaining = limit;

  while (remaining > 0) {
    options.limit = remaining > 100 ? 100 : remaining;
    remaining = remaining > 100 ? remaining - 100 : 0;

    if (lastId) {
      options.before = lastId;
    }

    let messages = await channel.messages.fetch(options);

    if (!messages.last()) {
      break;
    }

    collection = collection.concat(messages);
    lastId = messages.last().id;
  }

  return collection;
}

/* MISCELLANEOUS NON-CRITICAL FUNCTIONS */
  
// EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
// later, this conflicts with native code. Also, if some other lib you use does
// this, a conflict also occurs. KNOWING THIS however, the following 2 methods
// are, we feel, very useful in code. 
  
// toProperCase(String) returns a proper-cased string such as: 
// toProperCase("Mary had a little lamb") returns "Mary Had A Little Lamb"
function toProperCase(string) {
  return string.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  logger.error(`Uncaught Exception: ${errorMsg}`);
  console.error(err);
  // Always best practice to let the code crash on uncaught exceptions. 
  // Because you should be catching them anyway.
  process.exit(1);
});

process.on("unhandledRejection", err => {
  logger.error(`Unhandled rejection: ${err}`);
  console.error(err);
});

module.exports = { getSettings, permlevel, awaitReply, toProperCase, buttonHandler, fetchMore };