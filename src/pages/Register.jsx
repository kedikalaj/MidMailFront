import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AppProvider } from '@toolpad/core/AppProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';  
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const token = localStorage.getItem('authToken');

  const handleSuccess= async (response) => {
    alert('Registration successful!', response);
    console.log('Registration successful!', response);

    const decoded = jwtDecode(response.credential);
    const { email, sub, name} = decoded;
    const username = name.replace(/\s+/g, ''); 
    
    try {
      const apiResponse = await axios.post('https://localhost:7174/Authentication/register', {
        username: username,
        email: email,
        password: sub
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Registration successful:', apiResponse.data);
      localStorage.setItem('authToken', apiResponse.data.token);
    } catch (error) {
      console.error('Error during registration:', error);
    }

  };
  const theme = createTheme({
    colorSchemes: { light: true, dark: true },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
});

  const handleError = (error) => {
    alert('Registration failed:', error);
    console.log('Registration failed:', error);
    // Handle the error here
  };
  return (
    <div>
      <h2>Register</h2>
      <AppProvider theme={theme}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </AppProvider>
      
    </div>
  );
};

export default Register;