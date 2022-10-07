// import needed modules
const prom = require('prom-client');
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const register = new prom.Registry();
const collectDefaultMetrics = prom.collectDefaultMetrics;
const tags_default = [ "guild", "channel", "user" ];
const tags_names = [ "guild", "channel", "channelName", "user", "name" ];
const track_names = true;
const prefix = "author_"
collectDefaultMetrics({ register });


// msg_count = Counter.build().name(prefix + "msg_count").help("Count of messages").labelNames(track_names ? tags_names : tags_default).register();
const msg_count = new prom.Counter({
    name: prefix + "msg_count",
    help: "Count of messages",
    labelNames: track_names ? tags_names : tags_default,
    registers: [register]
});

// msg_emote_count = Counter.build().name(prefix + "msg_emote_count").help("Count of emotes in messages").labelNames(track_names ? new String[] { "guild", "channel", "channelName", "user", "name", "emote" }        : new String[] { "guild", "channel", "user", "emote" }).register();
const msg_emote_count = new prom.Counter({
    name: prefix + "msg_emote_count",
    help: "Count of emotes in messages",
    labelNames: track_names ? [ "guild", "channel", "channelName", "user", "name", "emote" ] : [ "guild", "channel", "user", "emote" ],
    registers: [register]
});

// msg_length = Gauge.build().name(prefix + "msg_length").help("Length of messages").labelNames(track_names ? tags_names : tags_default).register();
const msg_length = new prom.Gauge({
    name: prefix + "msg_length",
    help: "Length of messages",
    labelNames: track_names ? tags_names : tags_default,
    registers: [register]
});

// msg_word_count = Gauge.build().name(prefix + "msg_word_count").help("Count of words in messages").labelNames(track_names ? tags_names : tags_default).register();
const msg_word_count = new prom.Gauge({
    name: prefix + "msg_word_count",
    help: "Count of words in messages",
    labelNames: track_names ? tags_names : tags_default,
    registers: [register]
});

// toxicityScore = Gauge.build().name(prefix + "toxicity_score").help("ToxicityScore of a message").labelNames(track_names ? tags_names : tags_default).register();
const toxicityScore = new prom.Gauge({
    name: prefix + "toxicity_score",
    help: "ToxicityScore of a message",
    labelNames: track_names ? [ "guild", "channel", "channelName", "user", "name", "message" ] : [ "guild", "channel", "user", "message" ],
    registers: [register]
});

// reaction_count = Counter.build().name(Configuration.PROMCORD_PREFIX + "reaction_count").help("Count of reactions").labelNames((Configuration.TRACK_NAMES != null && Configuration.TRACK_NAMES.equalsIgnoreCase("true"))? new String[] { "guild", "channel", "channelName", "user", "name", "emote" }: new String[] { "guild", "channel", "user", "emote" }).register();
const reaction_count = new prom.Counter({
    name: prefix + "reaction_count",
    help: "Count of reactions",
    labelNames: track_names ? [ "guild", "channel", "channelName", "user", "name", "emote" ] : [ "guild", "channel", "user", "emote" ],
    registers: [register]
});

// booster_count = Gauge.build().name(Configuration.PROMCORD_PREFIX + "booster_count").help("Count of boosters").labelNames("guild").register();
const booster_count = new prom.Gauge({
    name: prefix + "booster_count",
    help: "Count of boosters",
    labelNames: [ "guild" ],
    registers: [register]
});

// member_count = Gauge.build().name(Configuration.PROMCORD_PREFIX + "member_count").help("Count of members").labelNames("guild").register();
const member_count = new prom.Gauge({
    name: prefix + "member_count",
    help: "Count of members",
    labelNames: [ "guild" ],
    registers: [register]
});

// bot_count = Gauge.build().name(Configuration.PROMCORD_PREFIX + "bot_count").help("Count of bots").labelNames("guild").register();
const bot_count = new prom.Gauge({
    name: prefix + "bot_count",
    help: "Count of bots",
    labelNames: [ "guild" ],
    registers: [register]
});

