const {getRewards, addReward, removeReward} = require('../../modules/rewardsbackend.js');
const {addRewardReaction, removeRewardReaction} = require('../../modules/reactionbackend.js');

exports.run = async (client, message, args, level) => {
    await message.guild.members.fetch()
    if (message.settings.PointsEnabled === false) return await message.channel.send(`${message.author}, points are disabled on this server.`);


    // if args[0] is generate, send a separate message for each reward and add a reaction to each message
    if (args[0] === 'generate') {
        // get all rewards for the server
        var rewards = await getRewards(message.guild.id);
        if (rewards.length === 0) return await message.channel.send(`${message.author}, there are no rewards for this server.`);

        // loop through each reward
        for (var i = 0; i < rewards.length; i++) {
            // create a string of the cost and reward
            var cost = rewards[i].cost;
            var reward = rewards[i].reward;
            var rewardString = '';
            rewardString = `${cost} points for: **${reward}**`;

            // send a message with the cost and reward
            var rewardmessage = await message.channel.send(rewardString);

            // add a reaction to database
            await addRewardReaction(reward, message.guild.id, rewardmessage.id);

            // add a checkmark reaction to the message
            await rewardmessage.react('✅');
        }
        // remove original message
        await message.delete();
    }
    

    // if args[0] is add
    // - add the reward to the database
    // - send a message with the cost and reward
    // - add a reaction to the message
    // args[1] is the cost
    // args[2] is the reward
    // args[2] is a sentence
    if (args[0] === 'add') {
        // check if args[1] is a number
        if (isNaN(args[1])) return await message.channel.send(`${message.author}, the cost must be a number.`);
        if (!args[1]) return await message.channel.send(`${message.author}, please enter a cost.`);
        if (!args[2]) return await message.channel.send(`${message.author}, please enter a reward.`);

        // add the reward to the database
        var reward = args.slice(2).join(' ');
        var cost = args[1];
        var server_id = message.guild.id;
        await addReward(cost, server_id, `"${reward}"`);

        // create a string of the cost and reward
        var rewardString = '';
        if (reward) rewardString = `${cost} points for: **${reward}**`;
        else rewardString = `${cost} points`;

        // send a message with the cost and reward
        var rewardmessage = await message.channel.send(rewardString);

        // add a reaction to database
        await addRewardReaction(reward, message.guild.id, rewardmessage.id);

        // add a checkmark reaction to the message
        await rewardmessage.react('✅');

        // remove original message
        await message.delete();
    }

    // if args[0] is remove
    // - remove the reward from the database
    // - remove the reaction from the database
    // - remove the message from the channel
    if (args[0] === 'remove') {
        if (!args[1]) return message.channel.send(`${message.author}, please enter a reward.`);

        // remove the reward from the database
        var reward = args.slice(1).join(' ');
        var server_id = message.guild.id;
        var messageid = await getRewards(server_id, reward);
        await removeReward(reward, server_id);
        await removeRewardReaction(reward, server_id);

        // remove the messageid
        var messageToDelete = await message.channel.messages.fetch(messageid);
        await messageToDelete.delete();

        // remove original message
        await message.delete();
    }
}

        
    

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Server Owner"
  };
  
  exports.help = {
    name: "rewards",
    category: "Points",
    description: "redeem points for rewards",
    usage: "rewards [add/remove/generate]"
  };
  