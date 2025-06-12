import React, { createContext, useState, useEffect, useContext } from 'react';
import { useExpenses } from './LocalStorageContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username] && users[username].password === password) {
      setUser({ username });
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify({ username }));
      alert('Login successful!');
      return true;
    } else {
      alert('Invalid username or password.');
      return false;
    }
  };

  const signup = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
      alert('Username already exists.');
      return false;
    } else {
      users[username] = { password };
      localStorage.setItem('users', JSON.stringify(users));
      alert('Signup successful! Please login.');
      return true;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('currentUser');
    alert('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 