import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


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

  useEffect(() => {

    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      const emailFromToken = decodedToken['claim.email'];
      setFormData((prevData) => ({
        ...prevData,
        email: emailFromToken,
      }));
    }
  }, []);

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
      const response = await axios.post('https://localhost:7174/Authentication/updateUserGoogleCredentials', {
        email: formData.email,
        smtpServer: formData.smtpServer,
        smptPort: formData.smtpPort,
        smptPassword: formData.smtpPassword,
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
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: 'auto',
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" color='#FAF9F6' gutterBottom>
        Update Google Credentials
      </Typography>
      <br></br>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                readOnly: true, // Make the email field uneditable
              }}
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
          </Grid><br></br>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </Grid>
        </Grid>
      </form>
      {successMessage && <Typography color="green">{successMessage}</Typography>}
      {errorMessage && <Typography color="red">{errorMessage}</Typography>}

      <br></br> 
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
    Need Help Finding These Values?
  </Button>
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>SMTP Setup Help</DialogTitle>
    <DialogContent>
      <DialogContentText>
        If you're unsure how to find the SMTP settings, you can follow this &nbsp;
        <a 
          href="https://saurabh-nakoti.medium.com/how-to-set-up-smtp-in-gmail-using-an-app-password-96adffa164b3" 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{ backgroundColor: 'white', color: 'black' }} 
        >
          guide
        </a> 
        &nbsp; on setting up SMTP in Gmail using an app password.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>


    </Box>
  );
};

export default SignupSecondStep;
