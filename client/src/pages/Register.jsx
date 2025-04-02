import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Container, Paper,
  FormControl, InputLabel, Select, MenuItem, Alert
} from '@mui/material';

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
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Complaint System
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful! Redirecting...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                '& fieldset': {
                  border: 'none'
                },
                '&:hover': {
                  borderColor: 'var(--orange)'
                },
                '&.Mui-focused': {
                  borderColor: 'var(--orange)',
                  boxShadow: '0 0 0 3px rgba(255, 123, 51, 0.2)'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-secondary)',
                '&.Mui-focused': {
                  color: 'var(--orange)'
                }
              }
            }}
          />
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                '& fieldset': {
                  border: 'none'
                },
                '&:hover': {
                  borderColor: 'var(--orange)'
                },
                '&.Mui-focused': {
                  borderColor: 'var(--orange)',
                  boxShadow: '0 0 0 3px rgba(255, 123, 51, 0.2)'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-secondary)',
                '&.Mui-focused': {
                  color: 'var(--orange)'
                }
              }
            }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                '& fieldset': {
                  border: 'none'
                },
                '&:hover': {
                  borderColor: 'var(--orange)'
                },
                '&.Mui-focused': {
                  borderColor: 'var(--orange)',
                  boxShadow: '0 0 0 3px rgba(255, 123, 51, 0.2)'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-secondary)',
                '&.Mui-focused': {
                  color: 'var(--orange)'
                }
              }
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                '& fieldset': {
                  border: 'none'
                },
                '&:hover': {
                  borderColor: 'var(--orange)'
                },
                '&.Mui-focused': {
                  borderColor: 'var(--orange)',
                  boxShadow: '0 0 0 3px rgba(255, 123, 51, 0.2)'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-secondary)',
                '&.Mui-focused': {
                  color: 'var(--orange)'
                }
              }
            }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                '& fieldset': {
                  border: 'none'
                },
                '&:hover': {
                  borderColor: 'var(--orange)'
                },
                '&.Mui-focused': {
                  borderColor: 'var(--orange)',
                  boxShadow: '0 0 0 3px rgba(255, 123, 51, 0.2)'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-secondary)',
                '&.Mui-focused': {
                  color: 'var(--orange)'
                }
              }
            }}
          />
          <TextField
            label="Contact"
            name="contact"
            fullWidth
            margin="normal"
            value={formData.contact}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                '& fieldset': {
                  border: 'none'
                },
                '&:hover': {
                  borderColor: 'var(--orange)'
                },
                '&.Mui-focused': {
                  borderColor: 'var(--orange)',
                  boxShadow: '0 0 0 3px rgba(255, 123, 51, 0.2)'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-secondary)',
                '&.Mui-focused': {
                  color: 'var(--orange)'
                }
              }
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="junior_engineer">Junior Engineer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>

            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>

        <Typography align="center">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
