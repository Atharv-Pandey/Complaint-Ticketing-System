import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Paper, Button, CircularProgress, Alert } from '@mui/material';

const ComplaintDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/complaints/${id}`);
        setComplaint(res.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load complaint');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!complaint) return <Typography>Complaint not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Complaint Details
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">ID: #{complaint._id.slice(-6)}</Typography>
        <Typography>Status: {complaint.status}</Typography>
        <Typography>Description: {complaint.description}</Typography>
        <Typography>Contact: {complaint.contact}</Typography>
        <Typography>
          Created: {new Date(complaint.createdAt).toLocaleString()}
        </Typography>
        {complaint.assignedTo && (
          <Typography>Assigned To: {complaint.assignedTo.name}</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ComplaintDetails;
