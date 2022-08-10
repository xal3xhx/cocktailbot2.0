const {getPoints, addPoints, removePoints, getTop10} = require('../../modules/pointsbackend.js');
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args, level) => {
    await message.guild.members.fetch()
    if (message.settings.PointsEnabled === false) return message.channel.send(`${message.author}, The points system is disabled on this server.`);
    let pointsname = message.settings.PointsName;

    // if args is add, add points to a user
    // only if the message author is level 10 or higher
    // if the user is not in the database, add them
    // if the user is in the database, add points to their points
    // if no user is mentioned, add points to the message author
    if (args[0] === 'add') {
        if (level <= 10) return message.reply(`you do not have permission to add ${pointsname}.`);
        if (!args[1]) return message.reply(`please specify a user to add ${pointsname} to.`);
        let user = message.mentions.users.first();
        if (!user) return message.reply(`please specify a valid user to add ${pointsname} to.`);
        if (user.bot) return message.reply(`you cannot add ${pointsname} to a bot.`);
        let points = args[2];
        if (!points) return message.reply(`please specify the amount of ${pointsname} to add.`);
        if (isNaN(points)) return message.reply(`please specify a valid amount of ${pointsname} to add.`);
        if (points < 1) return message.reply(`please specify a valid amount of ${pointsname} to add.`);
        let userPoints = await getPoints(user.id, message.guild.id);
        if (userPoints === null) {
            await addPoints(user.id, points, message.guild.id);
            return message.reply(`${user} has been added to the database with ${points} ${pointsname}.`);
        }
        else {
            await addPoints(user.id, points, message.guild.id);
            return message.reply(`${user} has been given ${points} ${pointsname}.`);
        }
    }

    // if args is remove, remove points from a user
    // only if the message author is level 10 or higher
    // if the user is not in the database, do nothing
    // if the user is in the database, remove points from their points
    // if no user is mentioned, remove points from the message author
    if (args[0] === 'remove') {
        if (level <= 10) return message.reply(`you do not have permission to remove ${pointsname}.`);
        if (!args[1]) return message.reply(`please specify a user to remove ${pointsname} from.`);
        let user = message.mentions.users.first();
        if (!user) return message.reply(`please specify a valid user to remove ${pointsname} from.`);
        if (user.bot) return message.reply(`you cannot remove ${pointsname} from a bot.`);
        let points = args[2];
        if (!points) return message.reply(`please specify the amount of ${pointsname} to remove.`);
        if (isNaN(points)) return message.reply(`please specify a valid amount of ${pointsname} to remove.`);
        if (points < 1) return message.reply(`please specify a valid amount of ${pointsname} to remove.`);
        let userPoints = await getPoints(user.id, message.guild.id);
        if (userPoints === null) {
            return message.reply(`${user} does not have any ${pointsname} to remove.`);
        }
        else {
            await removePoints(user.id, points, message.guild.id);
            return message.reply(`${user} has had ${points} ${pointsname} removed.`);
        }
    }

    // if args is top, get the top 10 users with the most points
    // get the user from each user id in the top 10
    // send a embed message with the top 10 usernames and their points
    if (args[0] === 'top') {
        let top = await getTop10(message.guild.id);
        let topUsers = [];
        for (let i = 0; i < top.length; i++) {
            let user = await client.users.fetch(top[i].user_id);
            topUsers.push(`${user.username} - ${top[i].points}`);
        }
        let topEmbed = new MessageEmbed()
            .setTitle('Top 10 Users')
            .setDescription(topUsers.join('\n'))
            .setColor(0x00AE86);
        
            return message.channel.send({ embeds: [topEmbed] });
    }

    // if no are args,
    // if no user is mentioned, get the points of the message author
    // if the user is not in the database, add them with 0 points
    // if the user is in the database, send the points
    let author = message.author
    let mention = message.mentions.users.first();
    if(mention) {
        // check if message author is level 10 or higher
        if (level <= 10) return message.reply(`you do not have permission to view other users ${pointsname}.`);
        if (!mention) return message.reply(`please specify a valid user to get ${pointsname} for.`);
        if (mention.bot) return message.reply(`you cannot get ${pointsname} from a bot.`);
        let userPoints = await getPoints(mention.id, message.guild.id);
        if (userPoints === null) {
            await addPoints(mention.id, 0, message.guild.id);
            return message.reply(`${mention} has 0 ${pointsname}.`);
        }
        else {
            return message.reply(`${mention} has ${userPoints} ${pointsname}.`);
        }
    }
    else {
        let userPoints = await getPoints(author.id, message.guild.id);
        if (userPoints === null) {
            await addPoints(author.id, 0, message.guild.id);
            return message.reply(`You have 0 ${pointsname}.`);
        }
        else {
            return message.reply(`You have ${userPoints} ${pointsname}.`);
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["tokens"],
    permLevel: "User"
  };
  
  exports.help = {
    name: "points",
    category: "Points",
    description: "View your points or add/remove points from another user.",
    usage: "Points [add/remove/top] [user] [amount]"
  };
  