var connection = require('./DBconnection.js');

// create a table if it doesn't exist
// table name: quotes
// columns: quote_id, user_id, quote, server_id
// primary key: quote_id
connection.query(`
    CREATE TABLE IF NOT EXISTS quotes (
        quote_id INT NOT NULL AUTO_INCREMENT,
        user_id VARCHAR(1000) NOT NULL,
        quote VARCHAR(1000) NOT NULL,
        server_id VARCHAR(1000) NOT NULL,
        PRIMARY KEY (quote_id)
    );`, (err, res) => {
    if (err) throw err;
});


// function to add a quote
// args: user_id, quote, server_id
// retirns: quote_id
function addQuote(user_id, quote, server_id) {
    return new Promise((resolve, reject) => {
        connection.query(`
            INSERT INTO quotes (user_id, quote, server_id)
            VALUES (?, ?, ?)
        `, [user_id, quote, server_id], (err, res) => {
            if (err) reject(err);
            try {
                resolve(res.insertId);
            }
            catch (err) {
                reject(err);
            }
        });
    });
}

// function to remove a quote
// args: quote_id
function removeQuote(quote_id) {
    connection.query(`
        DELETE FROM quotes
        WHERE quote_id = ?`, [quote_id], (err, res) => {
        if (err) throw err;
    });
}

// function to get all quotes from a server
// args: server_id
function getAllQuotes(server_id) {
    return new Promise((resolve, reject) => {
        connection.query(`
            SELECT * FROM quotes
            WHERE server_id = ?`, [server_id], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

// funtion to get a random quote from a server
// args: server_id
function getRandomQuote(server_id) {
    return new Promise(function (resolve, reject) {
        connection.query(`
            SELECT * FROM quotes
            WHERE server_id = '${server_id}'
            ORDER BY RAND()
            LIMIT 1`,
            function (err, result) {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
}

// function to get a random quote from a user
// args: user_id, server_id
function getRandomQuoteFromUser(user_id, server_id) {
    return new Promise(function (resolve, reject) {
        connection.query(`
            SELECT * FROM quotes
            WHERE user_id = '${user_id}'
            AND server_id = '${server_id}'
            ORDER BY RAND()
            LIMIT 1`,
            function (err, result) {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
}




module.exports = { addQuote, removeQuote, getAllQuotes, getRandomQuote, getRandomQuoteFromUser };