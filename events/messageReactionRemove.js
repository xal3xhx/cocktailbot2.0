const logger = require("../modules/Logger.js");
const { getSettings } = require("../modules/functions.js");
const {checkRollReaction } = require("../modules/reactionbackend.js");

module.exports = async (client, reaction, user) => {
  const settings = await getSettings(reaction.message.guildId);
  if (user.bot) return;

  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.fetch();
    } catch (error) {
      logger.log(`something went wrong while trying to fetch the message!`, `error`)
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }


  // if checkReaction returns true set the users role to the role that is associated with the emoji
  const reactionrole = await checkRollReaction(reaction.emoji.name, reaction.message.guild.id, reaction.message.id);
  if (reactionrole) {
    var role = reaction.message.channel.guild.roles.cache.find(role => role.id === reactionrole)
    var member = reaction.message.channel.guild.members.cache.find(member => member.id === user.id)
    member.roles.remove(role).catch(logger.error);
  }

};