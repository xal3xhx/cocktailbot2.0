const Discord = require('discord.js');

module.exports = (client) => {
	client.on('messageReactionAdd', async (reaction, user) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			client.logger.error(`something went wrong while trying to fetch the message!`)
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	const settings = client.getSettings(reaction.message.channel.guild);
	if(user.id === client.user.id) return
	if(reaction.message.channel.id === settings.cocktailchannelID) await cocktail_reaction_add(settings, reaction, user);
	if(reaction.message.id === settings.VictumMessageID) await victum_reaction_add(settings, reaction, user);
	if(reaction.message.id === settings.MovieMessageID) await movie_reaction_add(settings, reaction, user);
	client.logger.log(`user: ${user.username} reacted to a message with the emoji ${reaction._emoji.name}`)
  });



	client.on('messageReactionRemove', async (reaction, user) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			client.logger.error(`something went wrong while trying to fetch the message!`)
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	const settings = client.getSettings(reaction.message.channel.guild);
	if(user.id === client.user.id) return
	if(reaction.message.channel.id === settings.cocktailchannelID) cocktail_reaction_remove(settings, reaction, user);
	if(reaction.message.id === settings.VictumMessageID) await victum_reaction_remove(settings, reaction, user);
	if(reaction.message.id === settings.MovieMessageID) await movie_reaction_remove(settings, reaction, user);
	client.logger.log(`user: ${user.username} removed the reaction ${reaction._emoji.name} ‎from a message.`)
  });


	async function movie_reaction_add(settings, reaction, userr) {
		if(reaction._emoji.name == "🎥") {
			var role = reaction.message.channel.guild.roles.cache.find(role => role.id === settings.MovieRoleID)
			var member = reaction.message.channel.guild.members.cache.find(user => user.id === userr.id)
			member.roles.add(role).catch(client.logger.error);
		}
	}

	async function movie_reaction_remove(settings, reaction, userr) {
		if(reaction._emoji.name == "🎥") {
			var role = reaction.message.channel.guild.roles.cache.find(role => role.id === settings.MovieRoleID)
			var member = reaction.message.channel.guild.members.cache.find(user => user.id === userr.id)
			member.roles.remove(role).catch(client.logger.error);
		}
	}

	async function victum_reaction_add(settings, reaction, userr) {
		if(reaction._emoji.name == "👀") {
			var role = reaction.message.channel.guild.roles.cache.find(role => role.id === settings.VictumRoleID)
			var member = reaction.message.channel.guild.members.cache.find(user => user.id === userr.id)
			member.roles.add(role).catch(client.logger.error);
		}
	}

	async function victum_reaction_remove(settings, reaction, userr) {
		if(reaction._emoji.name == "👀") {
			var role = reaction.message.channel.guild.roles.cache.find(role => role.id === settings.VictumRoleID)
			var member = reaction.message.channel.guild.members.cache.find(user => user.id === userr.id)
			member.roles.remove(role).catch(client.logger.error);	
		}
	}

	async function cocktail_reaction_add(settings, reaction, userr) {
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
	}

	async function cocktail_reaction_remove(settings, reaction, userr) {
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
	}

}