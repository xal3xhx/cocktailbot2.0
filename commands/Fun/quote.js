const Discord = require("discord.js");
const { fetchMore } = require("../../modules/functions.js");
const { addQuote, removeQuote, getAllQuotes, getRandomQuote, getRandomQuoteFromUser } = require("../../modules/quotesbackend.js");
const owoify = require('owoify-js').default

exports.run = async (client, message, args, level) => {
    const settings = message.settings;

    // adds a quote to the database
    if (args[0] === "add") {
        if (!args[1]) return message.channel.send("Please provide a user to add the quote to.");
        if (!args[2]) return message.channel.send("Please provide a quote to add.");
        const user = message.mentions.users.first();
        const quote = args.slice(2).join(" ");
        let quote_id = await addQuote(user.id, quote, message.guild.id);
        // sends an embed with the quote
        const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`${user.username} said:`)
                .setDescription(quote)
                .setFooter(`Quote ID: ${quote_id}`);
            await message.delete();
            return message.channel.send({ embeds: [embed] });
    }

    // removes a quote from the database using quote id
    if (args[0] === "remove") {
        if(level < 15) return message.reply("you don't have permission to use this command!");
        if (!args[1]) return message.channel.send("Please provide a quote id to remove.");
        const quote_id = args[1];
        await removeQuote(quote_id);
        return message.channel.send(`Removed quote with id ${quote_id}`);
    }

    // gets the top 10 quoted users
    if(args[0] === "top") {
        // Get all quotes from the server
        const topQuotes = await getAllQuotes(message.guild.id);
        // sort topquotes by user_id
        topQuotes.sort((a, b) => {
            return b.user_id - a.user_id;
        });
        // count the number of quotes for each user
        const topQuotesCount = topQuotes.reduce((acc, cur) => {
            if (!acc[cur.user_id]) acc[cur.user_id] = 0;
            acc[cur.user_id]++;
            return acc;
        }, {});
        // get the top 10 users
        const topUsers = Object.keys(topQuotesCount).map(key => {
            return {
                user_id: key,
                quote_count: topQuotesCount[key]
            }
        }).sort((a, b) => {
            return b.quote_count - a.quote_count;
        }).slice(0, 10);
        // send an embed with the top 10 users
        const topUsersEmbed = new Discord.MessageEmbed()
            .setTitle("Top 10 Quoted Users")
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL());
        topUsers.forEach(u => {
            let user = client.users.cache.find(user => user.id === u.user_id)
            topUsersEmbed.addField(`${user.tag}`, `${u.quote_count} quotes`);
        });
        return message.channel.send({ embeds: [topUsersEmbed] });


    }

    // returns a random quote from the server
    if(args[0] == "random") {
            rquote = await getRandomQuote(message.guild.id);
            if(!rquote) return message.channel.send("There are no quotes in this server.");
            rquote = rquote[0];
            const user = await client.users.cache.find(user => user.id === rquote.user_id);
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`${user.username} said:`)
                .setDescription(rquote.quote)
                .setFooter(`Quote ID: ${rquote.quote_id}`);
            return message.channel.send({ embeds: [embed] });
    }

    // returns a random quote from the server then owoifies it
    if(args[0] == "randomowo") {
        rquote = await getRandomQuote(message.guild.id);
        if(!rquote) return message.channel.send("There are no quotes in this server.");
        rquote = rquote[0];
        const user = await client.users.cache.find(user => user.id === rquote.user_id);
        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`${user.username} said:`)
            .setDescription(owoify(rquote.quote))
            .setFooter(`UID: ${rquote.quote_id}`);
        return message.channel.send({ embeds: [embed] });
}

    // for each quote in the server, send an embed
    if(args[0] == "generate") {
        if(level < 15) return message.reply("you don't have permission to use this command!");
        const quotes = await getAllQuotes(message.guild.id);
        if(quotes.length < 1) return message.channel.send(`There are no quotes in this server.`);
        const embeds = [];
        for(let i = 0; i < quotes.length; i++) {
            const user = await client.users.cache.find(user => user.id === quotes[i].user_id);
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`${user.username} said:`)
                .setDescription(quotes[i].quote)
                .setFooter(`UID: ${quotes[i].quote_id}`);
            message.channel.send({ embeds: [embed] });
        }
    }

    if(args[0] == "filter") {
        if(level < 15) return message.reply("you don't have permission to use this command!");
        // get all messages in quote channel
        const channel = await message.guild.channels.cache.get(message.settings.QouteChannelID);
        let progessing = await message.channel.send("processing messages...");
        const messages = await fetchMore(channel, 500000);
        await progessing.delete();
        const quotes = await messages.filter(m => m.content.match(/^.*([”“""*][^”“""*]*[”“""*])[ ]{0,2}[-_+:=][ ]{0,2}(<@[!]{0,1}[0-9]+>).*$/));
        
        // standardize the quotes
        // septerate the quote and the author
        let standardized = quotes.map(m => {
            let user = m.mentions.users.first();
            let quote = m.content.replace(/([`'’])*([`'’])/g, "'");
            quote = quote.replace(/([”“""*]*[”“""*])[ ]{0,2}[ ]{0,2}/g, "\"");
            quote = quote.replace(/([ ]{0,2}[-_+:=][ ]{0,2})/g, "");
            quote = quote.replace(/<@[!]{0,1}[0-9]+>/g, "");
            return {
                user: user,
                quote: quote
            };
        });

        // for each quote in the standardized array add it to the database
        standardized.forEach(async (quote) => {
                addQuote(quote.user.id, quote.quote, message.guild.id);
        });
    }
}       

    exports.conf = {
        enabled: true,
        guildOnly: true,
        aliases: ["q", "quotes"],
        permLevel: "user"
      };
      
      exports.help = {
        name: "quote",
        category: "Fun",
        description: "controls the quotes system",
        usage: `
        quote add <user> <quote> - adds a quote to the server
        quote top - returns the top 10 users with the most quotes
        quote random - returns a random quote from the server
        quote randomowo - returns a random quote from the server then owoifies it
        quote remove <quote_id> - (Admin only) removes a quote from the server
        quote generate - (Admin only) generates all quotes in the server
        quote filter - (Admin only) filters all messages in the quote channel and adds them to the database
        `
      };