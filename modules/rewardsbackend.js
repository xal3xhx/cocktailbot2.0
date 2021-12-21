var connection = require('./DBconnection.js');

// create a table if it doesn't exist
// table name: points_rewards
// columns: cost, server_id, reward
// reward is optional
connection.query(`
    CREATE TABLE IF NOT EXISTS points_rewards (
    cost INT NOT NULL,
    server_id VARCHAR(255) NOT NULL,
    reward VARCHAR(255),
    PRIMARY KEY (cost, server_id)
    )`, (err, results, fields) => {
    if (err) throw err;
});

// write a function to get all rewards for a server and return cost and reward
// reward string is optional
// if reward string is provied return only rewards with that string
async function getRewards(server_id, reward) {
    return new Promise( (resolve,reject) => {
        var result = connection.query(`SELECT * FROM points_rewards WHERE server_id = ${server_id} ${reward ? `AND reward = "${reward}"` : ``}`,(err, results, fields) =>{
            if(err){
                reject(err);
            }
            resolve(results);
        })
    })
}

// write a function to add a reward to a server
async function addReward(cost, server_id, reward) {
    return new Promise( (resolve,reject) => {
        var result = connection.query(`INSERT INTO points_rewards (cost, server_id, reward) VALUES (${cost}, ${server_id}, ${reward})`,(err, results, fields) =>{
            if(err){
                reject(err);
            }
            resolve(results);
        })
    })
}

// write a function to remove a reward from a server
async function removeReward(reward, server_id) {
    return new Promise( (resolve,reject) => {
        var result = connection.query(`DELETE FROM points_rewards WHERE server_id = ${server_id} AND reward = "${reward}"`,(err, results, fields) =>{
            if(err){
                reject(err);
            }
            resolve(results);
        })
    })
}

module.exports = { getRewards, addReward, removeReward };