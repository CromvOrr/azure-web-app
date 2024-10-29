const mysql = require("mysql2");

var config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

function initializeDatabase() {
  const conn = new mysql.createConnection(config);
  conn.connect(function (err) {
    if (err) {
      console.log("Cannot connect\nError:");
      throw err;
    } else {
      console.log(
        "Database connection established [port " + process.env.DB_PORT + "]"
      );
      queryDatabase();
    }
  });

  function queryDatabase() {
    conn.query(
      "CREATE TABLE IF NOT EXISTS games (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, platform VARCHAR(255) NOT NULL, date_acquired DATE NOT NULL);",
      function (err, results, fields) {
        if (err) throw err;
        console.log("Using table: games");
      }
    );

    // conn.query("DROP TABLE IF EXISTS users;", function (err, results, fields) {
    //   if (err) throw err;
    //   console.log("Dropped table: users");
    // });

    conn.query(
      "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL);",
      function (err, results, fields) {
        if (err) throw err;
        console.log("Using table: users");
      }
    );

    conn.end(function (err) {
      if (err) throw err;
      else {
        setTimeout(function () {
          console.log("Done");
        }, 1000);
      }
    });
  }
}

module.exports = {
  initializeDatabase,
};
