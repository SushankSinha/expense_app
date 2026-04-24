import React, { useState } from 'react';
import { createExpense } from '../api';
import { CATEGORIES } from '../utils';

interface ExpenseFormProps {
  onSuccess: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }
    setSubmitting(true);
    try {
      const amountInCents = Math.round(parseFloat(amount) * 100);
      await createExpense({
        amount: amountInCents,
        category,
        description,
        date,
      });
      // Reset form
      setAmount('');
      setDescription('');
      
      onSuccess();
    } catch (err: any) {
      alert('Error creating expense: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Amount (₹)</label>
          <input 
            type="number" 
            step="0.01"
            min="0"
            max="21474836.47"
            className="form-control" 
            placeholder="e.g. 150.50" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select 
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Description (Optional)</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="What was this for?" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            className="form-control" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};
