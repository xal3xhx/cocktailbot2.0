const { getSettings } = require("../modules/functions.js");
// This event executes when a new member joins a server. Let's welcome them!

module.exports = async (client, member) => {
  // Load the guild's settings
  const settings = await getSettings(member.guild);

  // If welcome is off, don't proceed (don't welcome the user)
  if (settings.WelcomeEnabled !== "true") return;

  // Replace the placeholders in the welcome message with actual data
  const welcomeMessage = settings.WelcomeMessage.replace("{{user}}", member.user.tag);

  // Send the welcome message to the welcome channel
  // There's a place for more configs here.
  member.guild.channels.cache.find(c => c.id === settings.WelcomeChannelID).send(welcomeMessage).catch(console.error);
};
