import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const res = await api.get('/auth/verify');
        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          console.error('Invalid user data received');
          logout();
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    verifyUser();
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      navigate(getDashboardRoute(res.data.user.role));
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.error || error.message;
    }
  };
  
  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const getDashboardRoute = (role) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'junior_engineer': return '/engineer';
      default: return '/complaints';
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
