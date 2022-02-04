const fs = require('fs');
const fetch = require('node-fetch');
const { Collection } = require('discord.js');

async function fetchMore(channel, limit = 5000) {
  if (!channel) {
    throw new Error(`Expected channel, got ${typeof channel}.`);
  }
  if (limit <= 100) {
    return channel.messages.fetch({ limit });
  }

  let collection = new Collection();
  let lastId = null;
  let options = {};
  let remaining = limit;

  while (remaining > 0) {
    options.limit = remaining > 100 ? 100 : remaining;
    remaining = remaining > 100 ? remaining - 100 : 0;

    if (lastId) {
      options.before = lastId;
    }

    let messages = await channel.messages.fetch(options);

    if (!messages.last()) {
      break;
    }

    collection = collection.concat(messages);
    lastId = messages.last().id;
  }

  return collection;
}

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
