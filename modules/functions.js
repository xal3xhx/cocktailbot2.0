const logger = require("./Logger.js");
const config = require("../config.js");
const settings = require("./settings.js");
const { Collection } = require('discord.js');
const request = require('request');
const Promise = require('bluebird');
const url = require('url');

// makes a get request to the given url with the given data
async function get(options){
  return new Promise(function(resolve, reject) {
    request.get(options, function(error, response, body){
        if (!error && response.statusCode == 200) {
            resolve({response, body});
        } else {
            if (response) {
                // return a status code to help with diagnosing api failures
                reject({error, body, 'statusCode':response.statusCode});
            } else {
                reject({error, body});
            }
        }
    });
  });
}

// makes a post request to the given url with the given data
async function post(options) {
  return new Promise(function(resolve, reject) {
    request.post(options, function(error, response, body) {
        if (!error && response.statusCode < 300) resolve({error, response, body});
        else reject({error, body});
    });
  });
}

// generates a proprely formatted url
async function getURL(host, port, ssl, args) {
  return url.parse(`${(ssl === 'true') ? 'https://' : 'http://'}` +
        `${(host.match(/^http(s)?:\/\//)) ? host.split('//')[1] : host}` +
        `${(port) ? `:${port}` : ''}` +
        `${args}`).href;
}


async function replacePlaceholders(str, placerholders) {
  return str.replace(/%\w+%/g, (all) => {
    return placerholders[all] || all;
  }); 
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

module.exports = { get, post, getURL, getSettings, permlevel, awaitReply, toProperCase, fetchMore };