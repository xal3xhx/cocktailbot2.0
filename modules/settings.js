var connection = require('./DBconnection.js');

// create a function that does the same as enmap.get
async function get(server) {
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
// if the server doesn't exist load the default settings
// if the server does exist, do nothing
// if the server does exist, but the settings don't, load the default settings
function ensure(server, settings) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM settings WHERE server = '${server}'`, function (err, result, fields) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        if (result.length > 0) {
          resolve(result);
        } else {
          connection.query(`INSERT INTO settings (server, settings) VALUES ('${server}', '${settings}')`, function (err, result, fields) {
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
