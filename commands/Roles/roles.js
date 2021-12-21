const { addRollReaction, removeRollReaction } = require('../../modules/reactionbackend.js');
exports.run = async (client, message, args, level) => {
    await message.guild.members.fetch()
    
    // if args[0] is add
    // add the reaction to the database
    // add the reaction to the message
    if (args[0] === 'add') {
        const role = message.guild.roles.cache.find(role => role.id === args[2]);
        if (!role) return message.channel.send('Role not found');
        const emoji = args[1];
        const role_Id = args[2];
        const message_Id = args[3];
        const guildId = message.guild.id;

        // add the reaction to the database
        addRollReaction(emoji, role_Id, guildId, message_Id);
        // add the reaction to the message using the message id
        message.channel.messages.fetch(message_Id).then(msg => {
            msg.react(emoji);
        });
    }

    // if args[0] is remove
    // remove the reaction from the database
    // remove the reaction from the message
    if (args[0] === 'remove') {
        const role = message.guild.roles.cache.find(role => role.id === args[2]);
        if (!role) return message.channel.send('Role not found');
        const emoji = args[1];
        const role_Id = args[2];
        const message_Id = args[3];
        const guildId = message.guild.id;

        // add the reaction to the database
        removeRollReaction(emoji, role_Id, guildId, message_Id);
        // remove all reactions for the emoji from the message using the message id
        message.channel.messages.fetch(message_Id).then(msg => {
            msg.reactions.cache.get(emoji).remove();
        });
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Server Owner"
  };
  
  exports.help = {
    name: "roles",
    category: "roles",
    description: "create reaction roles",
    usage: "roles {add/remove/edit} {emoji} {role_id} {message_id}"
  };
  