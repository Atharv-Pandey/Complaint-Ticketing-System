import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Grid
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';

const UserComplaints = () => {
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
    const options = { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return '#ff9800';
      case 'in_progress': return '#2196f3';
      case 'resolved': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Complaint System
        </Typography>
      </Box>

      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        My Complaints
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Welcome Card */}
      <Card sx={{ mb: 3, backgroundColor: '#161b22' }}>
        <CardContent>
          <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
            Welcome, {user?.name}!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Need assistance? Register a new complaint and we'll help resolve your issue.
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/create-complaint"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            sx={{ mt: 1 }}
          >
            Register New Complaint
          </Button>
        </CardContent>
      </Card>

      {/* Recent Complaints Section */}
      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
        Your Recent Complaints
      </Typography>

      <Grid container spacing={2}>
        {complaints.slice(0, 3).map((complaint) => (
          <Grid item xs={12} key={complaint._id}>
            <Card variant="outlined" sx={{ p: 2, backgroundColor: '#161b22' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    #{complaint._id.slice(-6)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: getStatusColor(complaint.status), mt: 1 }}>
                    {complaint.status.replace('_', ' ')}
                  </Typography>
                </Box>
                  &nbsp;
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(complaint.createdAt)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                {complaint.description}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/complaints/${complaint._id}`)}
                startIcon={<FontAwesomeIcon icon={faEye} />}
              >
                View Details
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {complaints.length > 3 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            component={RouterLink} 
            to="/my-complaints" 
            variant="text"
          >
            View All
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UserComplaints;
