import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { LocalStorageProvider } from './context/LocalStorageContext';
import { AuthProvider } from './context/AuthContext';
import AppContent from './AppContent';
import Footer from './components/Footer';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#7F9C9F', // Soft teal
        light: '#B8D8D8',
        dark: '#4A7B7D',
      },
      secondary: {
        main: '#E8A87C', // Soft coral
        light: '#F3D3B0',
        dark: '#D68A5F',
      },
      background: {
        default: darkMode ? '#121212' : '#F7F7F7',
        paper: darkMode ? '#1e1e1e' : '#FFFFFF',
      },
      text: {
        primary: darkMode ? '#E0E0E0' : '#4A4A4A', // Light grey for dark mode, dark grey for light mode
        secondary: darkMode ? '#A0A0A0' : '#707070', // Slightly darker grey for secondary text
      }
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h3: {
        fontFamily: '"Montserrat", "Poppins", sans-serif',
        fontWeight: 700,
        color: darkMode ? '#B8D8D8' : '#4A7B7D',
        letterSpacing: '0.5px',
      },
      h6: {
        fontWeight: 500,
        color: darkMode ? '#B8D8D8' : '#4A7B7D',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: 'all 0.3s ease-in-out',
            boxShadow: darkMode ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.05)',
            background: darkMode ? 'rgb(30, 30, 30)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px) saturate(180%)',
            WebkitBackdropFilter: 'blur(10px) saturate(180%)', // For Safari support
            '&:hover': {
              boxShadow: darkMode ? '0 8px 30px rgba(0, 0, 0, 0.6)' : '0 8px 30px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-5px)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 500,
            padding: '10px 24px',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
            },
          },
        },
      },
    },
  });

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <LocalStorageProvider>
            <AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <Footer />
          </LocalStorageProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App; 