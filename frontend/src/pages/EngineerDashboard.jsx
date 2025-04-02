import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  ButtonGroup,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton
} from '@mui/material';
import GreetingCard from '../components/GreetingCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardList,
  faSpinner,
  faCheckCircle,
  faUser,
  faPhone,
  faAlignLeft,
  faPlay,
  faClock,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

const EngineerDashboard = () => {
  const { user } = useAuth();
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0
  });

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      const currentComplaint = assignedComplaints.find(c => c._id === complaintId);
      if (!currentComplaint) return;

      await api.put(`/complaints/${complaintId}/status`, { status: newStatus });
      setAssignedComplaints(assignedComplaints.map(complaint =>
        complaint._id === complaintId ? { ...complaint, status: newStatus } : complaint
      ));

      const updatedStats = { ...stats };
      if (newStatus === 'in_progress') {
        updatedStats.inProgress += 1;
        updatedStats.pending -= 1;
      } else if (newStatus === 'resolved') {
        updatedStats.resolved += 1;
        updatedStats.inProgress -= 1;
      } else if (newStatus === 'rejected') {
        updatedStats.rejected += 1;
        if (currentComplaint.status === 'in_progress') {
          updatedStats.inProgress -= 1;
        } else {
          updatedStats.pending -= 1;
        }
      }
      setStats(updatedStats);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    const fetchAssignedComplaints = async () => {
      try {
        const res = await api.get('/complaints/assigned');
        setAssignedComplaints(res.data);

        const assigned = res.data.length;
        const pending = res.data.filter(c => c.status === 'submitted').length;
        const inProgress = res.data.filter(c => c.status === 'in_progress').length;
        const resolved = res.data.filter(c => c.status === 'resolved').length;
        const rejected = res.data.filter(c => c.status === 'rejected').length;

        setStats({
          assigned,
          pending,
          inProgress,
          resolved,
          rejected
        });
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchAssignedComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'primary';
      case 'in_progress': return 'warning';
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

  const formatStatus = (status) => {
    return status.replace('_', ' ');
  };

  return (
    <Box sx={{
      p: 3,
      backgroundColor: 'var(--bg-dark)',
      minHeight: '100vh',
      color: 'var(--text-primary)',
      fontFamily: '"Inter", sans-serif'
    }}>
      <GreetingCard role={user?.role} name={user?.name} />
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '12px' }} />
        Complaint System
      </Typography>

      <Divider sx={{
        borderColor: 'divider',
        mb: 3,
        borderBottomWidth: 2
      }} />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={4}>
          <Card sx={{
            backgroundColor: 'var(--bg-light)',
            border: '1px solid var(--border)',
            borderRadius: '8px'
          }}>
            <CardContent>
              <Typography variant="h3" component="div" align="center" sx={{ color: 'primary.main' }}>
                {stats.assigned}
              </Typography>
              <Typography variant="h6" align="center">
                <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '8px' }} />
                Assigned Complaints
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{
            backgroundColor: 'var(--bg-light)',
            border: '1px solid var(--border)',
            borderRadius: '8px'
          }}>
            <CardContent>
              <Typography variant="h3" component="div" align="center" sx={{ color: '#ffc107' }}>
                {stats.inProgress}
              </Typography>
              <Typography variant="h6" align="center">
                <FontAwesomeIcon icon={faSpinner} style={{ marginRight: '8px' }} />
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{
            backgroundColor: 'var(--bg-light)',
            border: '1px solid var(--border)',
            borderRadius: '8px'
          }}>
            <CardContent>
              <Typography variant="h3" component="div" align="center" sx={{ color: '#4caf50' }}>
                {stats.resolved}
              </Typography>
              <Typography variant="h6" align="center">
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '8px' }} />
                Resolved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{
            backgroundColor: 'var(--bg-light)',
            border: '1px solid var(--border)',
            borderRadius: '8px'
          }}>
            <CardContent>
              <Typography variant="h3" component="div" align="center" sx={{ color: '#f44336' }}>
                {stats.rejected}
              </Typography>
              <Typography variant="h6" align="center">
                <FontAwesomeIcon icon={faTimesCircle} style={{ marginRight: '8px' }} />
                Rejected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Your Assigned Complaints
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'var(--bg-light)',
          border: '1px solid var(--border)',
          borderRadius: '8px'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'background.paper' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>
                <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '8px' }} />
                Complaint ID
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                Customer
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
                Contact
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                <FontAwesomeIcon icon={faAlignLeft} style={{ marginRight: '8px' }} />
                Description
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignedComplaints.map((complaint) => (
              <TableRow
                key={complaint._id}
                sx={{
                  '&:hover': {
                    backgroundColor: '#252525'
                  }
                }}
              >
                <TableCell>#{complaint._id.slice(-6)}</TableCell>
                <TableCell>{complaint.customer?.name || 'N/A'}</TableCell>
                <TableCell>{complaint.contact}</TableCell>
                <TableCell>{complaint.description}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={getStatusColor(complaint.status)}
                    size="small"
                    sx={{
                      textTransform: 'capitalize',
                      minWidth: 100
                    }}
                  >
                    {complaint.status === 'in_progress' && (
                      <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '8px' }} />
                    )}
                    {complaint.status === 'resolved' && (
                      <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '8px' }} />
                    )}
                    {formatStatus(complaint.status)}
                  </Button>
                </TableCell>
                <TableCell sx={{ textAlign: 'center'}}>
                  <ButtonGroup size="small">
                    {complaint.status === 'submitted' && (
                      <>
                        <Button
                          onClick={() => handleStatusUpdate(complaint._id, 'in_progress')}
                          color="primary"
                          variant="contained"
                          startIcon={<FontAwesomeIcon icon={faPlay} />}
                        >
                          Start Work
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate(complaint._id, 'rejected')}
                          color="error"
                          variant="outlined"
                          startIcon={<FontAwesomeIcon icon={faTimesCircle} />}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {complaint.status === 'in_progress' && (
                      <>
                        <Button
                          onClick={() => handleStatusUpdate(complaint._id, 'resolved')}
                          color="success"
                          variant="contained"
                          startIcon={<FontAwesomeIcon icon={faCheckCircle} />}
                        >
                          Resolve
                        </Button>
                        &nbsp; &nbsp; &nbsp;
                        <Button
                          onClick={() => handleStatusUpdate(complaint._id, 'rejected')}
                          color="error"
                          variant="outlined"
                          startIcon={<FontAwesomeIcon icon={faTimesCircle} />}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EngineerDashboard;
