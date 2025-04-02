import { Box, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

const StatusTimeline = ({ items }) => {
  return (
    <Box sx={{
      position: 'relative',
      paddingLeft: 'var(--space-md)',
      margin: 'var(--space-lg) 0',
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '7px',
        top: 0,
        bottom: 0,
        width: '2px',
        background: 'var(--border)'
      }
    }}>
      {items.map((item, index) => (
        <Box key={index} sx={{
          position: 'relative',
          paddingBottom: 'var(--space-lg)',
          paddingLeft: 'var(--space-lg)'
        }}>
          <Box sx={{
            position: 'absolute',
            left: 0,
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            border: '3px solid var(--bg-dark)',
            zIndex: 1,
            color: getStatusColor(item.status)
          }}>
            <FontAwesomeIcon icon={faCircle} size="xs" />
          </Box>
          <Box sx={{
            background: 'var(--bg-light)',
            borderRadius: '8px',
            padding: 'var(--space-md)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 'var(--space-sm)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateX(5px)',
              boxShadow: 'var(--shadow-md)'
            }
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-xs)'
            }}>
              <Typography variant="body1" sx={{
                fontWeight: 600,
                color: getStatusColor(item.status)
              }}>
                {formatStatus(item.status)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                {item.time}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              {item.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

function getStatusColor(status) {
  switch (status) {
    case 'submitted': return 'var(--orange)';
    case 'in_progress': return 'var(--warning)';
    case 'resolved': return 'var(--success)';
    case 'rejected': return 'var(--danger)';
    default: return 'var(--text-primary)';
  }
}

function formatStatus(status) {
  return status.replace('_', ' ');
}

export default StatusTimeline;
