const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    // get all messages in channel "864285781081325568"
    const channel = await message.guild.channels.cache.get("864285781081325568");
    const messages = await channel.messages.fetch();
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
    console.log(`mentions: ${mentions}`);
    // sort mentions by count
    const sortedMentions = Object.entries(mentions).sort((a, b) => b[1] - a[1]);
    console.log(`sortedMentions: ${sortedMentions}`);
    // get top 5 mentions
    const topMentions = sortedMentions.slice(0, 5);
    console.log(`topMentions: ${topMentions}`);
     // send top 5 mentions
    const topMentionEmbed = new Discord.MessageEmbed()
        .setColor(0x00AE86)
        .setTitle("Top 5 Mentions")
        .setDescription(`${topMentions.map(m => `<@${m[0]}> - ${m[1]} mentions`).join("\n")}`);
    message.channel.send(topMentionEmbed);
};

// while true



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