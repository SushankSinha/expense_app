const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initializeDB = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      fullname VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL,
      category VARCHAR(255) NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      idempotency_key VARCHAR(255) UNIQUE
    );
  `;
  try {
    await pool.query(query);
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

module.exports = {
  pool,
  initializeDB,
};
