const mysql = require('mysql2');
const logger = require("./Logger.js");

// get mysql db info
connection = mysql.createConnection({
  host     : process.env.sql_host,
  user     : process.env.sql_user,
  password : process.env.sql_password,
  database : process.env.sql_database,
  insecureAuth : true,
  multipleStatements: true
});

// connect to mysql db
connection.connect();

// create a function that does the same as enmap.get
async function get(server) {
  // console.log(server);
  let s = await new Promise((resolve, reject) => {
    connection.query(`SELECT settings FROM settings WHERE server = '${server}'`, function (err, result, fields) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
  // console.log(`get settings: ${s.settings}`);
  return await JSON.parse(JSON.parse(JSON.stringify(s.settings)));
}

// create a function that does the same as enmap.set
function set(server, settings) {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE settings SET settings = '${settings}' WHERE server = '${server}'`, function (err, result, fields) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// create a function that does the same as enmap.ensure
// if the server doesn't exist, it will create it
// if the server does exist, it will update the settings
function ensure(server, settings) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM settings WHERE server = '${server}'`, function (err, result, fields) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        if (result.length == 0) {
          connection.query(`INSERT INTO settings (server, settings) VALUES ('${server}', '${settings}')`, function (err, result, fields) {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        } else {
          connection.query(`UPDATE settings SET settings = '${settings}' WHERE server = '${server}'`, function (err, result, fields) {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
}


// create a function that does the same as enmap.filter
function filter(server, settings) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM settings WHERE server = '${server}' AND settings = '${settings}'`, function (err, result, fields) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// create a function that does the same as enmap.delete
function deleteKey(server) {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM settings WHERE server = '${server}'`, function (err, result, fields) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// create a function that does the same as enmap.has
function has(server) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM settings WHERE server = '${server}'`, function (err, result, fields) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(result.length > 0);
      }
    });
  });
}

module.exports = { get, set, ensure, filter, deleteKey, has };
