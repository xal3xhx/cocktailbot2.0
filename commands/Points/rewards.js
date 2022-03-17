const { addReward, removeReward, getAllRewards } = require('../../modules/rewardsbackend.js');
const { addRewardReaction, removeRewardReaction, getRewardByID } = require('../../modules/reactionbackend.js');
const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
    await message.guild.members.fetch()
    if (message.settings.PointsEnabled === false) return message.channel.send(`${message.author}, The points system is disabled on this server.`);
    let pointsname = message.settings.PointsName;

    // if args[0] is generate, send a separate message for each reward and add a reaction to each message
    if (args[0] === 'generate') {
        // get all rewards for the server
        var rewards = await getAllRewards(message.guild.id);
        if (rewards.length === 0) return await message.channel.send(`${message.author}, there are no rewards for this server.`);

        // loop through each reward
        for (var i = 0; i < rewards.length; i++) {
            // create a string of the cost and reward
            var reward_id = rewards[i].reward_id;
            var cost = rewards[i].cost;
            var reward = rewards[i].reward;
            var rewardString = '';
            rewardString = `${cost} ${pointsname} for: **${reward}**`;

            // send a message with the cost and reward
            var rewardmessage = await message.channel.send(rewardString);

            // add a reaction to database
            await addRewardReaction(reward_id, message.guild.id, rewardmessage.id);

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
        var reward_id = await addReward(cost, reward, server_id);

        // create an embed
        var embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(reward)
            .setDescription(`*${cost} ${pointsname}*`)
            .setFooter(`UID: ${reward_id}`);
        
        // send a message to the rewards chat with the cost and reward
        var rewardmessage = await message.channel.send({ embeds: [embed] });

        // add a reaction to database
        await addRewardReaction(reward_id, message.guild.id, rewardmessage.id);

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
        var reward_id = args.slice(1).join(' ');
        var server_id = message.guild.id;
        var message_id = await getRewardByID(reward_id, server_id);
        message_id = message_id.message_id;
        await removeReward(reward_id, server_id);
        await removeRewardReaction(reward_id, server_id);

        // remove the message
        
        var messageToDelete = await message.guild.channels.cache.find(channel => channel.id === message.settings.rewardChannelID).messages.fetch(message_id);
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
    description: "admin controls for rewards",
    usage: `
    rewards add <cost> <reward> - adds a reward to the database
    rewards remove <reward> - removes a reward from the database
    rewards generate - generates a message for each reward in the database
    `
  };
  