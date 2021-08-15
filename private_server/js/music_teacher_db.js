const { createConnection } = require('mysql');
require('dotenv').config();
var db_connection = createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

db_connection.connect(function(err) {
    if (err) throw err;
    else console.log('Connected to database')
});

module.exports = db_connection;