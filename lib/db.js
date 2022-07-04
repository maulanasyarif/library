var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "express_crud",
});

connection.connect(function (err) {
  if (!!err) {
    console.log("Error");
  } else {
    console.log("Connected");
  }
});

module.exports = connection;
