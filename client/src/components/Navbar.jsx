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
      zIndex: (theme) => theme.zIndex.drawer + 1,
      '& .MuiToolbar-root': {
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        padding: '0 32px'
      }
    }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'var(--text-primary)',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            '&:hover': {
              cursor: 'pointer'
            }
          }}
        >
          <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '10px' }} />
          Complaint System
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/admin"
                  startIcon={<FontAwesomeIcon icon={faUserShield} />}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 152, 0, 0.1)'
                    }
                  }}
                >
                  Admin
                </Button>
              )}
              {user.role === 'junior_engineer' && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/engineer"
                  startIcon={<FontAwesomeIcon icon={faUserCog} />}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 152, 0, 0.1)'
                    }
                  }}
                >
                  Engineer
                </Button>
              )}
              {user.role === 'user' && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/complaints"
                  startIcon={<FontAwesomeIcon icon={faClipboardList} />}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 152, 0, 0.1)'
                    }
                  }}
                >
                  My Complaints
                </Button>
              )}
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 152, 0, 0.1)'
                  }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 152, 0, 0.1)'
                  }
                }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/register')}
                startIcon={<FontAwesomeIcon icon={faUserPlus} />}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 152, 0, 0.1)'
                  }
                }}
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
