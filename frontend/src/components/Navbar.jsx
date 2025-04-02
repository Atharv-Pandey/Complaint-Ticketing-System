import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardList,
  faUserShield,
  faUserCog,
  faSignInAlt,
  faUserPlus,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AppBar position="fixed" sx={{
      backgroundColor: 'background.paper',
      color: 'text.primary',
      boxShadow: 'none',
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}>
      <Toolbar sx={{
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        padding: '0 32px'
      }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'darkorange',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            '&:hover': {
              opacity: 0.9
            }
          }}
        >
          <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '10px' }} />
          Complaint System
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {user ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to={user.role === 'admin' ? '/admin' : user.role === 'junior_engineer' ? '/engineer' : '/complaints'}
                sx={{
                  color: 'darkorange',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 69, 0, 0.1)'
                  }
                }}
              >
                <FontAwesomeIcon 
                  icon={user.role === 'admin' ? faUserCog : faUserShield} 
                  style={{ marginRight: '8px' }} 
                />
                Dashboard
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  color: 'darkorange',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 69, 0, 0.1)'
                  }
                }}
                startIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{
                  color: 'darkorange',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 69, 0, 0.1)'
                  }
                }}
                startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/register')}
                sx={{
                  color: 'darkorange',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 69, 0, 0.1)'
                  }
                }}
                startIcon={<FontAwesomeIcon icon={faUserPlus} />}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
