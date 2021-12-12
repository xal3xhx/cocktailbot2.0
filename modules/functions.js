const logger = require("./Logger.js");
const config = require("../config.js");
const settings = require("./settings.js");
// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.
const mysql = require('mysql2');

// get mysql db info
connection = mysql.createConnection({
  host     : process.env.sql_host,
  user     : process.env.sql_user,
  password : process.env.sql_password,
  database : process.env.sql_database,
  insecureAuth : true,
  multipleStatements: true
});

// connect to db
connection.connect();

async function randomdrink(server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`SELECT * FROM cocktails WHERE server_id = ${server_id} ORDER BY RAND() limit 1`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results[0]);
   })
  })
};

async function randomdrinkany() {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`SELECT * FROM cocktails ORDER BY RAND() limit 1`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results[0]);
   })
  })
};

async function fetchalldrinks(server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`SELECT * FROM cocktails WHERE server_id = ${server_id}`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function fetchalldrinksany() {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`SELECT * FROM cocktails`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function topdrinks(server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`select * from cocktails where server_id = ${server_id} ORDER BY up_vote DESC limit 3`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function topdrinksany() {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`select * from cocktails ORDER BY up_vote DESC limit 3`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function updateMessageID(oldid, newid, server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`UPDATE cocktails set message_id = ${newid} where message_id = ${oldid} and server_id = ${server_id}`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function getUpvotes(messageid, server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`select up_vote from cocktails where message_id = ${messageid} AND server_id = ${server_id} limit 1`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function getDownvotes(messageid, server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`select downvote from cocktails where message_id = ${messageid} AND server_id = ${server_id} limit 1`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function updateUpVote(newval, messageid, server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`UPDATE cocktails set up_vote = ${newval} where message_id = ${messageid} and server_id = ${server_id}`,(err, results, fields) =>{
      if(err){ 
        reject(err);
      }
      resolve(results);
   })
  })
};

async function updateDownVote(newval, messageid, server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`UPDATE cocktails set downvote = ${newval} where message_id = ${messageid} and server_id = ${server_id}`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function addDrink(name,description,image,ingredients,instructions,author,messageid,server_id) {
      return new Promise( (resolve,reject) => {
      var result = connection.query(`INSERT INTO cocktails(name, discription, image, ingredients, instructions, author, up_vote, downvote, message_id, server_id) VALUES ("${name}", "${description}", "${image}", '${ingredients}', "${instructions}", "${author}", '0', '0', "${messageid}", "${server_id}")`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};




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
  const defaults = JSON.stringify(config.defaultSettings);
  const dbdefaults = await settings.get("default").then(results =>{return results}).catch(error => {logger.error(error)});
  const guildConf = await settings.get(guild.id).then(results =>{return results}).catch(error => {logger.error(error)});
  if(guild.id) await settings.ensure(guild.id, defaults);
  if (!guild.id) return await JSON.parse(JSON.parse(JSON.stringify(dbdefaults.settings)));
  else return await JSON.parse(JSON.parse(JSON.stringify(guildConf.settings)));
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


/* MISCELLANEOUS NON-CRITICAL FUNCTIONS */
  
// EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
// later, this conflicts with native code. Also, if some other lib you use does
// this, a conflict also occurs. KNOWING THIS however, the following 2 methods
// are, we feel, very useful in code. 
  
// <String>.toProperCase() returns a proper-cased string such as: 
// "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
Object.defineProperty(String.prototype, "toProperCase", {
  value: function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
});

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

module.exports = { getSettings, permlevel, awaitReply, randomdrink, randomdrinkany, fetchalldrinks, fetchalldrinksany, topdrinks, topdrinksany, updateMessageID, getUpvotes, getDownvotes, updateUpVote, updateDownVote, addDrink };