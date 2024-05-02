// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note that there's no "checks" in this basic version - no config "types" like
// Role, String, Int, etc... It's basic, to be extended with your deft hands!

// Note the **destructuring** here. instead of `args` we have :
// [action, key, ...value]
// This gives us the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;
const { codeBlock } = require("@discordjs/builders");
const settings = require("../../modules/settings.js");
const { awaitReply } = require("../../modules/functions.js");

exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

  // Retrieve current guild settings (merged) and overrides only.
  const serverSettings = message.settings;
  const defaults = await settings.get("default");
  const overrides = await settings.get(message.guild.id);
  if (!await settings.has(message.guild.id)) await settings.set(message.guild.id, {});
  
  // Edit an existing key value
  if (action === "edit") {
    // User must specify a key.
    if (!key) return message.reply({ content: "Please specify a key to edit"});
    // User must specify a key that actually exists!
    if (!defaults[key]) return message.reply({ content: "This key does not exist in the settings"});
    const joinedValue = value.join(" ");
    // User must specify a value to change.
    if (joinedValue.length < 1) return message.reply({ content: "Please specify a new value"});
    // User must specify a different value than the current one.
    if (joinedValue === serverSettings[key]) return message.reply({ content: "This setting already has that value!"});
    
    // get the current settings for the guild
    const currentSettings = await settings.ensure(message.guild.id, defaults);
    // replace the value at the key
    console.log(key);
    console.log(joinedValue);
    currentSettings[key] = joinedValue;
    // set the new settings for the guild
    // console.log(JSON.stringify(currentSettings));
    await settings.set(message.guild.id, JSON.stringify(currentSettings));

    

    // Confirm everything is fine!
    message.reply({ content: `${key} successfully edited to ${joinedValue}`});
  } else
  
  // Resets a key to the default value
  if (action === "del" || action === "reset") {
    if (!key) return message.reply({ content: "Please specify a key to reset."});
    if (!defaults[key]) return message.reply({ content: "This key does not exist in the settings"});
    if (!overrides[key]) return message.reply({ content: "This key does not have an override and is already using defaults."});
    
    // Good demonstration of the custom awaitReply method in `./modules/functions.js` !
    const response = await awaitReply(message, `Are you sure you want to reset ${key} to the default value?`);

    // If they respond with y or yes, continue.
    if (["y", "yes"].includes(response.toLowerCase())) {
      // We delete the `key` here.
      await settings.delete(message.guild.id, key);
      message.reply({ content: `${key} was successfully reset to default.`});
    } else
    // If they respond with n or no, we inform them that the action has been cancelled.
    if (["n","no","cancel"].includes(response)) {
      message.reply({ content: `Your setting for \`${key}\` remains at \`${serverSettings[key]}\``});
    }
  } else
  
  if (action === "get") {
    if (!key) return message.reply({ content: "Please specify a key to view"});
    if (!defaults[key]) return message.reply({ content: "This key does not exist in the settings"});
    const isDefault = !overrides[key] ? "\nThis is the default global default value." : "";
    message.reply({ content: `The value of ${key} is currently ${serverSettings[key]}${isDefault}`});
  } else {
    // Otherwise, the default action is to return the whole configuration;
    const array = [];
    Object.entries(serverSettings).forEach(([key, value]) => {
      array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`); 
    });
    await message.channel.send(codeBlock("asciidoc", `= Current Guild Settings =
${array.join("\n")}`));    
  }
};

exports.conf = {
  enabled: false,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "set",
  category: "System",
  description: "View or change settings for your server.",
  usage: `
    set view <key> - View the current value of a setting.
    set edit <key> <value> - Change the value of a setting.
    set del <key> - Delete a setting, reverting it to the default.
  `
};