//  member_online = Gauge.build().name(Configuration.PROMCORD_PREFIX + "member_online").help("Count of online members").labelNames("guild").register();
const member_online = new prom.Gauge({
    name: prefix + "member_online",
    help: "Count of online members",
    labelNames: [ "guild" ],
    registers: [register]
});

// voice_time = Gauge.build().name(Configuration.PROMCORD_PREFIX + "voice_time").help("Time spent in a voice channel").labelNames("guild", "channel", "user").register();
const voice_time = new prom.Gauge({
    name: prefix + "voice_time",
    help: "Time spent in a voice channel",
    labelNames: [ "guild", "channel", "user", "name" ],
    registers: [register]
});

// stream_time = Gauge.build().name(Configuration.PROMCORD_PREFIX + "stream_time").help("Time spent streaming").labelNames("guild", "user").register();
const stream_time = new prom.Gauge({
    name: prefix + "stream_time",
    help: "Time spent streaming",
    labelNames: [ "guild", "channel", "user", "name" ],
    registers: [register]
});

// stream_count = Gauge.build().name(Configuration.PROMCORD_PREFIX + "stream_count").help("Count of streams").labelNames("guild", "channel").register();
const stream_count = new prom.Gauge({
    name: prefix + "stream_count",
    help: "Count of members streaming in voice channel", 
    labelNames: [ "guild", "channel" ],
    registers: [register]
});

// voice_count = Gauge.build().name(Configuration.PROMCORD_PREFIX + "voice_count").help("Current number of members in voice channel").labelNames("guild", "channel").register();
const voice_count = new prom.Gauge({
    name: prefix + "voice_count",
    help: "Current number of members in voice channel",
    labelNames: [ "guild", "channel" ],
    registers: [register]
});

// buildGauge(Configuration.PROMCORD_PREFIX + "discord_guilds","Amount of all Guilds that the bot is connected to. ", bot.getJDA().getGuilds().size()));
const discord_guilds = new prom.Gauge({
    name: prefix + "discord_guilds",
    help: "Amount of all Guilds that the bot is connected to.",
    registers: [register]
});

// buildGauge(Configuration.PROMCORD_PREFIX + "discord_ping_websocket","Time in milliseconds between heartbeat and the heartbeat ack response", bot.getJDA().getGatewayPing()),
const discord_ping_websocket = new prom.Gauge({
    name: prefix + "discord_ping_websocket",
    help: "Time in milliseconds between heartbeat and the heartbeat ack response",
    registers: [register]
});

//buildGauge(Configuration.PROMCORD_PREFIX + "discord_ping_rest","The time in milliseconds that discord took to respond to a REST request.", rest_ping),
const discord_ping_rest = new prom.Gauge({
    name: prefix + "discord_ping_rest",
    help: "The time in milliseconds that discord took to respond to a REST request.",
    registers: [register]
});

app.get('/metrics', async (req, res) => {
    register.metrics().then((data) => {
        res.set('Content-Type', register.contentType);
        res.end(data);
    });
});


// Start the server to expose the metrics.
// 0.0.0.0:3001/metrics
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

// exported functions
async function boostCollector(guild_id, boosts) {
    booster_count.labels(guild_id).set(boosts);
}

async function reactionCollector(reaction, user) {
        const emote = await getReaction(reaction.emoji);
        if (track_names) {
            reaction_count.labels(reaction.message.guild.id, reaction.message.channel.id, reaction.message.channel.name, user.id, user.username, emote).inc();
        } else {
            reaction_count.labels(reaction.message.guild.id, reaction.message.channel.id, user.id, emote).inc();
        }
}

