require('dotenv').config();

let dbInfo = {
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    timezone: 'utc'
}


module.exports = {dbInfo, forwardEmail};