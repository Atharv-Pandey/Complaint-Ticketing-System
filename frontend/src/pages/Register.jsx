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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  faUserPlus,
  faEye,
  faEyeSlash,
  faLock,
  faUser,
  faEnvelope,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    contact: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(formData);
      setSuccess(true);
      setError('');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed');
      setSuccess(false);
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
          <Typography variant="h5" sx={{ color: 'text.secondary' }}>
            Create Account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Registration successful! Redirecting...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* Name Field */}
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
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

          {/* Username Field */}
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
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

          {/* Email Field */}
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faEnvelope} color="#ff9800" />
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
            name="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
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

          {/* Confirm Password Field */}
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} color="#ff9800" />
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

          {/* Contact Field */}
          <TextField
            label="Contact"
            name="contact"
            fullWidth
            margin="normal"
            value={formData.contact}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faPhone} color="#ff9800" />
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

          {/* Role Selector */}
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ff9800',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ff9800',
                },
              }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="junior_engineer">Junior Engineer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          {/* Register Button */}
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
            startIcon={<FontAwesomeIcon icon={faUserPlus} />}
          >
            Register
          </Button>

          {/* Divider */}
          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Login Link */}
          <Typography align="center" sx={{ color: 'text.secondary' }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#ff9800',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
