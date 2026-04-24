import React from 'react';
import { type Expense } from '../api';
import { CATEGORIES, formatCentsToCurrency } from '../utils';

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  filterCategory: string;
  setFilterCategory: (c: string) => void;
  sortParam: string;
  setSortParam: (s: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ 
  expenses, 
  loading, 
  error, 
  filterCategory, 
  setFilterCategory, 
  sortParam, 
  setSortParam 
}) => {
  return (
    <div className="glass-panel">
      <div className="toolbar">
        <h2>Recent Expenses</h2>
        <div className="filters">
          <select 
            className="form-control" 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '0.5rem', width: 'auto' }}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            className="form-control" 
            value={sortParam}
            onChange={(e) => setSortParam(e.target.value)}
            style={{ padding: '0.5rem', width: 'auto' }}
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
          </select>
        </div>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
      
      {loading ? (
        <div className="empty-state">Loading expenses...</div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">No expenses found for the selected filter.</div>
      ) : (
        <div className="expense-list">
          {expenses.map(exp => (
            <div key={exp.id} className="expense-card">
              <div className="expense-details">
                <div style={{ fontWeight: 500 }}>{exp.description || 'No description'}</div>
                <div className="expense-category-date">
                  <span className="category-badge">{exp.category}</span>
                  <span>{new Date(exp.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="expense-amount">
                {formatCentsToCurrency(exp.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
