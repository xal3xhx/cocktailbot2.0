// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");
require("dotenv").config();

// Load up the discord.js library
const { Client, Collection } = require("discord.js");
// We also load the rest of the things we need in this file:
const { readdirSync, statSync } = require("fs");
const path = require("path")
const { intents, partials, permLevels } = require("./config.js");
const logger = require("./modules/Logger.js");
const { counterCheker, pingCollector } = require("./Stats/Pusher.js");
// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're referring to. Your client.
const client = new Client({ intents, partials });
// const { Player } = require("discord-music-player");

// const player = new Player(client);
// client.player = player;



// Aliases, commands and slash commands are put in collections where they can be
// read from, catalogued, listed, etc.
const commands = new Collection();
const aliases = new Collection();
const slashcmds = new Collection();

require("./Stats/Pusher.js");
// Generate a cache of client permissions for pretty perm names in commands.
const levelCache = {};
for (let i = 0; i < permLevels.length; i++) {
  const thisLevel = permLevels[i];
  levelCache[thisLevel.name] = thisLevel.level;
}

// To reduce client pollution we'll create a single container property
// that we can attach everything we need to.
client.container = {
  voice_time: new Map(),
  stream_time: new Map(),
  commands,
  aliases,
  slashcmds,
  levelCache
};

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {

  // will scan through and get the path for each file in sub folders as well as the main
  const getAllFiles = function(dirPath, arrayOfFiles) {
  files = readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })
  return arrayOfFiles
}

  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  const commands = getAllFiles("./commands").filter(file => file.endsWith(".js"));
  for (const file of commands) {
    const props = require(`./${file}`);
    logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
    client.container.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.container.aliases.set(alias, props.help.name);
    });
  }

  // Now we load any **slash** commands you may have in the ./slash directory.
  const slashFiles = readdirSync("./slash").filter(file => file.endsWith(".js"));
  for (const file of slashFiles) {
    const command = require(`./slash/${file}`);
    const commandName = file.split(".")[0];
    logger.log(`Loading Slash command: ${commandName}. 👌`, "log");
    
    // Now set the name of the command with it's properties.
    client.container.slashcmds.set(command.commandData.name, command);
  }

  // Then we load events, which will include our message and ready event.
  const eventFiles = readdirSync("./events/").filter(file => file.endsWith(".js"));
  for (const file of eventFiles) {
    const eventName = file.split(".")[0];
    logger.log(`Loading Event: ${eventName}. 👌`, "log");
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event. 
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
  }

  // every 10 seconds, get the websocket ping and rest ping and send it to the pusher
  setInterval(() => {
    pingCollector(client.ws.ping, 999);
    counterCheker(client);
  }, 1000);

  // every friday at 1200 run the command dabdrawing
  const schedule = require('node-schedule');
  schedule.scheduleJob('0 12 * * 5', () => {
    // create a variable that fakes a message sent from the guild 823247015206846494
    const demo = {
      settings: {
          Prefix: '~',
          CocktailChannelID: '840334813906337882',
          HornyjailChannelID: '841058244075192330',
          EventChannelID: '824742922641473587',
          tokensChannelID: '922645027736395857',
          rewardChannelID: '922645050243027054',
          QouteChannelID: '953682835053633626',
          WelcomeChannelID: '840331748093329408',
          VictumRoleID: '852660279544381480',
          BonkerRoleID: '841066087772323851',
          PartyPlannerRoleID: '825065786199769119',
          WelcomeMessage: 'Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D',
          PointsName: 'points',
          WelcomeEnabled: 'false',
          BonkEnabled: 'true',
          PointsEnabled: 'true'
        },
      guild: client.guilds.cache.get('823247015206846494')
    };
    client.container.commands.get("dabvictum").run(client, demo)
  });

  // Threads are currently in BETA.
  // This event will fire when a thread is created, if you want to expand
  // the logic, throw this in it's own event file like the rest.
  client.on("threadCreate", (thread) => thread.join());

  // Here we login the client.
  client.login();

// End top-level async/await function.
};

init();
