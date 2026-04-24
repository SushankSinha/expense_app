const expenseModel = require('../models/expenseModel');
const { z } = require('zod');
const { expenseSchema } = require('../validators/expenseValidator');

const getExpenses = async (req, res) => {
  const userId = req.user.id;
  const { category, sort } = req.query;
  try {
    const expenses = await expenseModel.getExpenses(userId, category, sort);
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createExpense = async (req, res) => {
  const userId = req.user.id;
  const idempotencyKey = req.headers['x-idempotency-key'];

  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Missing x-idempotency-key header' });
  }

  try {
    // 1. Zod Validation
    const validatedData = expenseSchema.parse(req.body);
    const { amount, category, description, date } = validatedData;

    // 2. Check if we already processed this request
    const existing = await expenseModel.findByIdempotencyKey(userId, idempotencyKey);
    if (existing) {
      return res.status(200).json(existing);
    }

    // 3. Insert new record
    const newExpense = await expenseModel.createExpense({ userId, amount, category, description, date, idempotencyKey });
    res.status(201).json(newExpense);
  } catch (error) {
    if (error && error.name === 'ZodError') {
      const issues = error.issues || error.errors || [];
      const errorMessage = issues.map(e => e.message).join(', ') || 'Validation failed';
      return res.status(400).json({ error: errorMessage, details: issues });
    }

    // If concurrent requests happened, uniqueness violation might occur
    if (error.code === '23505') { // PostgreSQL unique violation error code
        const existing = await expenseModel.findByIdempotencyKey(userId, idempotencyKey);
        if (existing) {
           return res.status(200).json(existing);
        }
    }
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getExpenses,
  createExpense
};
