import { Card, CardContent, Typography } from '@mui/material';

const GreetingCard = ({ role, name }) => {
  const getRoleDetails = () => {
    switch(role) {
      case 'admin':
        return {
          title: 'Hello',
          subtitle: 'Administrator Dashboard Overview',
          accentColor: '#ff9800'
        };
      case 'junior_engineer':
        return {
          title: 'Welcome',
          subtitle: 'Your Assigned Complaints Overview',
          accentColor: '#2196F3'
        };
      default:
        return {
          title: 'Hi',
          subtitle: 'Your Complaint Status Overview',
          accentColor: '#4CAF50'
        };
    }
  };

  const { title, subtitle, accentColor } = getRoleDetails();

  return (
    <Card sx={{ 
      mb: 4, 
      backgroundColor: 'black',
      color: 'white',
      borderLeft: `4px solid ${accentColor}`
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
