import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  ButtonGroup,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import GreetingCard from '../components/GreetingCard'
import {
  FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
  faClipboardList,
  faSpinner,
  faCheckCircle,
  faUserCog,
  faSearch,
  faFilter,
  faUserTie,
  faPhone,
  faAlignLeft,
  faPlay,
  faCheck,
  faArrowRight,
  faUsers,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0,
    engineers: 0
  });

  const filteredComplaints = complaints.filter(complaint => {
    const statusMatch = statusFilter === 'all' || complaint.status === statusFilter;

    const searchLower = searchQuery.toLowerCase();
    const searchMatch =
      complaint._id.toLowerCase().includes(searchLower) ||
      (complaint.customer?.name && complaint.customer.name.toLowerCase().includes(searchLower)) ||
      (complaint.contact && complaint.contact.toLowerCase().includes(searchLower)) ||
      (complaint.description && complaint.description.toLowerCase().includes(searchLower)) ||
      (complaint.status && complaint.status.toLowerCase().includes(searchLower)) ||
      (complaint.assignedTo?.name && complaint.assignedTo.name.toLowerCase().includes(searchLower));

    return statusMatch && searchMatch;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaintsRes = await api.get('/complaints');
        setComplaints(complaintsRes.data);

        const engineersRes = await api.get('/users/engineers');
        setEngineers(engineersRes.data);
        setStats({
          pending: complaintsRes.data.filter(c => c.status === 'submitted').length,
          inProgress: complaintsRes.data.filter(c => c.status === 'in_progress').length,
          resolved: complaintsRes.data.filter(c => c.status === 'resolved').length,
          engineers: engineersRes.data.length
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      }
    };

    fetchData();
  }, []);

  const handleAssign = async (complaintId, engineerId) => {
    try {
      await api.put(`/complaints/${complaintId}/assign`, { engineerId });

      setComplaints(complaints.map(c =>
        c._id === complaintId ? {
          ...c,
          assignedTo: engineers.find(e => e._id === engineerId),
          status: 'in_progress'
        } : c
      ));
    } catch (error) {
      console.error('Error assigning complaint:', error);
      setError(error.response?.data?.error || 'Failed to assign complaint');
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return faClipboardList;
      case 'in_progress': return faSpinner;
      case 'resolved': return faCheckCircle;
      default: return faClipboardList;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Typography variant="h4" gutterBottom>
        <FontAwesomeIcon icon={faUserCog} style={{ marginRight: '12px' }} />
        Admin Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Manage complaints and assignments
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', backgroundColor: '#161b22' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FontAwesomeIcon icon={faClipboardList} size="lg" style={{
                  color: '#ff9800',
                  marginRight: '12px'
                }} />
                <Typography variant="h5" component="div">
                  {stats.pending}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                Pending Complaints
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', backgroundColor: '#161b22' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FontAwesomeIcon icon={faSpinner} size="lg" spin style={{
                  color: '#2196f3',
                  marginRight: '12px'
                }} />
                <Typography variant="h5" component="div">
                  {stats.inProgress}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', backgroundColor: '#161b22' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FontAwesomeIcon icon={faCheckCircle} size="lg" style={{
                  color: '#4caf50',
                  marginRight: '12px'
                }} />
                <Typography variant="h5" component="div">
                  {stats.resolved}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                Resolved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', backgroundColor: '#161b22' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FontAwesomeIcon icon={faUsers} size="lg" style={{
                  color: '#9c27b0',
                  marginRight: '12px'
                }} />
                <Typography variant="h5" component="div">
                  {stats.engineers}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                Active Engineers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2, backgroundColor: '#161b22' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <FontAwesomeIcon icon={faSearch} style={{ marginRight: '8px', color: '#8b949e' }} />
              )
            }}
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>
              <FontAwesomeIcon icon={faFilter} style={{ marginRight: '8px' }} />
              Status Filter
            </InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status Filter"
            >
              <MenuItem value="all">All Complaints</MenuItem>
              <MenuItem value="submitted">Submitted</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Complaints Table */}
      <Card sx={{ backgroundColor: '#161b22' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '12px' }} />
            Complaint Management
          </Typography>

          <TableContainer component={Paper} sx={{
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px'
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'background.paper' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Assigned To</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredComplaints.map((complaint) => (
                  <TableRow key={complaint._id}>
                    <TableCell>#{complaint._id.slice(-6)}</TableCell>
                    <TableCell>{complaint.customer?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
                        {complaint.contact}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={complaint.description}>
                        <Box sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px'
                        }}>
                          <FontAwesomeIcon icon={faAlignLeft} style={{ marginRight: '8px' }} />
                          {complaint.description}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<FontAwesomeIcon icon={getStatusIcon(complaint.status)} />}
                        label={complaint.status.replace('_', ' ')}
                        color={getStatusColor(complaint.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      {complaint.assignedTo ? (
                        <Chip
                          icon={<FontAwesomeIcon icon={faUserTie} />}
                          label={complaint.assignedTo.name}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label="Unassigned"
                          color="default"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {complaint.status === 'submitted' ? (
                        <FormControl size="small" fullWidth>
                          <Select
                            value=""
                            onChange={(e) => handleAssign(complaint._id, e.target.value)}
                            displayEmpty
                            sx={{ fontSize: '0.875rem' }}
                          >
                            <MenuItem value="" disabled>
                              Assign Engineer
                            </MenuItem>
                            {engineers.map(engineer => (
                              <MenuItem key={engineer._id} value={engineer._id}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <FontAwesomeIcon icon={faArrowRight} style={{ marginRight: '8px' }} />
                                  {engineer.name}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <ButtonGroup size="small">
                          <Button
                            onClick={() => navigate(`/complaints/${complaint._id}`)}
                            startIcon={<FontAwesomeIcon icon={faPlay} />}
                          >
                            Details
                          </Button>
                        </ButtonGroup>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;
