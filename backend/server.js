const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initializeDB } = require('./db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const requireAuth = require('./middleware/requireAuth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Initialize the database table
initializeDB();

// Setup routes mapping logic
app.use('/auth', authRoutes);
app.use('/expenses', requireAuth, expenseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
