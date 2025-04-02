import { Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StatusBadge = styled(Chip)(({ status }) => ({
  fontWeight: 600,
  textTransform: 'capitalize',
  ...(status === 'submitted' && {
    backgroundColor: 'rgba(255, 123, 51, 0.15)',
    color: 'var(--orange)'
  }),
  ...(status === 'in_progress' && {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    color: 'var(--warning)'
  }),
  ...(status === 'resolved' && {
    backgroundColor: 'rgba(63, 185, 80, 0.15)',
    color: 'var(--success)'
  }),
  ...(status === 'rejected' && {
    backgroundColor: 'rgba(248, 81, 73, 0.15)',
    color: 'var(--danger)'
  })
}));

export default StatusBadge;
