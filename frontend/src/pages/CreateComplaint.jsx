import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Container,
  Paper, Alert
} from '@mui/material';
import api from '../api/axios'

const CreateComplaint = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.contact.match(/^[0-9]{10}$/)) {
      setError('Please enter a valid 10-digit contact number');
      return false;
    }
    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const response = await api.post('/complaints', {
        customerName: formData.name,
        customerEmail: formData.email,
        contact: formData.contact,
        description: formData.description
      });

      console.log('Response:', response.data);
      setSuccess(true);
      setTimeout(() => navigate('/complaints'), 2000);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Failed to create complaint');
    }
  };

  return (
    <Container maxWidth="xl" sx={{  // Changed from "md" to "xl"
      mt: 4,
      mb: 4
    }}>
      <Paper elevation={3} sx={{
        p: 4,
        width: '100%'
      }}>
        <Typography variant="h4" gutterBottom>
          Create New Complaint
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Complaint created successfully!</Alert>}

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
            label="Contact Number"
            name="contact"
            fullWidth
            margin="normal"
            value={formData.contact}
            onChange={handleChange}
            inputProps={{ pattern: "[0-9]{10}", title: "10 digit number" }}
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
            label="Complaint Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={formData.description}
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
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            fullWidth
          >
            Submit Complaint
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateComplaint;
