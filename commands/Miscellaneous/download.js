const fs = require('fs');
const fetch = require('node-fetch');
const { fetchMore } = require("../../modules/functions.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  // send a message to the channel to let them know the bot is working
  // wait 3 seconds then delete the message
  await message.channel.send('Downloading messages...').then(msg => {
    setTimeout(() => {
      msg.delete();
      message.delete();
    }, 3000);
  });
  // get all messages in the channel
  const messages = await fetchMore(message.channel);
  // get attachment url for each message
  const urls = messages.map(m => m.attachments.map(a => a.url));
  // flatten array
  const allUrls = [].concat.apply([], urls);
  // remove duplicates
  const uniqueUrls = [...new Set(allUrls)];

  // download all files
  let counter = 0;
  for (const url of uniqueUrls) {
    console.log(`Downloading ${url}`);
    // create downloads folder if it doesn't exist
    if (!fs.existsSync('downloads')) {
      fs.mkdirSync('downloads');
    }
    // create folder for server if it doesn't exist
    if (!fs.existsSync(`downloads/${message.guild.id}`)) {
      fs.mkdirSync(`downloads/${message.guild.id}`);
    }
    // create folder for channel if it doesn't exist
    if (!fs.existsSync(`downloads/${message.guild.id}/${message.channel.id}`)) {
      fs.mkdirSync(`downloads/${message.guild.id}/${message.channel.id}`);
    }
    // download each file
    const filename = url.split('/').pop();
    // get file extension
    const ext = filename.split('.').pop();
    const file = fs.createWriteStream(`downloads/${message.guild.id}/${message.channel.id}/${counter}.${ext}`);
    const response = await fetch(url);
    response.body.pipe(file);
    counter++;
  }
  // send a message to the channel to let them know the bot is done
  // wait 3 seconds then delete the message
  await message.channel.send('Done!').then(msg => {
    setTimeout(() => {
      msg.delete();
    }, 3000);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Owner"
};

exports.help = {
  name: "download",
  category: "Miscellaneous",
  description: "saves all images from the current channel to a folder",
  usage: "download"
};
