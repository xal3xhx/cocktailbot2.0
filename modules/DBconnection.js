const mysql = require('mysql2');

// get mysql db info
db_config = {
  host     : process.env.sql_host,
  user     : process.env.sql_user,
  password : process.env.sql_password,
  database : process.env.sql_database,
  insecureAuth : true,
  multipleStatements: true,
  connectTimeout: 600000 
};

var pool = mysql.createPool(db_config);

pool.getConnection(function(err, con) {
    if (err) {
     connection.release();
     console.log(' Error getting mysql_pool connection: ' + err);
     throw err;
    }
    console.log('Connected to Database');
   });

module.exports = pool;  