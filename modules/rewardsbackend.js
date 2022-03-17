var connection = require('./DBconnection.js');
const crypto = require("crypto");

// create a table if it doesn't exist
// table name: points_rewards
// columns: reward_id, cost, reward, server_id
// reward is optional

connection.query(`
    CREATE TABLE IF NOT EXISTS points_rewards (
        reward_id VARCHAR(32) NOT NULL,
        cost INT NOT NULL,
        reward VARCHAR(1000) NOT NULL,
        server_id VARCHAR(1000) NOT NULL,
        PRIMARY KEY (reward_id)
        );`, (err, res) => {
    if (err) throw err;
});

// function to add a reward
// args: cost, reward, server_id
// returns: reward_id
async function addReward(cost, reward, server_id) {
    let id = crypto.randomBytes(4).toString("hex");
    return new Promise((resolve, reject) => {
        connection.query(`
            INSERT INTO points_rewards (reward_id, cost, reward, server_id)
            VALUES (?, ?, ?, ?)
        `, [id, cost, reward, server_id], (err, res) => {
            if (err) reject(err);
            try {
                resolve(id);
            }
            catch (err) {
                reject(err);
            }
        });
    });
}

// function to remove a reward
// args: reward_id, server_id
function removeReward(reward_id, server_id) {
    connection.query(`
        DELETE FROM points_rewards
        WHERE reward_id = ? AND server_id = ?`, [reward_id, server_id], (err, res) => {
        if (err) throw err;
    });
}

// function to get all rewards for a server
async function getAllRewards(server_id) {
    return new Promise((resolve, reject) => {
        connection.query(`
            SELECT * FROM points_rewards
            WHERE server_id = ?`, [server_id], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

// function to get reward by id
// args: reward_id, server_id
async function getReward(reward_id, server_id) {
    return new Promise((resolve, reject) => {
        connection.query(`
            SELECT * FROM points_rewards
            WHERE reward_id = ? AND server_id = ?`, [reward_id, server_id], (err, res) => {
            if (err) reject(err);
            resolve(res[0]);
        });
    });
}

module.exports = { addReward, removeReward, getAllRewards, getReward };