import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Container, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const SendEmailPage = () => {
  const { register, handleSubmit, setValue, control, formState: { errors }, watch } = useForm();
  const [resultMessage, setResultMessage] = React.useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  
  // Regular expression for validating email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Fetch campaigns when the component mounts
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('https://midmailbackend.azurewebsites.net/Campaign/getUserCampaigns', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (response.status === 200) {
          setCampaigns(response.data);
        } else {
          setResultMessage('Failed to fetch campaigns');
        }
      } catch (error) {
        setResultMessage(`Error: ${error.message}`);
      }
    };

    fetchCampaigns();
  }, []);

  // Function to validate email addresses
  const validateEmails = (emails) => {
    return emails.every(email => emailRegex.test(email));
  };

  // Function to handle the form submission for sending an email
  const onSubmit = async (data) => {
    const emails = data.To.split(',').map(email => email.trim());

    // Validate email addresses
    if (!validateEmails(emails)) {
      setResultMessage('Some email addresses are invalid.');
      return;
    }

    // Check if subject and category are provided
    if (!data.Subject.trim()) {
      setResultMessage('Subject is required.');
      return;
    }
    if (!data.Category.trim()) {
      setResultMessage('Category is required.');
      return;
    }

    try {
      // Retrieve token from local storage
      const token = localStorage.getItem('authToken');
 
      // Prepare the request data for sending an email
      const emailData = {
        to: emails,
        subject: data.Subject,
        body: data.Body,
        scheduledDate: data.ScheduledDate || null, 
        category: data.Category, // Use the category from form state
        campaignId: selectedCampaign || null // Include the selected campaign ID
      };
      const activeUser = localStorage.getItem('activeuser');
      const isActive = activeUser === 'true';

      // Make the Axios request with authorization header
      if (isActive) {
        const response = await axios.post('https://localhost:7174/Email/addScheduledEmail', emailData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setResultMessage('Email scheduled successfully');
          window.location.reload();
        } else {
          setResultMessage('Failed to schedule email');
        }
      } else {
        setResultMessage('Please set up your Google SMTP Credentials at Credentials first!');
      }

    } catch (error) {
      setResultMessage(`Error: ${error.message}`);
    }
  };


  const handleSuggestCategory = async () => {
    const subject = watch('Subject'); 

    if (!subject.trim()) {
      setResultMessage('Please enter a subject before suggesting a category.');
      return;
    }

    try {

      const token = localStorage.getItem('authToken');


      const response = await axios.post('https://localhost:7174/Email/getCategorySugestion', { subject: subject }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setValue('Category', response.data);
        setResultMessage('');
      } else {
        setResultMessage('Failed to get category suggestion');
      }

    } catch (error) {
      setResultMessage(`Error: ${error.message}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Schedule Email
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="To"
              fullWidth
              variant="outlined"
              {...register('To', { 
                required: 'Recipient addresses are required',
                validate: value => {
                  const emails = value.split(',').map(email => email.trim());
                  return validateEmails(emails) || 'Some email addresses are invalid.';
                }
              })}
              error={!!errors.To}
              helperText={errors.To?.message}
              placeholder="Comma-separated list of recipients"
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="Subject"
              control={control}
              defaultValue=""
              rules={{ required: 'Subject is required' }}
              render={({ field }) => (
                <TextField
                  label="Subject"
                  fullWidth
                  variant="outlined"
                  {...field}
                  error={!!errors.Subject}
                  helperText={errors.Subject?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Campaign</InputLabel>
              <Select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                label="Campaign"
              >
                {campaigns.map((campaign) => (
                  <MenuItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} display="flex" alignItems="center">
            <Controller
              name="Category"
              control={control}
              defaultValue=""
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <TextField
                  label="Category"
                  fullWidth
                  variant="outlined"
                  {...field}
                  error={!!errors.Category}
                  helperText={errors.Category?.message}
                  sx={{ marginRight: 1 }}
                />
              )}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSuggestCategory}
              sx={{
                textTransform: 'none',
                height: '40px',
                minWidth: '150px',
                fontSize: '12px',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
              }}
            >
              Suggest Category from Subject
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Body"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              {...register('Body', { required: 'Body is required' })}
              error={!!errors.Body}
              helperText={errors.Body?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="ScheduledDate"
                control={control}
                defaultValue={null}
                
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <DatePicker
                    label="Scheduled Date"
                    value={value}
                    onChange={(date) => {
                      setValue('ScheduledDate', date);
                      onChange(date);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                textTransform: 'none',
                fontSize: '16px',
                padding: '10px 0',
                marginTop: 2,
                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
              }}
            >
              Send Email
            </Button>
          </Grid>
        </Grid>
      </form>
      {resultMessage && <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>{resultMessage}</Typography>}
    </Container>
  );
};

export default SendEmailPage;
