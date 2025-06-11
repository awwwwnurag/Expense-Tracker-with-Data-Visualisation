import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Optionally, decode token to get user info or verify with backend
      setIsLoggedIn(true);
      // For now, we'll just assume a valid token means logged in and set a dummy user
      setUser({ username: 'User' }); // Replace with actual user info from token or backend
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
        setUser({ username }); // Set user based on login success
        alert('Login successful!');
        return true;
      } else {
        alert(data.message || 'Login failed.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Server error during login.');
      return false;
    }
  };

  const signup = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Automatically log in after signup
        setToken(data.token);
        setIsLoggedIn(true);
        setUser({ username }); // Set user based on signup success
        alert('Signup successful! You are now logged in.');
        return true;
      } else {
        alert(data.message || 'Signup failed.');
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Server error during signup.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
    setUser(null);
    alert('Logged out successfully.');
  };

  const forgotPassword = async (username) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        return true;
      } else {
        alert(data.message || 'Password reset request failed.');
        return false;
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      alert('Server error during password reset request.');
      return false;
    }
  };

  // For social logins, we will rely on server-side redirects
  const signInWithGoogle = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const signInWithFacebook = () => {
    window.location.href = 'http://localhost:5000/api/auth/facebook';
  };

  const handleAuthCallback = async (token) => {
    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
      setIsLoggedIn(true);
      // Fetch user info using the token
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    // Check for token in URL (for OAuth callbacks)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      handleAuthCallback(token);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      login,
      signup,
      logout,
      forgotPassword,
      signInWithGoogle,
      signInWithFacebook
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 