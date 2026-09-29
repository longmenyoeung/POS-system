const mysql = require('mysql2/promise');
const config = require('../utils/config');

// Configuration object
const conection = mysql.createPool({
    host:config.db.HOST,
    user:config.db.USER,
    password:config.db.PASSWORD,
    database:config.db.NAME,
    port:config.db.PORT,
    namedPlaceholders:true
})


module.exports = conection;