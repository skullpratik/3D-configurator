import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const LoadingScreen = ({ progress }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9999,
        color: 'white',
      }}
    >
      <CircularProgress 
        size={80} 
        thickness={4} 
        color="primary" 
        variant="determinate" 
        value={progress} 
      />
      <Typography variant="h6" sx={{ mt: 3 }}>
        Loading {progress}%
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        Preparing your cabinet...
      </Typography>
    </Box>
  );
};