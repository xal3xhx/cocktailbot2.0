var connection = require('./DBconnection.js');

// create a table if it doesn't exist
// table name: points
// columns: user_id, points, server_id
connection.query(`
    CREATE TABLE IF NOT EXISTS points (
    user_id VARCHAR(255) NOT NULL,
    points INT NOT NULL,
    server_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, server_id)
    )`, (err, results, fields) => {
    if (err) throw err;
});

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

// write a function to get points for a user id and return points
// if user id is not found add them to the table with 0 points
async function getPoints(user_id, server_id) {
    return new Promise( (resolve,reject) => {
        // check if user is in the table
        var result = connection.query(`SELECT * FROM points WHERE user_id = ${user_id} AND server_id = ${server_id}`,(err, results, fields) =>{
            if(err){
                reject(err);
            }
            if(results.length > 0){
                resolve(results[0].points);
            } else {
                // add user to the table
                connection.query(`INSERT INTO points (user_id, points, server_id) VALUES (${user_id}, 0, ${server_id})`,(err, results, fields) =>{
                    if(err){
                        reject(err);
                    }
                    resolve(0);
                })
            }
        })
    })
}

// function to add points to a user
async function addPoints(user_id, points, server_id) {
    return new Promise( (resolve,reject) => {
        // check if user is in the table
        var result = connection.query(`SELECT * FROM points WHERE user_id = ${user_id} AND server_id = ${server_id}`,(err, results, fields) =>{
            if(err){
                reject(err);
            }
            if(results.length > 0){
                // add points to the user
                connection.query(`UPDATE points SET points = points + ${points} WHERE user_id = ${user_id} AND server_id = ${server_id}`,(err, results, fields) =>{
                    if(err){
                        reject(err);
                    }
                    resolve(points);
                })
            } else {
                // add user to the table
                connection.query(`INSERT INTO points (user_id, points, server_id) VALUES (${user_id}, ${points}, ${server_id})`,(err, results, fields) =>{
                    if(err){
                        reject(err);
                    }
                    resolve(points);
                })
            }
        })
    })
}

// function to remove points from a user
async function removePoints(user_id, points, server_id) {
    return new Promise( (resolve,reject) => {
        // check if user is in the table
        var result = connection.query(`SELECT * FROM points WHERE user_id = ${user_id} AND server_id = ${server_id}`,(err, results, fields) =>{
            if(err){
                reject(err);
            }
            if(results.length > 0){
                // remove points from user
                connection.query(`UPDATE points SET points = points - ${points} WHERE user_id = ${user_id} AND server_id = ${server_id}`,(err, results, fields) =>{
                    if(err){
                        reject(err);
                    }
                    resolve(results);
                })
            } else {
                // add user to the table
                connection.query(`INSERT INTO points (user_id, points, server_id) VALUES (${user_id}, 0, ${server_id})`,(err, results, fields) =>{
                    if(err){
                        reject(err);
                    }
                    resolve(results);
                })
            }
        })
    })
}

// function to get top 10 points for a server and return user id and points
// if there are less than 10 users return all users
async function getTop10(server_id) {
    return new Promise( (resolve,reject) => {
        var result = connection.query(`SELECT * FROM points WHERE server_id = ${server_id} ORDER BY points DESC LIMIT 10`,(err, results, fields) =>{
            if(err){
                reject(err);
            }
            resolve(results);
        })
    })
}


module.exports = { getPoints, addPoints, removePoints, getTop10, getRewards, addReward, removeReward };