import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Chip,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useExpenses } from '../context/LocalStorageContext';

const vibrantCategoryColors = {
  'Food & Dining': '#FF6B6B',
  'Transportation': '#4ECDC4',
  'Housing': '#45B7D1',
  'Utilities': '#DAA520',
  'Entertainment': '#96CEB4',
  'Shopping': '#B14AED',
  'Healthcare': '#FF8C00',
  'Education': '#00BFFF',
  'Travel': '#ADFF2F',
  'Other': '#FF1493',
};

const ExpenseList = () => {
  const { expenses, deleteExpense, categories } = useExpenses();
  const theme = useTheme();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    return vibrantCategoryColors[category] || '#CCCCCC'; // Default to a grey if category color not found
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        background: theme.palette.background.paper,
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          color: theme.palette.text.primary,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        Recent Expenses
      </Typography>
      {expenses.length === 0 ? (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          align="center"
          sx={{ py: 4 }}
        >
          No expenses added yet
        </Typography>
      ) : (
        <List sx={{ 
          '& .MuiListItem-root': {
            borderRadius: 2,
            mb: 1,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              transform: 'translateX(4px)',
            },
          },
        }}>
          {expenses.map((expense) => (
            <ListItem 
              key={expense.id} 
              divider
              sx={{
                border: '1px solid',
                borderColor: theme.palette.divider,
                borderRadius: 2,
                mb: 1,
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                    {expense.description}
                  </Typography>
                }
                secondary={
                  <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={expense.category}
                      size="small"
                      sx={{
                        backgroundColor: getCategoryColor(expense.category),
                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                        fontWeight: 500,
                      }}
                    />
                    <Typography component="span" variant="body2" color="text.secondary">
                      {formatDate(expense.date)}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    {formatAmount(expense.amount)}
                  </Typography>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteExpense(expense.id)}
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        color: theme.palette.error.main,
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default ExpenseList; 