var connection = require('./DBconnection.js');

// create a table if it doesn't exist
// table name: reactions
// columns: emoji, role_id, server_id, message_id
connection.query(`
    CREATE TABLE IF NOT EXISTS reactions (
    emoji CHAR(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
    role_id VARCHAR(255) NOT NULL,
    server_id VARCHAR(255) NOT NULL,
    message_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (emoji, server_id)
    )`, (err, results, fields) => {
    if (err) throw err;
});

// write a function to check if a reaction is in the table and message id matches
// if it is return the role id
// if it isn't return false
async function checkReaction(emoji, server_id, message_id) {
  emoji = emoji.codePointAt(0).toString(16);
    return new Promise( (resolve,reject) => {
        var result = connection.query(`SELECT * FROM reactions WHERE emoji = "${emoji}" AND server_id = ${server_id} AND message_id = ${message_id}`,(err, results, fields) =>{
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

// function to add a reaction to the table
async function addReaction(emoji, role_id, server_id, message_id) {
  emoji = emoji.codePointAt(0).toString(16);
    return new Promise( (resolve,reject) => {
        var result = connection.query(`INSERT INTO reactions (emoji, role_id, server_id, message_id) VALUES ("${emoji}", ${role_id}, ${server_id}, ${message_id})`,(err, results, fields) =>{
            if(err){
                reject(err);
            }
            resolve(true);
        })
    })
}

// function to remove a reaction from the table
async function removeReaction(emoji, server_id, message_id) {
  emoji = emoji.codePointAt(0).toString(16);
    return new Promise( (resolve,reject) => {
        var result = connection.query(`DELETE FROM reactions WHERE emoji = "${emoji}" AND server_id = ${server_id} AND message_id = ${message_id}`,(err, results, fields) =>{
            if(err){
                reject(err);
            }
            resolve(true);
        })
    })
}

module.exports = { checkReaction, addReaction, removeReaction };