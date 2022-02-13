const fetch = require('node-fetch');
const Discord = require("discord.js");
const embed = new Discord.MessageEmbed();

exports.run = async (client, message, args, level) => {
  // fetch https://www.reddit.com/r/memes/random/.json
  const res = await fetch('https://www.reddit.com/r/memes/random/.json');
  const json = await res.json();
  // get the first post
  const post = json[0].data.children[0].data;

  const permalink = post.permalink;
  const memeUrl = `https://reddit.com${permalink}`;
  const memeImage = post.url;
  const memeTitle = post.title;
  const memeUpvotes = post.ups;
  const memeNumComments = post.num_comments;

			embed.setTitle(`${memeTitle}`);
			embed.setURL(`${memeUrl}`);
			embed.setColor('RANDOM');
			embed.setImage(memeImage);
			embed.setFooter(`👍 ${memeUpvotes} 💬 ${memeNumComments}`);

      // send the embed
      await message.channel.send({ embeds: [embed] });
  };

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "meme",
  category: "Fun",
  description: "shows a random meme",
  usage: "meme"
};
