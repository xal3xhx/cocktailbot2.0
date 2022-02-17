const Discord = require("discord.js");
const { fetchMore } = require("../../modules/functions.js");
const owoify = require('owoify-js').default

exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    // get all messages in channel "864285781081325568"
    const channel = await message.guild.channels.cache.get(message.settings.QouteChannelID);
    let progessing = await message.channel.send("processing messages...");
    const messages = await fetchMore(channel, 5000);
    await progessing.delete();

    // filter out messages that match the regex  `.*([”“""*][^”“""*]*[”“""*])[ ]{0,2}[- \e_+:][- \e_+:]{0,2}(<@[!]{0,1}[0-9]+>).*`
    const quotes = await messages.filter(m => m.content.match(/^.*([”“""*][^”“""*]*[”“""*])[ ]{0,2}[- \e_+:][- \e_+:]{0,2}(<@[!]{0,1}[0-9]+>).*$/));
    // send an embed with a random quote with the link to the message
    const randomQuote = quotes.random();
    // get the qouted user
    const qoutedUser = randomQuote.mentions.users.first();
    const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`${qoutedUser.username} said:`)
        .setURL(`https://discordapp.com/channels/${randomQuote.guild.id}/${randomQuote.channel.id}/${randomQuote.id}`)
        .setDescription(owoify(randomQuote.content))
        .setFooter({
          text: randomQuote.createdAt.toLocaleString(),
          })
        return await message.channel.send({ embeds: [embed] });
};

    exports.conf = {
        enabled: true,
        guildOnly: true,
        aliases: [],
        permLevel: "user"
      };
      
      exports.help = {
        name: "rquoteowo",
        category: "Fun",
        description: "sends a random quote from the quote channel but with a twist",
        usage: "rquoteowo"
      };