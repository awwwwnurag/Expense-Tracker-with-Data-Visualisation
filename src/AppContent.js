import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, TextField, Card, CardContent, Grid, Snackbar, Alert, FormControlLabel, Switch, Container, useTheme } from '@mui/material';
import { AuthContext } from './context/AuthContext';
import { useExpenses } from './context/LocalStorageContext';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import AuthForm from './components/AuthForm';

function AppContent({ darkMode, toggleDarkMode }) {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const { categories, budgets, setBudget, monthlyBudgets, setMonthlyBudget, getCurrentMonthExpensesTotal } = useExpenses();
  const theme = useTheme(); // Use useTheme hook to access the theme provided by App.js

  const [budgetValues, setBudgetValues] = useState(budgets);
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState(() => {
    const today = new Date();
    const currentMonthYear = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    return monthlyBudgets[currentMonthYear] || '';
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setBudgetValues(budgets);
  }, [budgets]);

  useEffect(() => {
    const today = new Date();
    const currentMonthYear = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    setMonthlyBudgetInput(monthlyBudgets[currentMonthYear] || '');
  }, [monthlyBudgets]);

  const handleBudgetChange = (category, value) => {
    setBudgetValues(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSetMonthlyBudget = () => {
    const today = new Date();
    const currentMonthYear = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const amount = parseFloat(monthlyBudgetInput);
    if (!isNaN(amount) && amount >= 0) {
      setMonthlyBudget(currentMonthYear, amount);
      setSuccess(true);
      setError('');
    } else {
      setError('Please enter a valid monthly budget');
      setSuccess(false);
    }
  };

  const handleSaveBudgets = () => {
    try {
      Object.entries(budgetValues).forEach(([category, amount]) => {
        if (amount && !isNaN(amount) && parseFloat(amount) >= 0) {
          setBudget(category, parseFloat(amount));
        }
      });
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Error saving budgets');
      setSuccess(false);
    }
  };

  const handleExportData = () => {
    const data = {
      expenses: JSON.parse(localStorage.getItem('expenses') || '[]'),
      budgets: JSON.parse(localStorage.getItem('budgets') || '{}')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <Box>
      <Box sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        py: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Container maxWidth={false} sx={{
          backdropFilter: 'blur(10px) saturate(180%)',
          WebkitBackdropFilter: 'blur(10px) saturate(180%)', // For Safari support
          background: theme.palette.background.paper,
          borderRadius: '20px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          p: 4, // Add some padding inside the frosted glass container
        }}>
          <Box sx={{ my: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                mb: 4,
                textShadow: darkMode ? '2px 2px 4px rgba(0,0,0,0.3)' : '2px 2px 4px rgba(0,0,0,0.1)',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100px',
                  height: '4px',
                  background: darkMode ? 'linear-gradient(90deg, #B8D8D8 0%, #7F9C9F 100%)' : 'linear-gradient(90deg, #7F9C9F 0%, #B8D8D8 100%)',
                  borderRadius: '2px',
                },
                '&::before': {
                  content: '"💰"',
                  marginRight: '12px',
                  fontSize: '0.9em',
                }
              }}
            >
              Expense Tracker
            </Typography>

            {isLoggedIn ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={darkMode}
                        onChange={toggleDarkMode}
                        color="primary"
                      />
                    }
                    label="Dark Mode"
                    sx={{ mr: 2, color: theme.palette.text.primary }}
                  />
                  <Typography variant="body1" sx={{ mr: 2, color: theme.palette.text.primary }}>
                    Welcome, {user && user.username}!
                  </Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={logout}
                    sx={{
                      borderRadius: 8,
                      textTransform: 'none',
                      borderColor: 'secondary.light',
                      color: theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: 'secondary.light',
                        borderColor: 'secondary.main',
                      },
                    }}
                  >
                    Logout
                  </Button>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary, mb: 2 }}>
                    Monthly Budget
                  </Typography>
                  <TextField
                    label="Set Monthly Budget"
                    type="number"
                    value={monthlyBudgetInput}
                    onChange={(e) => setMonthlyBudgetInput(e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      style: { color: theme.palette.text.secondary },
                    }}
                    InputProps={{
                      style: { color: theme.palette.text.primary },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSetMonthlyBudget}
                    sx={{
                      mt: 1,
                      borderRadius: 8,
                      textTransform: 'none',
                      background: darkMode
                        ? 'linear-gradient(45deg, #4A7B7D 30%, #7F9C9F 90%)'
                        : 'linear-gradient(45deg, #7F9C9F 30%, #B8D8D8 90%)',
                      '&:hover': {
                        background: darkMode
                          ? 'linear-gradient(45deg, #7F9C9F 30%, #4A7B7D 90%)'
                          : 'linear-gradient(45deg, #4A7B7D 30%, #7F9C9F 90%)',
                      },
                    }}
                  >
                    Set Budget
                  </Button>

                  <Card variant="outlined" sx={{ mt: 3, p: 2, background: theme.palette.background.paper, boxShadow: theme.shadows[3] }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                        Current Month's Expenses:
                      </Typography>
                      <Typography variant="h5" sx={{ color: theme.palette.primary.main, mb: 2 }}>
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getCurrentMonthExpensesTotal())}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                        Budget Remaining:
                      </Typography>
                      <Typography variant="h5" sx={{
                        color: (monthlyBudgets[`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`] || 0) - getCurrentMonthExpensesTotal() >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main
                      }}>
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                          (monthlyBudgets[`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`] || 0) - getCurrentMonthExpensesTotal()
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 3,
                  '& > *': {
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  },
                }}>
                  <Box>
                    <ExpenseForm />
                    <ExpenseList />
                  </Box>
                  <Box>
                    <ExpenseChart />
                  </Box>
                </Box>

                {/* Budget Settings */}
                <Box mt={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Budget Settings
                      </Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        Set monthly budgets for each category
                      </Typography>

                      <Grid container spacing={2}>
                        {categories.map((category) => (
                          <Grid item xs={12} sm={6} key={category}>
                            <TextField
                              fullWidth
                              label={`${category} Budget`}
                              type="number"
                              value={budgetValues[category] || ''}
                              onChange={(e) => handleBudgetChange(category, e.target.value)}
                              InputProps={{
                                startAdornment: '₹'
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>

                      <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSaveBudgets}
                        >
                          Save Budgets
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* Data Management */}
                <Box mt={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Data Management
                      </Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        Export your expense data or clear all data
                      </Typography>

                      <Box display="flex" gap={2}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleExportData}
                        >
                          Export Data
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={handleClearAllData}
                        >
                          Clear All Data
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </>
            ) : (
              <AuthForm />
            )}
          </Box>
        </Container>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Settings saved successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AppContent; 