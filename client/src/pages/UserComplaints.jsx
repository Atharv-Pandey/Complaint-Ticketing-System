import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import GreetingCard from '../components/GreetingCard'
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faClipboardList,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faEye,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const UserComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await api.get('/complaints');

        setComplaints(res.data || []);
        setStats({
          total: res.data.length,
          pending: res.data.filter(c => c.status === 'submitted').length,
          inProgress: res.data.filter(c => c.status === 'in_progress').length,
          resolved: res.data.filter(c => c.status === 'resolved').length
        });
        setError('');
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.response?.data?.message || 'Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return faClock;
      case 'in_progress': return faSpinner;
      case 'resolved': return faCheckCircle;
      case 'rejected': return faTimesCircle;
      default: return faClipboardList;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <GreetingCard role={user?.role} name={user?.name} />
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '12px' }} />
        My Complaints
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h3" align="center" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="h6" align="center">
                Total Complaints
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h3" align="center" color="warning.main">
                {stats.pending}
              </Typography>
              <Typography variant="h6" align="center">
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h3" align="center" color="info.main">
                {stats.inProgress}
              </Typography>
              <Typography variant="h6" align="center">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h3" align="center" color="success.main">
                {stats.resolved}
              </Typography>
              <Typography variant="h6" align="center">
                Resolved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          component={RouterLink}
          to="/create-complaint"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
        >
          New Complaint
        </Button>
      </Box>

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
            startIcon={<FontAwesomeIcon icon={faPlus} />}
          >
            Create Your First Complaint
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {complaints.map((complaint) => (
            <Grid item xs={12} sm={6} md={4} key={complaint._id}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography variant="h6" component="div">
                      #{complaint._id.slice(-6)}
                    </Typography>
                    <Chip
                      icon={<FontAwesomeIcon icon={getStatusIcon(complaint.status)} />}
                      label={complaint.status.replace('_', ' ')}
                      color={getStatusColor(complaint.status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {complaint.description.length > 100
                      ? `${complaint.description.substring(0, 100)}...`
                      : complaint.description}
                  </Typography>

                  {complaint.assignedTo && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Assigned to: {complaint.assignedTo.name}
                    </Typography>
                  )}
                </CardContent>

                <Divider />

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  p: 2
                }}>
                  <Button
                    component={RouterLink}
                    to={`/complaints/${complaint._id}`}
                    size="small"
                    startIcon={<FontAwesomeIcon icon={faEye} />}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UserComplaints;
