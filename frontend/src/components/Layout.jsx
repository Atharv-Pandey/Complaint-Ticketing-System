import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <Box sx={{ 
      display: 'flex',
      backgroundColor: '#0d1117',
      minHeight: '100vh'
    }}>
      <CssBaseline />
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          width: '100%',
          p: 4,
          marginTop: '64px',
          maxWidth: '1600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
