const mysql = require('mysql2');

// get mysql db info
connection = mysql.createConnection({
  host     : process.env.sql_host,
  user     : process.env.sql_user,
  password : process.env.sql_password,
  database : process.env.sql_database,
  insecureAuth : true,
  multipleStatements: true
});

// connect to db
connection.connect();

async function randomdrink(server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`SELECT * FROM cocktails WHERE server_id = ${server_id} ORDER BY RAND() limit 1`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results[0]);
   })
  })
};

async function randomdrinkany() {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`SELECT * FROM cocktails ORDER BY RAND() limit 1`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results[0]);
   })
  })
};

async function fetchalldrinks(server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`SELECT * FROM cocktails WHERE server_id = ${server_id}`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function fetchalldrinksany() {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`SELECT * FROM cocktails`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function topdrinks(server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`select * from cocktails where server_id = ${server_id} ORDER BY up_vote DESC limit 3`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function topdrinksany() {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`select * from cocktails ORDER BY up_vote DESC limit 3`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function updateMessageID(oldid, newid, server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`UPDATE cocktails set message_id = ${newid} where message_id = ${oldid} and server_id = ${server_id}`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function getUpvotes(messageid, server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`select up_vote from cocktails where message_id = ${messageid} AND server_id = ${server_id} limit 1`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function getDownvotes(messageid, server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`select downvote from cocktails where message_id = ${messageid} AND server_id = ${server_id} limit 1`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function updateUpVote(newval, messageid, server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`UPDATE cocktails set up_vote = ${newval} where message_id = ${messageid} and server_id = ${server_id}`,(err, results, fields) =>{
      if(err){ 
        reject(err);
      }
      resolve(results);
   })
  })
};

async function updateDownVote(newval, messageid, server_id) {
       return new Promise( (resolve,reject) => {
    var result = connection.query(`UPDATE cocktails set downvote = ${newval} where message_id = ${messageid} and server_id = ${server_id}`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};

async function addDrink(name,description,image,ingredients,instructions,author,messageid,server_id) {
      return new Promise( (resolve,reject) => {
      var result = connection.query(`INSERT INTO cocktails(name, discription, image, ingredients, instructions, author, up_vote, downvote, message_id, server_id) VALUES ("${name}", "${description}", "${image}", '${ingredients}', "${instructions}", "${author}", '0', '0', "${messageid}", "${server_id}")`,(err, results, fields) =>{
      if(err){
        reject(err);
      }
      resolve(results);
   })
  })
};



module.exports = { randomdrink, randomdrinkany, fetchalldrinks, fetchalldrinksany, topdrinks, topdrinksany, updateMessageID, getUpvotes, getDownvotes, updateUpVote, updateDownVote, addDrink };