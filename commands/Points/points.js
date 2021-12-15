const {getPoints, addPoints, removePoints, getTop10} = require('../../modules/pointsbackend.js');
exports.run = async (client, message, args, level) => {
    await message.guild.members.fetch()

    // if args is add, add points to a user
    // only if the message author is level 10 or higher
    // if the user is not in the database, add them
    // if the user is in the database, add points to their points
    // if no user is mentioned, add points to the message author
    if (args[0] === 'add') {
        if (level <= 10) return message.reply('you do not have permission to add points.');
        if (!args[1]) return message.reply('please specify a user to add points to.');
        let user = message.mentions.users.first();
        if (!user) return message.reply('please specify a valid user to add points to.');
        if (user.bot) return message.reply('you cannot add points to a bot.');
        let points = args[2];
        if (!points) return message.reply('please specify the amount of points to add.');
        if (isNaN(points)) return message.reply('please specify a valid amount of points to add.');
        if (points < 1) return message.reply('please specify a valid amount of points to add.');
        let userPoints = await getPoints(user.id, message.guild.id);
        if (userPoints === null) {
            await addPoints(user.id, points, message.guild.id);
            return message.reply(`${user} has been added to the database with ${points} points.`);
        }
        else {
            await addPoints(user.id, points, message.guild.id);
            return message.reply(`${user} has been given ${points} points.`);
        }
    }

    // if args is remove, remove points from a user
    // only if the message author is level 10 or higher
    // if the user is not in the database, do nothing
    // if the user is in the database, remove points from their points
    // if no user is mentioned, remove points from the message author
    if (args[0] === 'remove') {
        if (level <= 10) return message.reply('you do not have permission to remove points.');
        if (!args[1]) return message.reply('please specify a user to remove points from.');
        let user = message.mentions.users.first();
        if (!user) return message.reply('please specify a valid user to remove points from.');
        if (user.bot) return message.reply('you cannot remove points from a bot.');
        let points = args[2];
        if (!points) return message.reply('please specify the amount of points to remove.');
        if (isNaN(points)) return message.reply('please specify a valid amount of points to remove.');
        if (points < 1) return message.reply('please specify a valid amount of points to remove.');
        let userPoints = await getPoints(user.id, message.guild.id);
        if (userPoints === null) {
            return message.reply(`${user} does not have any points to remove.`);
        }
        else {
            await removePoints(user.id, points, message.guild.id);
            return message.reply(`${user} has had ${points} points removed.`);
        }
    }

    // if args is top, get the top 10 users with the most points
    // get the user from each user id in the top 10
    // send a embed message with the top 10 usernames and their points
    if (args[0] === 'top') {
        let top = await getTop10(message.guild.id);
        let topUsers = [];
        for (let i = 0; i < 10; i++) {
            let user = await client.users.fetch(top[i].userid);
            topUsers.push(user);
        }
        let embed = new client.Discord.MessageEmbed()
            .setTitle('Top 10 Users')
            .setColor('#0099ff')
            .setDescription(`${topUsers.map(user => `${user.tag} - ${top[i].points}`).join('\n')}`);
        return message.channel.send(embed);
    }

    // if args is get or view, get the points of a user
    // if no user is mentioned, get the points of the message author
    // if the user is not in the database, add them with 0 points
    // if the user is in the database, send the points
    if (args[0] === 'get' || args[0] === 'view') {
        if (!args[1]) {
            let userPoints = await getPoints(message.author.id, message.guild.id);
            if (userPoints === null) {
                await addPoints(message.author.id, 0, message.guild.id);
                return message.reply(`you have no points.`);
            }
            else {
                return message.reply(`you have ${userPoints} points.`);
            }
        }
        let user = message.mentions.users.first();
        if (!user) return message.reply('please specify a valid user to get points for.');
        if (user.bot) return message.reply('you cannot get points from a bot.');
        let userPoints = await getPoints(user.id, message.guild.id);
        if (userPoints === null) {
            await addPoints(user.id, 0, message.guild.id);
            return message.reply(`${user} has been added to the database with 0 points.`);
        }
        else {
            return message.reply(`${user} has ${userPoints} points.`);
        }
    }

    // if no args are specified, send a help message with the commands
    if (!args[0]) {
        return message.reply('please specify a command.\n\n**Usage:**\n```\n!points add @user points\n!points remove @user points\n!points get @user\n!points top\n```');
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "user"
  };
  
  exports.help = {
    name: "points",
    category: "Points",
    description: "get your points",
    usage: "Points"
  };
  