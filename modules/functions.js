const Discord = require('discord.js');

module.exports = (client) => {

  /*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!

  */
  client.permlevel = message => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };
  
  // THIS IS HERE BECAUSE SOME PEOPLE DELETE ALL THE GUILD SETTINGS
  // And then they're stuck because the default settings are also gone.
  // So if you do that, you're resetting your defaults. Congrats.
  const defaultSettings = {
    "prefix": "#",
    "cocktailchannelID": "840334813906337882" 
	};

  // getSettings merges the client defaults with the guild settings. guild settings in
  // enmap should only have *unique* overrides that are different from defaults.
  client.getSettings = (guild) => {
    client.settings.ensure("default", defaultSettings);
    if(!guild) return client.settings.get("default");
    const guildConf = client.settings.get(guild.id) || {};
    // This "..." thing is the "Spread Operator". It's awesome!
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    return ({...client.settings.get("default"), ...guildConf});
  };


  client.randomdrink = async (server_id) => {
       return new Promise( (resolve,reject) => {
    var result = client.connection.query(`SELECT * FROM cocktails WHERE server_id = ${server_id} ORDER BY RAND() limit 1`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results[0]);
   })
  })
};

client.randomdrinkany = async () => {
       return new Promise( (resolve,reject) => {
    var result = client.connection.query(`SELECT * FROM cocktails ORDER BY RAND() limit 1`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results[0]);
   })
  })
};

client.fetchalldrinks = async (server_id) => {
       return new Promise( (resolve,reject) => {
    var result = client.connection.query(`SELECT * FROM cocktails WHERE server_id = ${server_id}`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

client.fetchalldrinksany = async () => {
       return new Promise( (resolve,reject) => {
    var result = client.connection.query(`SELECT * FROM cocktails`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

client.topdrinks = async (server_id) => {
       return new Promise( (resolve,reject) => {
    var result = client.connection.query(`select * from cocktails where server_id = ${server_id} ORDER BY up_vote DESC limit 3`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

client.topdrinksany = async () => {
       return new Promise( (resolve,reject) => {
    var result = client.connection.query(`select * from cocktails ORDER BY up_vote DESC limit 3`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

client.updateMessageID = async (oldid, newid, server_id) => {
       return new Promise( (resolve,reject) => {
    var result = client.connection.query(`UPDATE cocktails set message_id = ${newid} where message_id = ${oldid} and server_id = ${server_id}`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

client.getUpvotes = async (messageid, server_id) => {
       return new Promise( (resolve,reject) => {
    var result = client.connection.query(`select up_vote from cocktails where message_id = ${messageid} AND server_id = ${server_id} limit 1`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

client.getDownvotes = async (messageid, server_id) => {
       return new Promise( (resolve,reject) => {
    var result = client.connection.query(`select downvote from cocktails where message_id = ${messageid} AND server_id = ${server_id} limit 1`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

client.updateUpVote = async (newval, messageid, server_id) => {
       return new Promise( (resolve,reject) => {
    var result = client.connection.query(`UPDATE cocktails set up_vote = ${newval} where message_id = ${messageid} and server_id = ${server_id}`,(err, results, fields) =>{
      if(err){ 
        reject(err);
      }
      resolve(results);
   })
  })
};

client.updateDownVote = async (newval, messageid, server_id) => {
       return new Promise( (resolve,reject) => {
    var result = client.connection.query(`UPDATE cocktails set downvote = ${newval} where message_id = ${messageid} and server_id = ${server_id}`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

client.addDrink = async (name,description,image,ingredients,instructions,author,messageid,server_id) => {
      return new Promise( (resolve,reject) => {
      var result = client.connection.query(`INSERT INTO cocktails(name, discription, image, ingredients, instructions, author, up_vote, downvote, message_id, server_id) VALUES ("${name}", "${description}", "${image}", '${ingredients}', "${instructions}", "${author}", '0', '0', "${messageid}", "${server_id}")`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};



  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

  */
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    test = await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      test.delete();
      console.log(collected)
      collected.first().delete();
      if(collected.first().attachments.first()) return collected.first().attachments.first();
      else return collected.first().content; 
    } catch (e) {
      return false;
    }
  };


  /*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, {depth: 1});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  client.loadCommand = (commandName) => {
    try {
      client.logger.log(`Loading Command: ${commandName}`);
      const props = require(`../commands/${commandName}`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
    
    if (command.shutdown) {
      await command.shutdown(client);
    }
    const mod = require.cache[require.resolve(`../commands/${command.help.name}`)];
    delete require.cache[require.resolve(`../commands/${command.help.name}.js`)];
    for (let i = 0; i < mod.parent.children.length; i++) {
      if (mod.parent.children[i] === mod) {
        mod.parent.children.splice(i, 1);
        break;
      }
    }
    return false;
  };

  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */
  
  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
  // are, we feel, very useful in code. 
  
  // <String>.toPropercase() returns a proper-cased string such as: 
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  Object.defineProperty(String.prototype, "toProperCase", {
    value: function() {
      return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
  });

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Object.defineProperty(Array.prototype, "random", {
    value: function() {
      return this[Math.floor(Math.random() * this.length)];
    }
  });

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);

  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    console.error(err);
    // Always best practice to let the code crash on uncaught exceptions. 
    // Because you should be catching them anyway.
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    client.logger.error(`Unhandled rejection: ${err}`);
    console.error(err);
  });
};
