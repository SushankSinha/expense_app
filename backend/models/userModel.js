const { pool } = require('../db');
const bcrypt = require('bcrypt');

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const createUser = async ({ fullname, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING id, fullname, email',
    [fullname, email, hashedPassword]
  );
  return result.rows[0];
};

module.exports = {
  getUserByEmail,
  createUser
};
