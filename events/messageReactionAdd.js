const logger = require("../modules/Logger.js");
const { getSettings } = require("../modules/functions.js");
const {getReward} = require('../modules/rewardsbackend.js');
const { addRollReaction, removeRollReaction, checkRollReaction, addRewardReaction, removeRewardReaction, getRewardReaction, getAllRewardReactions } = require("../modules/reactionbackend.js");
const {getPoints, removePoints } = require("../modules/pointsbackend.js");
const { reactionCollector } = require('../Stats/Pusher.js')

module.exports = async (client, reaction, user) => {
  const settings = await getSettings(reaction.message.guild);
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




 await reactionCollector(reaction, user);

  // if checkReaction returns true set the users role to the role that is associated with the emoji
  const reactionrole = await checkRollReaction(reaction.emoji.name, reaction.message.guild.id, reaction.message.id);
  if (reactionrole) {
    var role = reaction.message.channel.guild.roles.cache.find(role => role.id === reactionrole)
    var member = reaction.message.channel.guild.members.cache.find(member => member.id === user.id)
    member.roles.add(role).catch(logger.error);
  }

  // if checkRewardReaction returns true send a message to settings.tokenChannel saying the user, has redeemed the reward
  // if the emoji not a checkmark, return
  if (reaction.emoji.name === "✅") {
    const reward = await getRewardReaction(reaction.message.id, reaction.message.guild.id);
    if (reward) {
      // remove the reaction
      reaction.users.remove(user);
      const rewardData = await getReward(reward.reward_id, reaction.message.guild.id);
      const points = await getPoints(user.id, reaction.message.guild.id);

      if (points >= rewardData.cost) {
        await removePoints(user.id, rewardData.cost, reaction.message.guild.id);
        const tokenChannel = await reaction.message.guild.channels.cache.find(channel => channel.id === settings.tokensChannelID);
        if (tokenChannel) {
          tokenChannel.send(`${user} has redeemed **${rewardData.reward}** for ${rewardData.cost} points!`);
        }
      } else {
        // send a message to the token channel
        const tokenChannel = await reaction.message.guild.channels.cache.find(channel => channel.id === settings.tokensChannelID);
        if (tokenChannel) {
          let tokenmessage = await tokenChannel.send(`${user} tried to redeem **${rewardData.reward}** but did not have enough points!`);
          // remove the message after 5 seconds
          setTimeout(() => {
            tokenmessage.delete();
          }, 5000);
        }
      }
    }
  }


};