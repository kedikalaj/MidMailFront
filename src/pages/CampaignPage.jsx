import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CircularProgress, Modal, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, tableCellClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Set up axios interceptor to include auth token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [emails, setEmails] = useState([]); // Initialize emails to an empty array

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('https://localhost:7174/Campaign/getUserCampaigns');
      setCampaigns(response.data);
    } catch (error) {
      console.error('Failed to fetch campaigns', error);
    }
  };

  const handleCreateCampaign = async () => {
    if (campaignName.trim() === '' || campaignDescription.trim() === '') {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      const tokenUserId = decodedToken['claim.userId']; // Adjust this key if necessary

      await axios.post('https://localhost:7174/Campaign/createCampaign', {
        Name: campaignName,
        Description: campaignDescription,
        UserId: tokenUserId,
        Id: tokenUserId,
      });

      setOpenCreateModal(false);
      fetchCampaigns(); // Refresh the campaign list
    } catch (error) {
      console.error('Failed to create campaign', error);
      alert('Failed to create campaign. Please try again later.');
    }
  };

  const handleCampaignClick = async (campaignId) => {
    try {
      const response = await axios.get(`https://localhost:7174/Email/getCampaignEmails?campaignId=${campaignId}`);
      setEmails(response.data || []); // Ensure emails is set to an empty array if response.data.Emails is undefined
      setSelectedCampaign(campaignId);
      setOpenDetailsModal(true);
    } catch (error) {
      console.error('Failed to fetch campaign emails', error);
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const StatusButton = styled(Button)(({ isSent }) => ({
    backgroundColor: isSent ? 'green' : 'red',
    color: 'white',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: isSent ? 'darkgreen' : 'darkred',
    },
  }));
  

  return (
    <div style={{ backgroundColor: '#121212', color: '#e0e0e0', padding: '16px' }}>
      <Button variant="contained" onClick={() => setOpenCreateModal(true)}>Create Campaign</Button>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', marginTop: '16px' }}>
        {campaigns.map(campaign => (
          <Card key={campaign.id} style={{ backgroundColor: '#1e1e1e', color: '#e0e0e0', cursor: 'pointer', minWidth: '250px', position: 'relative', padding: '16px' }} onClick={() => handleCampaignClick(campaign.id)}>
            <CardContent>
              <Typography variant="h6">{campaign.name}</Typography>
              <br />
              <Typography variant="body2">{campaign.description}</Typography>   <br ></br>
              <Typography variant="p">Oppen Rate</Typography>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',marginTop: '8px' }}>
              <CircularProgress
  key={campaign.openRate}  
  variant={campaign.openRate >= 0 ? "determinate" : "indeterminate"}
  value={campaign.openRate >= 0 ? campaign.openRate : 0}
  size={50}
  thickness={4}
  style={{ color: campaign.openRate > 0 ? '#3f51b5' : 'transparent' }}
/>
                <Typography variant="caption" style={{ marginLeft: '8px' }}>
                  {campaign.openRate >= 0 ? `${campaign.openRate}%` : 'No Data'}
                </Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <div style={{ backgroundColor: '#1e1e1e', color: '#e0e0e0', padding: '16px', borderRadius: '8px', margin: '16px' }}>
          <Typography variant="h6">Create New Campaign</Typography>
          <TextField
            label="Campaign Name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <TextField
            label="Description"
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            style={{ marginBottom: '16px' }}
          />
          <Button variant="contained" onClick={handleCreateCampaign}>Create</Button>
        </div>
      </Modal>

      <Modal open={openDetailsModal} onClose={() => setOpenDetailsModal(false)}>
        <div style={{ backgroundColor: '#1e1e1e', color: '#e0e0e0', padding: '16px', borderRadius: '8px', margin: '16px' }}>
          <Typography variant="h6">Campaign Emails</Typography>

          {emails && emails.length > 0 ? (
            <TableContainer component={Paper} style={{ maxHeight: 400 }}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>From</StyledTableCell>
                    <StyledTableCell>To</StyledTableCell>
                    <StyledTableCell>Subject</StyledTableCell>
                    <StyledTableCell>Date Sent</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Seen</StyledTableCell> 
                    <StyledTableCell>Category</StyledTableCell> 
                  </TableRow>
                </TableHead>
                <TableBody>
                  {emails.map((email) => (
                    <StyledTableRow key={email.id}>
                      <StyledTableCell>{email.from}</StyledTableCell>
                      <StyledTableCell>{email.to}</StyledTableCell>
                      <StyledTableCell>{email.subject}</StyledTableCell>
                      <StyledTableCell>{email.dateSent ? email.dateSent.toLocaleString() : 'N/A'}</StyledTableCell>
  
                      <StyledTableCell>
                        <StatusButton isSent={email.isSent}>
                            {email.isSent ? 'Sent' : 'Not Sent'}
                        </StatusButton>
                        </StyledTableCell>
                      <StyledTableCell>
                        <StatusButton isSent={email.seen}>
                            {email.seen ? 'Open' : 'Not Open'}
                        </StatusButton>
                        </StyledTableCell>
                      <StyledTableCell>
                        {email.category || 'N/A'}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" style={{ marginTop: '16px', textAlign: 'center' }}>
              No emails available for this campaign.
            </Typography>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CampaignPage;
