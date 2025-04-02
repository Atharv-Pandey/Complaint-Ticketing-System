import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const MyComplaints = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaints');
        setComplaints(res.data || []);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading complaints...</Typography>;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FontAwesomeIcon icon={faClipboardList} size="lg" style={{ marginRight: '12px' }} />
        <Typography variant="h4" component="h1">
          My Complaints
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {complaints.length === 0 ? (
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h5" gutterBottom>
            No complaints found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            You haven't submitted any complaints yet.
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/create-complaint"
          >
            Create Your First Complaint
          </Button>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'background.paper' }}>
                <TableCell>Complaint ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint._id}>
                  <TableCell>#{complaint._id.slice(-8)}</TableCell>
                  <TableCell>
                    <Chip
                      label={complaint.status.replace('_', ' ')}
                      color={getStatusColor(complaint.status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    {complaint.description.length > 50
                      ? `${complaint.description.substring(0, 50)}...`
                      : complaint.description}
                  </TableCell>
                  <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/complaints/${complaint._id}`)}
                      startIcon={<FontAwesomeIcon icon={faEye} />}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MyComplaints;
