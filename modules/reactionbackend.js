var connection = require('./DBconnection.js');

// create a table if it doesn't exist
// table name: RollReactions
// columns: emoji, role_id, server_id, message_id
connection.query(`
    CREATE TABLE IF NOT EXISTS RollReactions (
    emoji VARCHAR(255) NOT NULL,
    role_id VARCHAR(255) NOT NULL,
    server_id VARCHAR(255) NOT NULL,
    message_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (emoji, server_id)
    )`, (err, results, fields) => {
    if (err) throw err;
});

// create a table if it doesn't exist
// table name: RewardReactions
// columns: reward, server_id, message_id
connection.query(`
    CREATE TABLE IF NOT EXISTS RewardReactions (
    reward VARCHAR(255) NOT NULL,
    server_id VARCHAR(255) NOT NULL,
    message_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (reward, server_id)
    )`, (err, results, fields) => {
    if (err) throw err;
});

// write a function to check if a Roll reaction is in the table and message id matches
// if it is return the role id
// if it isn't return false
async function checkRollReaction(emoji, server_id, message_id) {
  emoji = emoji.codePointAt(0).toString(16);
    return new Promise( (resolve,reject) => {
        var result = connection.query(`SELECT * FROM RollReactions WHERE emoji = "${emoji}" AND server_id = ${server_id} AND message_id = ${message_id}`,(err, results, fields) =>{
            if(err){
                console.log(`Error: ${err}`);
                reject(err);
            }
            if(results.length > 0){
                resolve(results[0].role_id);
            } else {
                resolve(false);
            }
        })
    })
}

// function to add a Roll reaction to the table
async function addRollReaction(emoji, role_id, server_id, message_id) {
  emoji = emoji.codePointAt(0).toString(16);
    return new Promise( (resolve,reject) => {
        var result = connection.query(`INSERT INTO RollReactions (emoji, role_id, server_id, message_id) VALUES ("${emoji}", ${role_id}, ${server_id}, ${message_id})`,(err, results, fields) =>{
            if(err){
                reject(err);
            }
            resolve(true);
        })
    })
}

// function to remove a Roll reaction from the table
// verify that the emoji is the same
// verify that the server id is the same
// verify that the message id is the same
async function removeRollReaction(emoji, role_id, server_id, message_id) {
    emoji = emoji.codePointAt(0).toString(16);
    return new Promise( (resolve,reject) => {
        var result = connection.query(`DELETE FROM RollReactions WHERE emoji = "${emoji}" AND role_id = ${role_id} AND server_id = ${server_id} AND message_id = ${message_id}`,(err, results, fields) =>{
            if(err){
                reject(err);
            }
            resolve(true);
        })
    })
}

// function to check if a Reward reaction is in the table and message id matches
// if it is return the reward name
// if it isn't return false
async function checkRewardReaction(server_id, message_id) {
    return new Promise( (resolve,reject) => {
        var result = connection.query(`SELECT * FROM RewardReactions WHERE server_id = ${server_id} AND message_id = ${message_id}`,(err, results, fields) =>{
            if(err){
                console.log(`Error: ${err}`);
                reject(err);
            }
            if(results.length > 0){
                resolve(results[0].reward);
            } else {
                resolve(false);
            }
        })
    })
}

// function to add a Reward reaction to the table
// on duplicate key update the message id
async function addRewardReaction(reward, server_id, message_id) {
    return new Promise( (resolve,reject) => {
        var result = connection.query(`INSERT INTO RewardReactions (reward, server_id, message_id) VALUES ("${reward}", ${server_id}, ${message_id}) ON DUPLICATE KEY UPDATE message_id = ${message_id}`,(err, results, fields) =>{
            if(err){
                reject(err);
            }
            resolve(true);
        })
    })
}

// function to remove a Reward reaction from the table
async function removeRewardReaction(reward, server_id) {
    return new Promise( (resolve,reject) => {
        var result = connection.query(`DELETE FROM RewardReactions WHERE reward = "${reward}" AND server_id = ${server_id}`,(err, results, fields) =>{
            if(err){
                reject(err);
            }
            resolve(true);
        })
    })
}

module.exports = {checkRewardReaction, addRewardReaction, removeRewardReaction, checkRollReaction, addRollReaction, removeRollReaction };