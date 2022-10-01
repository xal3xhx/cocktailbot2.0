const logger = require("../modules/Logger.js");
const { boostCollector, memberCollector, onlineCollector, guildCollector } = require('../Stats/Pusher.js');
const { getSettings } = require("../modules/functions.js");
module.exports = async client => {
  // Log that the bot is online.
  logger.log(`${client.user.tag}, ready to serve ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} users in ${client.guilds.cache.size} servers.`, "ready");
  
  guildCollector(client.guilds.cache.size)

  // for each guild, get the id and the boost count
  client.guilds.cache.forEach(async guild => {
    boostCollector(guild.id, guild.premiumSubscriptionCount);
  });

  // for each guild, get the id and the member count with bots separated
  client.guilds.cache.forEach(async guild => {
    memberCollector(guild.id, guild.memberCount, guild.members.cache.filter(m => m.user.bot).size);
  });

  // for each guild, get the id and the online count
  client.guilds.cache.forEach(async guild => {
  guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
    const totalOnline = fetchedMembers.filter(member => member.presence?.status === 'online');
    // Now you have a collection with all online member objects in the totalOnline variable
    onlineCollector(guild.id, totalOnline.size);
  });
  });
  
  // Make the bot "play the game" which is the help command with default prefix.
  const settings = await getSettings("default");

  await client.user.setActivity(`${settings.Prefix}help`, { type: "PLAYING" });
};
