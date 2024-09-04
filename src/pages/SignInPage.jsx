import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Box, Button, Typography } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff', // Button color
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
    },
  },
});
const LoginPage = () => {
const navigate = useNavigate();



const handleSuccess= async (response) => {
 
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
      const res = jwtDecode(apiResponse.data.token);
      
      localStorage.setItem('authToken', apiResponse.data.token);
      localStorage.setItem('activeuser', apiResponse.data.activeUser);
      window.location.reload()
 
    } catch (error) {
      console.error('Error during registration:', error);
    }  
 
};

const handleError = (error) => {
  alert('Login Error:', error);

};



  return (
    <ThemeProvider theme={darkTheme}>
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '90vh',
          textAlign: 'center',
        }}
      >

        <Box
        borderRadius={5}
          component="img"
          src="https://via.placeholder.com/100"
          alt="App Logo"
          sx={{ width: 100, mb: 2 }}
        />
<br></br>
        {/* Slogan */}
        <Typography variant="h4" gutterBottom>
          More Email Marketing
        </Typography>
        <br></br>
        <GoogleLogin
        type="dark"
        onSuccess={handleSuccess}
        onError={handleError}
      />
       
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
