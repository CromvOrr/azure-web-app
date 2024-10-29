const mysql = require("mysql2/promise");

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

async function getConnection() {
  const connection = await mysql.createConnection(config);
  return connection;
}

module.exports.getAllGames = async () => {
  const connection = await getConnection();
  const [records] = await connection.query("SELECT * FROM games");
  connection.end();
  return records;
};

module.exports.getGameById = async (id) => {
  const connection = await getConnection();
  const [[record]] = await connection.query(
    "SELECT * FROM games WHERE id = ?",
    [id]
  );
  connection.end();
  return record;
};

module.exports.searchGames = async (query) => {
  const connection = await getConnection();

  const searchQuery = `
        SELECT * FROM games 
        WHERE title LIKE ? OR platform LIKE ?
      `;
  const searchTerm = `%${query}%`;

  const [rows] = await connection.query(searchQuery, [searchTerm, searchTerm]);
  connection.end();
  return rows;
};

module.exports.addOrEditGame = async (obj, id = 0) => {
  const connection = await getConnection();

  let query;
  let params;
  if (id == 0) {
    query =
      "INSERT INTO games (title, platform, date_acquired) VALUES (?, ?, ?)";
    params = [obj.title, obj.platform, obj.date_acquired];

    const [result] = await connection.query(query, params);
    const newGameId = result.insertId;
    const [newGameRows] = await connection.query(
      "SELECT * FROM games WHERE id = ?",
      [newGameId]
    );
    connection.end();
    return newGameRows[0];
  } else {
    query =
      "UPDATE games SET title = ?, platform = ?, date_acquired = ? WHERE id = ?";
    params = [obj.title, obj.platform, obj.date_acquired, id];

    const [{ affectedRows }] = await connection.query(query, params);
    if (affectedRows > 0) {
      const [updatedGameRows] = await connection.query(
        "SELECT * FROM games WHERE id = ?",
        [id]
      );
      connection.end();
      return updatedGameRows[0];
    } else {
      connection.end();
      return null;
    }
  }
};

module.exports.deleteGame = async (id) => {
  const connection = await getConnection();
  const query = "DELETE FROM games WHERE id = ?";
  const [{ affectedRows }] = await connection.query(query, [id]);
  connection.end();
  return affectedRows;
};

module.exports.getAllUsers = async () => {
  const connection = await getConnection();
  const [[user]] = await connection.query("SELECT * FROM users");
  connection.end();
  return user;
};

module.exports.getUserByUsername = async (username) => {
  const connection = await getConnection();
  const [[user]] = await connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );
  connection.end();
  return user;
};

module.exports.createUser = async (user) => {
  const connection = await getConnection();
  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  const params = [user.username, user.password];
  const [result] = await connection.query(query, params);
  const newUserId = result.insertId;
  const [[newUser]] = await connection.query(
    "SELECT * FROM users WHERE id = ?",
    [newUserId]
  );
  connection.end();
  return newUser;
};

module.exports.getSortedGames = async (sortBy = "title", order = "ASC") => {
  const connection = await getConnection();
  const validSortFields = ["title", "platform", "date_acquired"];
  const validOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";
  const sortField = validSortFields.includes(sortBy) ? sortBy : "title";
  const query = `SELECT * FROM games ORDER BY ${sortField} ${validOrder}`;
  const [records] = await connection.query(query);
  connection.end();
  return records;
};
