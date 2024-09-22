import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Button, SvgIcon, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

export default function Subscriptions() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseColor, setResponseColor] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const proUser = localStorage.getItem('proUser');
    if (proUser === 'true') {
      setIsDisabled(true); // Disable buttons if token exists
    }
  }, []);

  const handleSubscribe = async () => {
    try {const userId=localStorage.getItem('id')
        const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `https://midmailbackend.azurewebsites.net/Authentication/subscribe?userId=${userId}` );
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('authToken', token); // Update authToken in localStorage
        localStorage.setItem('proUser', true); // Update proUser in localStorage

        // Update response message and color
        setResponseMessage('Subscription successful!');
        setResponseColor('green');
      } else {
        setResponseMessage('Subscription failed! Please try again.');
        setResponseColor('red');
      }
    } catch (error) {
      console.error('Error during subscription:', error);
      setResponseMessage('An error occurred during subscription. Please try again.');
      setResponseColor('red');
    }
    setOpen(false); // Close modal after submitting
  };

  const handleClickOpen = (plan) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cardData = [
    {
      title: "Free plan",
      price: 49,
      features: [
        { text: "20000 Emails per month", available: true },
        { text: "Integration help", available: true },
        { text: "API Access", available: false },
        { text: "Complete documentation", available: false },
        { text: "24×7 phone & email support", available: false },
      ],
    },
    {
      title: "Premium plan",
      price: 99,
      features: [
        { text: "200.000 Emails per month", available: true },
        { text: "Integration help", available: true },
        { text: "API Access", available: true },
        { text: "Complete documentation", available: true },
        { text: "24×7 phone & email support", available: false },
      ],
    },
    {
      title: "Enterprise plan",
      price: 199,
      features: [
        { text: "Unlimited Emails per month", available: true },
        { text: "Integration help", available: true },
        { text: "API Access", available: true },
        { text: "Complete documentation", available: true },
        { text: "24×7 phone & email support", available: true },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {cardData.map((card, index) => (
        <Card
          key={index}
          sx={{ maxWidth: 345, backgroundColor: '#1e1e1e', color: '#ffffff' }}
          className='subscription-card'
        >
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              {card.title}
            </Typography>
            <Typography variant="h4" component="div">
              ${card.price}
              <span style={{ fontSize: '18px', color: '#888888' }}> /month</span>
            </Typography>
            <List>
              {card.features.map((feature, i) => (
                <ListItem key={i} dense>
                  <SvgIcon
                    sx={{ color: feature.available ? '#06b6d4' : '#666666' }}
                    component={feature.available ? CheckCircleIcon : CancelIcon}
                  />
                  <ListItemText
                    primary={feature.text}
                    primaryTypographyProps={{
                      style: {
                        color: feature.available ? '#ffffff' : '#888888',
                        textDecoration: feature.available ? 'none' : 'line-through',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#06b6d4',
                '&:hover': { backgroundColor: '#0891b2' },
                color: '#ffffff',
                mt: 2,
              }}
              disabled={isDisabled || index === 0} // Disable if token exists or for the first button
              onClick={() => handleClickOpen(card)} // Open modal with selected plan
            >
              Choose plan
            </Button>
          </CardContent>
        </Card>
      ))}
      {responseMessage && (
        <Typography variant="h6" style={{ color: responseColor, marginTop: '20px' }}>
          {responseMessage}
        </Typography>
      )}

      {/* Modal Component */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Payment</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Plan: {selectedPlan?.title}</Typography>
          <TextField
            autoFocus
            margin="dense"
            id="cardNumber"
            label="Card Number"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="expiryDate"
            label="Expiry Date"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="cvv"
            label="CVV"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubscribe} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
