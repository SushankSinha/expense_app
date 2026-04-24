export const formatCentsToCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(cents / 100);
};

export const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Others'];
