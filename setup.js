const Enmap = require("enmap");

const defaultSettings = {
    "prefix": "~",
    "cocktailchannelID": "840334813906337882",
    "hornyjailchannelID": "840334813906337882", 
    "eventchannelID": "824742922641473587",
    "VictumMessageID": "852668565235564584",
    "MovieMessageID": "000",
    "VictumRoleID": "852660279544381480",
    "MovieRoleID": "863433413569544213",
    "bonker": "bonker",
};

const settings = new Enmap({
  name: "settings",
  cloneLevel: 'deep',
  ensureProps: true
});


(async function () {
  console.log("Setting Up GuideBot Configuration...");
  await settings.defer;
  if (!settings.has("default")) {
    prompts = prompts.slice(1);
    console.log("First Start! Inserting default guild settings in the database...");
    await settings.set("default", defaultSettings);
  }
  await settings.close();
}());