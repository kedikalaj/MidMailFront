import React from 'react';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define the dark theme
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

// Styled container for a dark navy blue background with gradient
const FullScreenContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh', // Fills the whole screen
  textAlign: 'center',
  backgroundImage: 'radial-gradient(ellipse at center, #1a237e, #0d1b2a)', // Dark navy blue gradient
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover', // Ensures the gradient covers the whole screen
  padding: 20,
  ...(theme.palette.mode === 'dark' && {
    backgroundImage: 'radial-gradient(at center, #0d1b2a, #020c1b)', // Even darker gradient for dark mode
  }),
}));

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    console.log('Registration successful!', response);

    const decoded = jwtDecode(response.credential);
    const { email, sub, name } = decoded;
    const username = name.replace(/\s+/g, '');

    try {
      const apiResponse = await axios.post('https://localhost:7174/Authentication/register', {
        username: username,
        email: email,
        password: sub,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const res = jwtDecode(apiResponse.data.token);

      localStorage.setItem('authToken', apiResponse.data.token);
      localStorage.setItem('activeuser', apiResponse.data.activeUser);
      window.location.reload();
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const handleError = (error) => {
    alert('Login Error:', error);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <FullScreenContainer>
        <Box
          borderRadius={5}
          component="img"
          src="https://mui.com/static/logo.png"
          alt="MidMail Logo"
          sx={{ width: 100, mb: 2 }}
        />
        <Typography variant="h4" gutterBottom>
          Mid Mail
        </Typography>
        <br></br>
        <GoogleLogin
          type="dark"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </FullScreenContainer>
    </ThemeProvider>
  );
};

export default LoginPage;
