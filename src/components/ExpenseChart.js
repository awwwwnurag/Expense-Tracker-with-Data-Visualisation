import React, { useMemo } from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { useExpenses } from '../context/LocalStorageContext';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
);

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const vibrantColors = [
  '#FF6B6B', // Red-ish
  '#4ECDC4', // Teal
  '#45B7D1', // Light Blue
  '#F7FF7C', // Bright Yellow
  '#96CEB4', // Green-ish
  '#B14AED', // Purple
  '#FF8C00', // Dark Orange
  '#00BFFF', // Deep Sky Blue
  '#ADFF2F', // Green Yellow
  '#FF1493', // Deep Pink
];

const ExpenseChart = () => {
  const { getCategoryTotals, getMonthlyExpenses, categories, getAverageMonthlyExpense, getCurrentMonthExpensesTotal, getPreviousMonthExpensesTotal } = useExpenses();
  const theme = useTheme();

  const chartData = useMemo(() => {
    const categoryTotals = getCategoryTotals();
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    const backgroundColors = categories.map((_, index) => {
      return vibrantColors[index % vibrantColors.length];
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color + '80'),
          borderWidth: 2,
          hoverOffset: 20,
        },
      ],
    };
  }, [getCategoryTotals, categories]);

  // New data for monthly comparison chart
  const comparisonData = useMemo(() => {
    const currentMonthTotal = getCurrentMonthExpensesTotal();
    const previousMonthTotal = getPreviousMonthExpensesTotal();
    const today = new Date();
    const currentMonthLabel = today.toLocaleString('default', { month: 'long', year: 'numeric' });
    today.setMonth(today.getMonth() - 1);
    const previousMonthLabel = today.toLocaleString('default', { month: 'long', year: 'numeric' });

    return {
      labels: [previousMonthLabel, currentMonthLabel],
      datasets: [
        {
          label: 'Expense',
          data: [previousMonthTotal, currentMonthTotal],
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.main,
          tension: 0.4,
          fill: false,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    };
  }, [getCurrentMonthExpensesTotal, getPreviousMonthExpensesTotal, theme]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${formatAmount(context.raw)}`;
          }
        }
      }
    },
  };

  // Options for monthly comparison line chart
  const comparisonLineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Current vs. Previous Month Expenses',
        font: {
          family: 'Poppins',
          size: 16,
          weight: '500',
        },
        color: theme.palette.text.primary,
        padding: 20,
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            return formatAmount(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          },
          font: {
            family: 'Poppins',
            size: 12,
            color: theme.palette.text.secondary,
          },
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Poppins',
            size: 12,
            color: theme.palette.text.secondary,
          },
        },
      },
    },
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
        <PieChartIcon /> Expense Analysis
      </Typography>
      <Box sx={{ mb: 4, height: { xs: 300, md: 400 }, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, height: '100%' }}>
          <Pie data={chartData} options={options} />
        </Box>
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          alignContent: 'flex-start',
          ml: 2,
          p: 1,
          maxWidth: '30%', // Adjust as needed
          maxHeight: '100%', // Allow scrolling if too many items
          overflowY: 'auto',
          alignItems: 'center'
        }}>
          {chartData.labels.map((label, index) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', mb: 1, mr: 2 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: chartData.datasets[0].backgroundColor[index],
                  mr: 1,
                  borderRadius: 0,
                }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          color: theme.palette.text.primary,
          mb: 3,
          mt: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <BarChartIcon /> Average Monthly Expense: {formatAmount(getAverageMonthlyExpense())}
      </Typography>

      <Box sx={{ height: 300 }}>
        <Line data={comparisonData} options={comparisonLineOptions} />
      </Box>
    </Paper>
  );
};

export default ExpenseChart; 