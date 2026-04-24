import { useEffect, useState } from 'react';
import { fetchExpenses, type Expense, checkAuth, logoutApi } from './api';
import { formatCentsToCurrency } from './utils';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { AuthForm } from './components/AuthForm';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortParam, setSortParam] = useState('date_desc');

  useEffect(() => {
    const initAuth = async () => {
       try {
         await checkAuth();
         setIsAuthenticated(true);
       } catch (err) {
         setIsAuthenticated(false);
       } finally {
         setIsCheckingAuth(false);
       }
    };
    initAuth();
  }, []);

  const loadExpenses = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await fetchExpenses(filterCategory, sortParam);
      setExpenses(data);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch expenses: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
       loadExpenses();
    }
  }, [filterCategory, sortParam, isAuthenticated]);

  const totalCents = expenses.reduce((acc, exp) => acc + exp.amount, 0);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch(e) {}
    setIsAuthenticated(false);
    setExpenses([]);
  }

  if (isCheckingAuth) {
    return <div className="app-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white'}}>Loading Secure Session...</div>;
  }

  return (
    <div className="app-container">
      <header className="header" style={{ position: 'relative' }}>
        <h1>Expense Tracker</h1>
        <p>Know where your money goes</p>

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="btn"
            style={{ position: 'absolute', right: 0, top: '10px', padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.1)', color: 'white', borderRadius: '0.5rem', cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.2)' }}
          >
            Logout
          </button>
        )}
      </header>

      {!isAuthenticated ? (
        <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <>
          <ExpenseForm onSuccess={loadExpenses} />

          <div className="glass-panel total-summary">
            <div>Current Total</div>
            <div className="total-amount">{formatCentsToCurrency(totalCents)}</div>
          </div>

          <ExpenseList
            expenses={expenses}
            loading={loading}
            error={error}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            sortParam={sortParam}
            setSortParam={setSortParam}
          />
        </>
      )}
    </div>
  );
}

export default App;
