const { pool } = require('../db');

const getExpenses = async (userId, category, sort) => {
  let query = 'SELECT * FROM expenses WHERE user_id = $1';
  const params = [userId];
  let paramIndex = 2;

  if (category && category !== 'All') {
    query += ` WHERE category = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }

  // Sort by date requested?
  if (sort === 'date_desc') {
    query += ' ORDER BY date DESC, created_at DESC';
  } else if (sort === 'date_asc') {
    query += ' ORDER BY date ASC, created_at ASC';
  } else {
    // default sort
    query += ' ORDER BY date DESC, created_at DESC';
  }

  const result = await pool.query(query, params);
  return result.rows;
};

const findByIdempotencyKey = async (userId, idempotencyKey) => {
  const existing = await pool.query('SELECT * FROM expenses WHERE user_id = $1 AND idempotency_key = $2', [userId, idempotencyKey]);
  return existing.rows.length > 0 ? existing.rows[0] : null;
};

const createExpense = async ({ userId, amount, category, description, date, idempotencyKey }) => {
  const result = await pool.query(
    'INSERT INTO expenses (user_id, amount, category, description, date, idempotency_key) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [userId, amount, category, description, date, idempotencyKey]
  );
  return result.rows[0];
};

module.exports = {
  getExpenses,
  findByIdempotencyKey,
  createExpense
};
