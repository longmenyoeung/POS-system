const conection = require("../config/conection");
const logError = require("./logError");

exports.db = conection //from connection
exports.logErr = logError //from logError