const logger = require("./Logger.js");
const config = require("../config.js");
const { settings } = require("./settings.js");
const { Player } = require("discord-player");

async function init(client) {
  const player = new Player(client);
  console.log("testing")
}


module.exports = { init };