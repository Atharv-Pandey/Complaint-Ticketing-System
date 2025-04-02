import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const ThemedButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'var(--orange)',
  color: 'var(--text-primary)',
  fontWeight: 500,
  borderRadius: '6px',
  padding: '0.75rem 1.5rem',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'var(--orange-dark)',
    boxShadow: 'var(--shadow-sm)'
  },
  '&.MuiButton-outlined': {
    backgroundColor: 'transparent',
    border: '1px solid var(--orange)',
    color: 'var(--orange)',
    '&:hover': {
      backgroundColor: 'var(--orange)',
      color: 'var(--text-primary)'
    }
  }
}));

export default ThemedButton;
