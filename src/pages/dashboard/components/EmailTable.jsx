import * as React from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Define styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    cursor: 'pointer', // Change cursor to pointer for sortable columns
    maxWidth: 150, // Set a max width for table headers
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '8px 16px', // Add padding for better spacing
    maxWidth: 150, // Set a max width for table cells
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  // Set a fixed row height
  height: '60px', // Adjust this value to fit your needs
}));

const StatusButton = styled('div')(({ isSent }) => ({
  backgroundColor: isSent ? 'green' : 'red',
  color: 'white',
  borderRadius: '12px',
  padding: '4px 8px',
  textAlign: 'center',
  cursor: 'default',
  userSelect: 'none',
}));

// Format date to dd/mm/yyyy
const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Define the component
export default function EmailTable() {
  const [emails, setEmails] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState('asc');
  const [sortColumn, setSortColumn] = React.useState('from');

  const token = localStorage.getItem('authToken');

  // Fetch data from the API
  React.useEffect(() => {
    async function fetchEmails() {
      try {
        const response = await axios.get('https://midmailbackend.azurewebsites.net/Email/getUserEmails', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setEmails(response.data || []);
      } catch (ex) {
        setError(ex.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEmails();
  }, [token]);

  // Handle sorting
  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortColumn(column);

    // Sort emails array
    const sortedEmails = [...emails].sort((a, b) => {
      if (a[column] < b[column]) return newDirection === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setEmails(sortedEmails);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell onClick={() => handleSort('from')}>
              From
              {sortColumn === 'from' && (sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
            </StyledTableCell>
            <StyledTableCell align="left" onClick={() => handleSort('to')}>
              To
              {sortColumn === 'to' && (sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
            </StyledTableCell>
            <StyledTableCell align="left" onClick={() => handleSort('subject')}>
              Subject
              {sortColumn === 'subject' && (sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
            </StyledTableCell>
            <StyledTableCell align="left" onClick={() => handleSort('body')}>
              Body
              {sortColumn === 'body' && (sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
            </StyledTableCell>
            <StyledTableCell align="left" onClick={() => handleSort('dateSent')}>
              Date Sent
              {sortColumn === 'dateSent' && (sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
            </StyledTableCell>
            <StyledTableCell align="left" onClick={() => handleSort('category')}>
              Category
              {sortColumn === 'category' && (sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
            </StyledTableCell>
            <StyledTableCell align="center" onClick={() => handleSort('isSent')}>
              Is Sent
              {sortColumn === 'isSent' && (sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {emails.map((email) => (
            <StyledTableRow key={email.id}>
              <Tooltip title={email.from} arrow>
                <StyledTableCell component="th" scope="row">
                  {email.from}
                </StyledTableCell>
              </Tooltip>
              <Tooltip title={email.to} arrow>
                <StyledTableCell align="left">
                  {email.to}
                </StyledTableCell>
              </Tooltip>
              <Tooltip title={email.subject} arrow>
                <StyledTableCell align="left">
                  {email.subject}
                </StyledTableCell>
              </Tooltip>
              <Tooltip title={email.body} arrow>
                <StyledTableCell align="left">
                  {email.body}
                </StyledTableCell>
              </Tooltip>
              <Tooltip title={formatDate(email.dateSent)} arrow>
                <StyledTableCell align="left">
                  {formatDate(email.dateSent)}
                </StyledTableCell>
              </Tooltip>
              <Tooltip title={email.category} arrow>
                <StyledTableCell align="left">
                  {email.category}
                </StyledTableCell>
              </Tooltip>
              <StyledTableCell align="center">
                <StatusButton isSent={email.isSent}>
                  {email.isSent ? 'Sent' : 'Not Sent'}
                </StatusButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
