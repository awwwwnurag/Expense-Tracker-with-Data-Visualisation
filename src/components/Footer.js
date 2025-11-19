import React, { useContext } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const Footer = () => {
  const theme = useTheme();
  const { isLoggedIn } = useContext(AuthContext); // Use AuthContext
  const darkMode = theme.palette.mode === 'dark'; // Check if dark mode is active

  // Only render footer if logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <Box 
      sx={{
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: darkMode ? '#000000' : theme.palette.background.paper, // Temporarily force black for dark mode
        position: 'fixed',
        bottom: 0,
        width: '100%',
        borderTop: `1px solid ${theme.palette.divider}`, // Use theme divider color
        color: theme.palette.text.secondary, // Use theme text color
        boxShadow: theme.shadows[3], // Add a subtle shadow
        zIndex: theme.zIndex.appBar + 1, // Ensure it's above other content if needed
      }}
    >
      <Typography variant="body2">
        Made with ❤️ | © 2025. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer; 