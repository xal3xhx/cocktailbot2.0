const Discord = require('discord.js');

module.exports = (client) => {
	client.on('messageReactionAdd', async (reaction, user) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	const settings = client.getSettings(reaction.message.channel.guild);
	if(reaction.message.channel.id != settings.cocktailchannelID) return;
	if(user.id === client.user.id) return
	// code here
	if(reaction._emoji.name == "👍") {
		upvotes = await client.getUpvotes(reaction.message.id, reaction.message.channel.guild.id)
		if(!upvotes[0]) return;
		await client.updateUpVote(upvotes[0].up_vote + 1, reaction.message.id, reaction.message.channel.guild.id)
	}
	if(reaction._emoji.name == "👎") {
		downvotes = await client.getDownvotes(reaction.message.id, reaction.message.channel.guild.id)
		if(!downvotes[0]) return;
		await client.updateDownVote(downvotes[0].downvote + 1, reaction.message.id, reaction.message.channel.guild.id)
	}
	console.log(`user: ${user.username} reacted to a message with the emoji ${reaction._emoji.name}`)
  });



	client.on('messageReactionRemove', async (reaction, user) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	const settings = client.getSettings(reaction.message.channel.guild);
	if(reaction.message.channel.id != settings.cocktailchannelID) return;
	if(user.id === client.user.id) return
	// code here
	if(reaction._emoji.name == "👍") {
		upvotes = await client.getUpvotes(reaction.message.id, reaction.message.channel.guild.id)
		if(!upvotes[0]) return;
		await client.updateUpVote(upvotes[0].up_vote - 1, reaction.message.id, reaction.message.channel.guild.id)
	}
	if(reaction._emoji.name == "👎") {
		downvotes = await client.getDownvotes(reaction.message.id, reaction.message.channel.guild.id)
		if(!downvotes[0]) return;
		await client.updateDownVote(downvotes[0].downvote - 1, reaction.message.id, reaction.message.channel.guild.id)
	}
	console.log(`user: ${user.username} removed the reaction ${reaction._emoji.name} from a message.`)
  });
}