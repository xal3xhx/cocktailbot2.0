
const { memberCollector } = require('../Stats/Pusher.js')

module.exports = async (client, member) => {
    // get member count and bot count of guild
    memberCollector(member.guild.id, member.guild.memberCount, member.guild.members.cache.filter(m => m.user.bot).size);
}