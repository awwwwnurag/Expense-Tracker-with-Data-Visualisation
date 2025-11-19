import React, { useState } from 'react';
import { Paper, TextField, Button, Box, MenuItem, Typography, useTheme } from '@mui/material';
import { useExpenses } from '../context/LocalStorageContext';
import AddIcon from '@mui/icons-material/Add';

const ExpenseForm = () => {
  const { addExpense, categories } = useExpenses();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) {
      alert('Please fill in all fields');
      return;
    }
    addExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3,
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
        <AddIcon /> Add New Expense
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{
              style: { color: theme.palette.text.secondary },
            }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
              },
            }}
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{
              style: { color: theme.palette.text.secondary },
            }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
            inputProps={{ step: "0.01" }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
              },
            }}
          />
          <TextField
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{
              style: { color: theme.palette.text.secondary },
            }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
              },
            }}
          >
            {categories.map((category) => (
              <MenuItem 
                key={category} 
                value={category}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.text.primary,
                  },
                }}
              >
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ 
              shrink: true,
              style: { color: theme.palette.text.secondary },
            }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
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
            Add Expense
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ExpenseForm; 