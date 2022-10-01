const { voiceCollector } = require('../Stats/Pusher.js');

module.exports = async (client, oldState, newState) => {
    // joing channel: 
    if (oldState.channelId === null && newState.channelId !== null) {
        // user joined a voice channel
        let count = await newState.guild.members.cache.filter(m => m.voice.channel).size;
        await voiceCollector(newState.guild.id,newState.channelId, false, count, null);
        // add user to voice_time map
        client.container.voice_time.set(newState.id,
            {
                "guild_id": newState.guild.id,
                "channel_id": newState.channelId,
                "user_id": newState.id,
                "time": Date.now()
            });

    }
    if (oldState.channelId !== null && newState.channelId !== null && oldState.channelId !== newState.channelId) {
        // user moved to another voice channel
        let count = await newState.guild.members.cache.filter(m => m.voice.channel).size;
        await voiceCollector(newState.guild.id,newState.channelId, false, count, null);
        await voiceCollector(newState.guild.id,oldState.channelId, false, count-1, null);
        // update user in voice_time map
        client.container.voice_time.set(newState.id,
            {
                "guild_id": newState.guild.id,
                "channel_id": newState.channelId,
                "user_id": newState.id,
                "time": Date.now()
            });
    }
    // check if someone left a voice channel
    if (oldState.channelId !== null && newState.channelId === null) {
        // user left a voice channel
        let count = await newState.guild.members.cache.filter(m => m.voice.channel).size;
        await voiceCollector(newState.guild.id,oldState.channelId, false, count, null);
        // remove user from voice_time map
        client.container.voice_time.delete(newState.id);
    }
    // check if someone started streaming
    if (oldState.streaming === false && newState.streaming === true) {
        // user started streaming
        let count = await newState.guild.members.cache.filter(m => m.voice.channel).size;
        await voiceCollector(newState.guild.id,newState.channelId, true, count, null);
        // add user to stream_time map
        client.container.stream_time.set(newState.id,
            {
                "guild_id": newState.guild.id,
                "channel_id": newState.channelId,
                "user_id": newState.id,
                "time": Date.now()
            });
    }
    // check if someone stopped streaming
    if (oldState.streaming === true && newState.streaming === false) {
        // user stopped streaming
        let count = await newState.guild.members.cache.filter(m => m.voice.channel).size;
        await voiceCollector(newState.guild.id,oldState.channelId, true, count, null);
        // remove user from stream_time map
        client.container.stream_time.delete(newState.id);
    }
};