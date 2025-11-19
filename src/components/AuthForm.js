import React, { useState, useContext } from 'react';
import { Paper, TextField, Button, Box, Typography, Tabs, Tab, Link, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';

const AuthForm = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const { login, signup } = useContext(AuthContext);
  const theme = useTheme(); // Use theme hook
  const darkMode = theme.palette.mode === 'dark'; // Determine dark mode state
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setSignupEmail('');
    setSignupError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSignupError(''); // Clear previous errors

    if (tabIndex === 0) { // Login
      login(username, password);
    } else { // Signup
      if (password !== confirmPassword) {
        setSignupError('Passwords do not match.');
        return;
      }
      signup(username, password);
    }
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setSignupEmail('');
  };

  const handleGoogleLogin = () => {
    alert('Sign in with Google not implemented yet.');
    // Implement Google login logic here
  };

  const handleForgotPassword = () => {
    setOpenForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setOpenForgotPassword(false);
    setEmail('');
  };

  const handleResetPassword = () => {
    alert(`Password reset link sent to ${email}`);
    handleCloseForgotPassword();
  };

  return (
    <Paper 
      elevation={3} 
      sx={{
        p: 3,
        maxWidth: 400,
        mx: 'auto',
        background: theme.palette.background.paper,
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        borderRadius: '16px',
        boxShadow: darkMode ? '0 8px 32px 0 rgba(0, 0, 0, 0.4)' : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 3 }}>
        Welcome
      </Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} centered sx={{ mb: 3 }}>
        <Tab label="Login" sx={{ color: theme.palette.text.primary }} />
        <Tab label="Sign Up" sx={{ color: theme.palette.text.primary }} />
      </Tabs>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
                borderRadius: 12,
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
              },
            }}
          />

          {tabIndex === 1 && (
            <TextField
              label="Email"
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
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
                  borderRadius: 12,
                  '&:hover fieldset': {
                    borderColor: 'primary.light',
                  },
                },
              }}
            />
          )}

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
                borderRadius: 12,
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
              },
            }}
          />

          {tabIndex === 1 && (
            <TextField
              label="Re-enter Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              error={password !== confirmPassword && confirmPassword !== ''}
              helperText={password !== confirmPassword && confirmPassword !== '' ? 'Passwords do not match' : ''}
              InputLabelProps={{
                style: { color: theme.palette.text.secondary },
              }}
              InputProps={{
                style: { color: theme.palette.text.primary },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  '&:hover fieldset': {
                    borderColor: 'primary.light',
                  },
                },
              }}
            />
          )}

          {signupError && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {signupError}
            </Alert>
          )}

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
            {tabIndex === 0 ? 'Login' : 'Sign Up'}
          </Button>

          {tabIndex === 0 && (
            <Link 
              component="button" 
              variant="body2" 
              onClick={handleForgotPassword} 
              sx={{ mt: 1, textAlign: 'center', color: theme.palette.text.secondary }}
            >
              Forgot Password?
            </Link>
          )}

          {tabIndex === 1 && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" align="center" sx={{ color: theme.palette.text.secondary }}>
                Or sign up with:
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<GoogleIcon />} 
                onClick={handleGoogleLogin}
                sx={{
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                Google
              </Button>
            </Box>
          )}
        </Box>
      </form>

      <Dialog open={openForgotPassword} onClose={handleCloseForgotPassword}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPassword}>Cancel</Button>
          <Button onClick={handleResetPassword} color="primary">Reset Password</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AuthForm; 