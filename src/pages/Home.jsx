import React from 'react';
import { Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmailIcon from '@mui/icons-material/Email';
import CredentialsIcon from '@mui/icons-material/LockOpen';
import OfflinePinIcon from '@mui/icons-material/Logout';
import SubscriptionsImage from '@mui/icons-material/Payment';
import CampaignImage from '@mui/icons-material/Campaign';
import AnalyticsImage from '@mui/icons-material/Analytics';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { createTheme, ThemeProvider } from '@mui/material/styles';  
import Logout from './Logout'; 
import Dashboard from './dashboard/Dashboard';
import SignupSecondStep from './SignupSecondStep';
import SendEmailPage from './SendEmailPage';
import Subscriptions from './Subscriptions';
import CampaignPage from './CampaignPage'


const NAVIGATION = [
    {
      kind: 'header',
      title: 'Dashboard',
    },
    {
      segment: 'dashboard',
      title: 'Dashboard',
      icon: <DashboardIcon />,
    },

    {
      kind: 'divider',
    },
    {
      kind: 'header',
      title: 'Emails',
    },
    {
      segment: 'newemails',
      title: 'Send New Emails',
      icon: <EmailIcon />,
    },  
      {
      segment: 'campaigns',
      title: 'Email Campaigns',
      icon: <CampaignImage />,
    },   
     {
      segment: 'analytics',
      title: 'Email Analytics',
      icon: <AnalyticsImage />,
    },
    {
      kind: 'divider',
    },
    {
      kind: 'header',
      title: 'User',
    },
    {
      segment: 'credentials',
      title: 'Google Credentials',
      icon: <CredentialsIcon />,
    },
    {
      segment: 'subscriptions',
      title: 'Subscriptions',
      icon: <SubscriptionsImage />,
    },
    {
      segment: 'logout',
      title: 'Log Out',
      icon: <OfflinePinIcon />,
    },
];

const demoTheme = createTheme({
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
const clearToken = () => {
  localStorage.clear()
 
  window.location.reload()
};

function DashboardContent() {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content</Typography> <div>
      <button onClick={clearToken}>Clear Token</button>
    </div>
    </Box>
  );
}

function DemoPageContent({ pathname }) {
  switch (pathname) {

      case '/newemails':
        return <SendEmailPage />;
      case '/credentials':
        return <SignupSecondStep />;
      case '/dashboard':
        return <Dashboard />;
      case '/analytics':
        return <Dashboard />;
      case '/campaigns':
        return <CampaignPage />;
      case '/logout':
      return <Logout />;
      case '/subscriptions':
      return <Subscriptions />;
      
    default:
      return <DashboardContent />;
  }
}

function Home(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/dashboard');

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;
  console.log(pathname)
  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}  
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="Mid Mail logo" />,
        title: 'Mid Mail',
      }}
    >
      <DashboardLayout>
        <DemoPageContent pathname={pathname} />        
      </DashboardLayout>
    </AppProvider>
  );
}

export default Home;
