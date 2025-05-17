import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

const NotFound: React.FC = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" color="primary" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: '600px', mb: 4 }}>
          Oops! The page you're looking for doesn't exist or has been moved.
          Just like a bonsai tree, sometimes we need to prune paths to help others grow.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          size="large"
        >
          Return to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound; 