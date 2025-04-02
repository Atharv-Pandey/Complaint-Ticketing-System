import { Card, CardContent, Typography } from '@mui/material';

const GreetingCard = ({ role, name, sx = {} }) => {
  const getRoleDetails = () => {
    switch(role) {
      case 'admin':
        return {
          title: 'Hello',
          subtitle: 'Administrator Dashboard Overview',
          accentColor: '#ff9800',
          bgColor: '#161b22'
        };
      case 'junior_engineer':
        return {
          title: 'Welcome',
          subtitle: 'Your Assigned Complaints Overview',
          accentColor: '#2196F3',
          bgColor: '#161b22'
        };
      default:
        return {
          title: 'Hi',
          subtitle: 'Your Complaint Status Overview',
          accentColor: '#4CAF50',
          bgColor: '#f5f5f5'
        };
    }
  };

  const { title, subtitle, accentColor, bgColor } = getRoleDetails();

  return (
    <Card sx={{ 
      mb: 4, 
      backgroundColor: bgColor,
      color: 'white',
      borderLeft: `4px solid ${accentColor}`,
      ...sx
    }}>
      <CardContent>
        <Typography variant="h4" component="div">
          {title}, {name}!
        </Typography>
        <Typography variant="subtitle1">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GreetingCard;
