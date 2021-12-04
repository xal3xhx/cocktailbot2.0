const logger = require("../modules/Logger.js");
const { getSettings } = require("../modules/functions.js");
module.exports = async (client, reaction, user) => {
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
  const settings = getSettings(reaction.message.guildId);

  // if(reaction.message.channel.id === settings.cocktailchannelID) await cocktail_reaction_remove(settings, reaction, user);
  if(reaction.message.id === settings.VictumMessageID) await victum_reaction_remove(settings, reaction, user);
  if(reaction.message.id === settings.MovieMessageID) await movie_reaction_remove(settings, reaction, user);
  logger.log(`user: ${user.username} reacted to a message with the emoji ${reaction._emoji.name}`)
  }


  async function movie_reaction_remove(settings, reaction, userr) {
    if(reaction._emoji.name == "🎥") {
      var role = reaction.message.channel.guild.roles.cache.find(role => role.id === settings.MovieRoleID)
      var member = reaction.message.channel.guild.members.cache.find(user => user.id === userr.id)
      member.roles.remove(role).catch(logger.error);
    }
  }

  async function victum_reaction_remove(settings, reaction, userr) {
    if(reaction._emoji.name == "👀") {
      var role = reaction.message.channel.guild.roles.cache.find(role => role.id === settings.VictumRoleID)
      var member = reaction.message.channel.guild.members.cache.find(user => user.id === userr.id)
      member.roles.remove(role).catch(logger.error); 
    }
  }

  async function cocktail_reaction_remove(settings, reaction, userr) {
    if(reaction._emoji.name == "👍") {
      upvotes = await client.getUpvotes(reaction.message.id, reaction.message.channel.guild.id)
      if(!upvotes[0]) return;
      await client.updateUpVote(upvotes[0].up_vote - 1, reaction.message.id, reaction.message.channel.guild.id)
    }
    if(reaction._emoji.name == "👎") {
      downvotes = await client.getDownvotes(reaction.message.id, reaction.message.channel.guild.id)
      if(!downvotes[0]) return;
      await client.updateDownVote(downvotes[0].downvote - 1, reaction.message.id, reaction.message.channel.guild.id)
    }
  }