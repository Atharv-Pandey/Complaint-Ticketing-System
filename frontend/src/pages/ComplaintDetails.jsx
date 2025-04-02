import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardList,
  faUser,
  faPhone,
  faCalendar,
  faInfoCircle,
  faTools,
  faCheckCircle,
  faClock,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return faClock;
      case 'in_progress': return faTools;
      case 'resolved': return faCheckCircle;
      default: return faInfoCircle;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!complaint) return <Typography>Complaint not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Complaints
      </Button>

      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '12px' }} />
        Complaint Details
      </Typography>

      <Grid container spacing={3}>
        {/* Main Complaint Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h5">
                  #{complaint._id.slice(-6)}
                </Typography>
                <Chip
                  icon={<FontAwesomeIcon icon={getStatusIcon(complaint.status)} />}
                  label={complaint.status.replace('_', ' ')}
                  color={getStatusColor(complaint.status)}
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
                {complaint.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} />
                Additional Information
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faCalendar} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Created"
                    secondary={new Date(complaint.createdAt).toLocaleString()}
                  />
                </ListItem>
                {complaint.updatedAt && (
                  <ListItem>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faCalendar} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Last Updated"
                      secondary={new Date(complaint.updatedAt).toLocaleString()}
                    />
                  </ListItem>
                )}
                {complaint.contact && (
                  <ListItem>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faPhone} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Contact"
                      secondary={complaint.contact}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Status and Assignment Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                Assignment Details
              </Typography>

              {complaint.assignedTo ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FontAwesomeIcon 
                      icon={faUser} 
                      style={{ marginRight: '12px', fontSize: '1.5rem' }} 
                    />
                    <Box>
                      <Typography variant="body1">
                        {complaint.assignedTo.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Assigned Engineer
                      </Typography>
                    </Box>
                  </Box>
                  {complaint.assignedAt && (
                    <Typography variant="body2" color="text.secondary">
                      Assigned on: {new Date(complaint.assignedAt).toLocaleDateString()}
                    </Typography>
                  )}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Not yet assigned to an engineer
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px' }} />
                Status History
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faClipboardList} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Submitted"
                    secondary={new Date(complaint.createdAt).toLocaleString()}
                  />
                </ListItem>
                {complaint.status === 'in_progress' && complaint.assignedAt && (
                  <ListItem>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faTools} />
                    </ListItemIcon>
                    <ListItemText
                      primary="In Progress"
                      secondary={new Date(complaint.assignedAt).toLocaleString()}
                    />
                  </ListItem>
                )}
                {complaint.status === 'resolved' && complaint.updatedAt && (
                  <ListItem>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Resolved"
                      secondary={new Date(complaint.updatedAt).toLocaleString()}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComplaintDetails;
