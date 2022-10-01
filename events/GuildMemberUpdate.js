const { reactionCollector, onlineCollector } = require('../Stats/Pusher.js');

module.exports = async (oldMember, newMember) => {
    console.log(oldMember)
    // check if the user boosted the server
    if (oldMember.premiumSinceTimestamp === null && newMember.premiumSinceTimestamp !== null) {
        // user boosted the server
        console.log(`${newMember.user.username} boosted the server!`);
        reactionCollector(newMember.guild.id, newMember.guild.premiumSubscriptionCount);
    }
    if (oldMember.premiumSinceTimestamp !== null && newMember.premiumSinceTimestamp === null) {
        // user unboosted the server
        console.log(`${newMember.user.username} unboosted the server!`);
        reactionCollector(newMember.guild.id, newMember.guild.premiumSubscriptionCount);
    }
    // check if the user went offline or online
    if (oldMember.presence.status === "online" && newMember.presence.status !== "online") {
        // user went offline
        console.log(`${newMember.user.username} went offline!`);
        onlineCollector(newMember.guild.id, newMember.guild.members.cache.filter(m => m.presence.status === "offline").size);
    }
    if (oldMember.presence.status !== "online" && newMember.presence.status === "online") {
        // user went online
        console.log(`${newMember.user.username} went online!`);
        onlineCollector(newMember.guild.id, newMember.guild.members.cache.filter(m => m.presence.status === "online").size);
    }
};