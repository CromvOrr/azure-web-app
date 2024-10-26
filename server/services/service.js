const { getConnection } = require("../config/database");

module.exports.getAllGames = async () => {
  const connection = await getConnection();
  const [records] = await connection.query("SELECT * FROM games");
  connection.release();
  records.forEach((row) => {
    row.date_acquired = row.date_acquired.toISOString().slice(0, 10);
  });
  return records;
};

module.exports.getGameById = async (id) => {
  const connection = await getConnection();
  const [[record]] = await connection.query(
    "SELECT * FROM games WHERE id = ?",
    [id]
  );
  connection.release();
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
  connection.release();
  rows.forEach((row) => {
    row.date_acquired = row.date_acquired.toISOString().slice(0, 10);
  });
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
    connection.release();
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
      connection.release();
      return updatedGameRows[0];
    } else {
      connection.release();
      return null;
    }
  }
};

module.exports.deleteGame = async (id) => {
  const connection = await getConnection();
  const query = "DELETE FROM games WHERE id = ?";
  const [{ affectedRows }] = await connection.query(query, [id]);
  connection.release();
  return affectedRows;
};