async function messageCollector(message) {

    let server_id = message.guild.id;
    let channel_id = message.channel.id;
    let channel_name = message.channel.name;
    let user_id = message.author.id;
    let user_name = message.author.username;
    let word_count = message.content.split(" ").length;
    let character_count = message.content.length;
    let content = message.content;

// event.getMessage().getEmotesBag().forEach
    let emotes = message.content.match(/<:.+?:\d+>/g);
    let emote_count = 0;
    if (emotes != null) {
        emote_count = emotes.length;
    }


    let data = {
        "server_id": server_id,
        "channel_id": channel_id,
        "channel_name": channel_name,
        "user_id": user_id,
        "user_name": user_name,
        "word_count": word_count,
        "character_count": character_count,
        "emote_count": emote_count,
        "content": content
    };

    recordMessageCount(data);
    recordMessageLength(data);
    recordMessageWordCount(data);

    if(process.env.PERSPECTIVE_KEY != null) {
        recordToxicityScore(message);
    }

        if (track_names) {
            msg_emote_count.labels(data.server_id, data.channel_id, data.channel_name, data.user_id, data.user_name, data.emote_count).inc();
        } else {
            msg_emote_count.labels(data.server_id, data.channel_id, data.user_id, data.emote_count).inc();
        }
}

async function memberCollector(guild_id, members, bots) {
    member_count.labels(guild_id).set(members);
    bot_count.labels(guild_id).set(bots);
}

async function onlineCollector(guild_id, online) {
    member_online.labels(guild_id).set(online);
}

async function guildCollector(guilds) {
    discord_guilds.set(guilds);
}

async function pingCollector(web, rest) {
    discord_ping_websocket.set(web);
    discord_ping_rest.set(rest);
}

async function voiceCollector(guild_id, channel_id, stream, count, time) {
    if(!stream) {
        voice_count.labels(guild_id, channel_id).set(count);
        return
    }
}

async function counterCheker(client) {
    // for each user in the voice_time map
    // update the voice_time metric with the current difference between the current time and the time the user joined the voice channel
    let voice_time_map = client.container.voice_time;
    let stream_time_map = client.container.stream_time;

    for (const [key, value] of voice_time_map) {
        let user = client.users.cache.find(user => user.id === key);
        let guild = value.guild_id;
        let channel = value.channel_id;
            let time = Math.floor((Date.now() - value.time) / 1000);
            voice_time.labels(guild, channel, user.id, user.username).set(time);
    }
    for (const [key, value] of stream_time_map) {
        let user = client.users.cache.find(user => user.id === key);
        let guild = value.guild_id;
        let channel = value.channel_id;
        let time = Math.floor((Date.now() - value.time) / 1000);
        stream_time.labels(guild, channel, user.id, user.username).set(time);
    }



}


// functions used internally

async function getReaction(emote) {
    try {
        return EmojiManager.getByUnicode(emote.name).aliases[0];
    } catch (e) {
        return emote.name;
    }
}

async function recordMessageCount(data) {
    if (track_names) {
        msg_count.labels(data.server_id, data.channel_id, data.channel_name, data.user_id, data.user_name).inc();
    } else {
        msg_count.labels(data.server_id, data.channel_id, data.user_id).inc();
    }
}

async function recordMessageLength(data) {
    if (track_names) {
        msg_length.labels(data.server_id, data.channel_id, data.channel_name, data.user_id, data.user_name).set(data.character_count);
    } else {
        msg_length.labels(data.server_id, data.channel_id, data.user_id).set(data.character_count);
    }
}

async function recordMessageWordCount(data) {
    if (track_names) {
        msg_word_count.labels(data.server_id, data.channel_id, data.channel_name, data.user_id, data.user_name).set(data.word_count);
    } else {
        msg_word_count.labels(data.server_id, data.channel_id, data.user_id).set(data.word_count);
    }
}

async function recordToxicityScore(message) {
    const requestBody = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "comment": {
                "text": message.content
            },
            "languages": ["en"],
            "requestedAttributes": {
                "TOXICITY": {}
            }
        })
    };
    const response = await fetch(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_KEY}`, requestBody);
    try {
        const json = await response.json();
        const value = json.attributeScores.TOXICITY.summaryScore.value;
        if (track_names) {
            toxicityScore.labels(message.guild.id, message.channel.id, message.channel.name, message.author.id, message.author.username, message.content).set(value);
        }
        else {
            toxicityScore.labels(message.guild.id, message.channel.id, message.author.id, message.content).set(value);
        }
    } catch (exception) {
        console.log(exception);
    }
}

   

module.exports = { messageCollector, reactionCollector, memberCollector, boostCollector, onlineCollector, guildCollector, pingCollector, voiceCollector, counterCheker };