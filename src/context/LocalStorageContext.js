import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
];

export const LocalStorageProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [monthlyBudgets, setMonthlyBudgets] = useState({});

  useEffect(() => {
    if (user && user.username) {
      const userExpensesKey = `expenses_${user.username}`;
      const userBudgetsKey = `budgets_${user.username}`;
      const userMonthlyBudgetsKey = `monthlyBudgets_${user.username}`;

      const savedExpenses = localStorage.getItem(userExpensesKey);
      const savedBudgets = localStorage.getItem(userBudgetsKey);
      const savedMonthlyBudgets = localStorage.getItem(userMonthlyBudgetsKey);

      setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);
      setBudgets(savedBudgets ? JSON.parse(savedBudgets) : {});
      setMonthlyBudgets(savedMonthlyBudgets ? JSON.parse(savedMonthlyBudgets) : {});
    } else {
      setExpenses([]);
      setBudgets({});
      setMonthlyBudgets({});
    }
  }, [user]);

  useEffect(() => {
    if (user && user.username) {
      const userExpensesKey = `expenses_${user.username}`;
      localStorage.setItem(userExpensesKey, JSON.stringify(expenses));
    }
  }, [expenses, user]);

  useEffect(() => {
    if (user && user.username) {
      const userBudgetsKey = `budgets_${user.username}`;
      localStorage.setItem(userBudgetsKey, JSON.stringify(budgets));
    }
  }, [budgets, user]);

  useEffect(() => {
    if (user && user.username) {
      const userMonthlyBudgetsKey = `monthlyBudgets_${user.username}`;
      localStorage.setItem(userMonthlyBudgetsKey, JSON.stringify(monthlyBudgets));
    }
  }, [monthlyBudgets, user]);

  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  const updateExpense = (id, updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    ));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const setBudget = (category, amount) => {
    setBudgets({ ...budgets, [category]: amount });
  };

  const setMonthlyBudget = (monthYear, amount) => {
    setMonthlyBudgets(prev => ({
      ...prev,
      [monthYear]: amount
    }));
  };

  const getExpensesByCategory = (category) => {
    return expenses.filter(expense => expense.category === category);
  };

  const getExpensesByDateRange = (startDate, endDate) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  };

  const getTotalExpenses = (expenseList = expenses) => {
    return expenseList.reduce((total, expense) => total + expense.amount, 0);
  };

  const getCategoryTotals = () => {
    return EXPENSE_CATEGORIES.reduce((totals, category) => {
      const categoryExpenses = getExpensesByCategory(category);
      totals[category] = getTotalExpenses(categoryExpenses);
      return totals;
    }, {});
  };

  const getMonthlyExpensesByPeriod = () => {
    const monthlyTotals = {};
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthYear = `${year}-${month}`;
      monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + expense.amount;
    });
    return monthlyTotals;
  };

  const getAverageMonthlyExpense = () => {
    const monthlyTotals = getMonthlyExpensesByPeriod();
    const months = Object.keys(monthlyTotals).length;
    if (months === 0) return 0;
    const totalAllExpenses = Object.values(monthlyTotals).reduce((sum, total) => sum + total, 0);
    return totalAllExpenses / months;
  };

  const getCurrentMonthExpensesTotal = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentMonthYear = `${currentYear}-${currentMonth}`;
    const monthlyTotals = getMonthlyExpensesByPeriod();
    return monthlyTotals[currentMonthYear] || 0;
  };

  const getPreviousMonthExpensesTotal = () => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    const previousYear = today.getFullYear();
    const previousMonth = String(today.getMonth() + 1).padStart(2, '0');
    const previousMonthYear = `${previousYear}-${previousMonth}`;
    const monthlyTotals = getMonthlyExpensesByPeriod();
    return monthlyTotals[previousMonthYear] || 0;
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      budgets,
      monthlyBudgets,
      categories: EXPENSE_CATEGORIES,
      addExpense,
      updateExpense,
      deleteExpense,
      setBudget,
      setMonthlyBudget,
      getExpensesByCategory,
      getExpensesByDateRange,
      getTotalExpenses,
      getCategoryTotals,
      getMonthlyExpenses: getMonthlyExpensesByPeriod,
      getAverageMonthlyExpense,
      getCurrentMonthExpensesTotal,
      getPreviousMonthExpensesTotal,
      setExpenses
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}; 