import React from 'react';
import { Alert, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error">
          Something went wrong. 
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </Alert>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
