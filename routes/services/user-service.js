const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const config = require('../../config');

const UserService = {
  createUser: async ({ email, password }) => {
    try {
      const connection = await mysql.createConnection(config.mysqlCreds);
      const bcryptedPassword = await bcrypt.hashSync(password, 5);
      let [rows, fields] = await connection.query(
        `SELECT * FROM users WHERE email = :email;`,
        { email }
      );

      if (rows[0]) {
        return 'User already exists';
      }

      [rows] = await connection.query(
        'INSERT INTO users (email, password) VALUES (:email, :password);', 
        { email, password: bcryptedPassword });

      connection.destroy();
      return rows.insertId;
    } catch(err) {
      // err
      console.log(err);
      return 'error';
    }
  },
  getUser: async ({ email }) => {
    try {
      const connection = await mysql.createConnection(config.mysqlCreds);
      const [rows, fields] = await connection.query(
        'SELECT * FROM users WHERE email = :email;',
        { email }
      );

      connection.destroy();
      return rows[0];
    } catch (error) {
      // err
    }
  }
}

module.exports = UserService;
