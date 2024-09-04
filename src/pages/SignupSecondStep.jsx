// SignupStep2.jsx
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import axios from 'axios';

const SignupSecondStep = () => {
  const [formData, setFormData] = useState({
    email: '',
    smtpServer: '',
    smtpPort: '',
    smtpPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.smtpServer) newErrors.smtpServer = 'SMTP Server is required';
    if (!formData.smtpPort) newErrors.smtpPort = 'SMTP Port is required';
    if (!formData.smtpPassword) newErrors.smtpPassword = 'SMTP Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post('/api/updateUserGoogleCredentials', {
        email: formData.email,
        smtpServer: formData.smtpServer,
        smtpPort: parseInt(formData.smtpPort, 10),
        smtpPassword: formData.smtpPassword,
      });

      // Save authToken and activeUser to localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('activeuser', response.data.activeUser);

      setSuccessMessage('Credentials updated successfully!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data || 'An error occurred');
      setSuccessMessage('');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: 'auto',
        padding: 4,
    
        borderRadius: 2, // Small border radius
        boxShadow: 3, // Optional: adds shadow for a lifted effect
      }}
    >
      <Typography variant="h4" color='#FAF9F6' gutterBottom>
        Update Google Credentials
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="SMTP Server"
              name="smtpServer"
              value={formData.smtpServer}
              onChange={handleChange}
              error={!!errors.smtpServer}
              helperText={errors.smtpServer}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="SMTP Port"
              name="smtpPort"
              type="number"
              value={formData.smtpPort}
              onChange={handleChange}
              error={!!errors.smtpPort}
              helperText={errors.smtpPort}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="SMTP Password"
              name="smtpPassword"
              type="password"
              value={formData.smtpPassword}
              onChange={handleChange}
              error={!!errors.smtpPassword}
              helperText={errors.smtpPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </Grid>
        </Grid>
      </form>
      {successMessage && <Typography color="green">{successMessage}</Typography>}
      {errorMessage && <Typography color="red">{errorMessage}</Typography>}
    </Box>
  );
};

export default SignupSecondStep;
