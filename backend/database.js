var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "ayh319",
  password: "fksl7132",
  database: "Test",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
connection.connect();

console.log("Test.Member connected");

module.exports = connection;
