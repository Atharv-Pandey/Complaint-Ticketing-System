import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import { 
  faSignInAlt,
  faEye,
  faEyeSlash,
  faLock,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ 
        p: 4,
        borderRadius: 2,
        background: 'linear-gradient(145deg, #161b22, #1a2029)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700,
            background: 'darkorange',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}>
            Complaint System
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* Username Field */}
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faUser} color="#ff9800" />
                </InputAdornment>
              ),
              sx: {
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ff9800',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.6)',
                },
                '& .Mui-focused': {
                  color: '#ff9800',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff9800 !important',
                  },
                },
              }
            }}
          />

          {/* Password Field */}
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faLock} color="#ff9800" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} color="#ff9800" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ff9800',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.6)',
                },
                '& .Mui-focused': {
                  color: '#ff9800',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff9800 !important',
                  },
                },
              }
            }}
          />

          {/* Login Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              background: 'darkorange'
            }}
            startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
          >
            Login
          </Button>

          {/* Divider */}
          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Register Link */}
          <Typography align="center" sx={{ color: 'text.secondary' }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: '#ff9800',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
