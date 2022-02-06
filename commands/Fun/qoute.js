const Discord = require("discord.js");
const { fetchMore } = require("../../modules/functions.js");

exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    // get all messages in channel "864285781081325568"
    const channel = await message.guild.channels.cache.get("864285781081325568");
    // send a message to the channel to let them know the bot is working
    // wait 3 seconds then delete the message
    await message.channel.send("processing messages...").then(msg => {
        setTimeout(() => {
            msg.delete();
        }, 3000);
    });
    const messages = await fetchMore(channel, 5000);
    const countMention = messages.filter(m => m.content.includes("<@")).size;
    console.log(`countMention: ${countMention}`);
    // count all mentions for each user
    const mentions = messages.reduce((acc, m) => {
        const user = m.mentions.users.first();
        if (!user) return acc;
        if (!acc[user.id]) {
            acc[user.id] = 1;
        }
        else {
            acc[user.id]++;
        }
        return acc;
    }, {});

    // sort mentions by count
    const sortedMentions = Object.entries(mentions).sort((a, b) => b[1] - a[1]);
    // get top 5 mentions
    const topMentions = sortedMentions.slice(0, 5);
     // send top 5 mentions
    const topMentionEmbed = new Discord.MessageEmbed()
        .setColor(0x00AE86)
        .setTitle("Top 5 qouted users")
        .setDescription(`${topMentions.map(m => `<@${m[0]}> - ${m[1]} mentions`).join("\n")}`);
        return await message.channel.send({ embeds: [topMentionEmbed] });
};

    exports.conf = {
        enabled: true,
        guildOnly: true,
        aliases: [],
        permLevel: "user"
      };
      
      exports.help = {
        name: "qoute",
        category: "Fun",
        description: "qoute",
        usage: "qoute"
      };