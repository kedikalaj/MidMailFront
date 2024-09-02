import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Sales() {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '100vh',
        bgcolor: 'background.paper',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Sales Overview
        </Typography>
        <Typography variant="body1">
          Welcome to the Sales page. Here you can find detailed information about sales, including metrics, trends, and analytics.
        </Typography>
        {/* Add more content or components here as needed */}
      </Paper>
    </Box>
  );
}

export default Sales;
