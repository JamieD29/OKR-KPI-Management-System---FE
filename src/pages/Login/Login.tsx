// src/pages/Login/Login.tsx
import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Container,
  Paper,
  Stack,
  Fade,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { api } from '../../services/api';
import loginBg from '../../assets/images/login-bg2.jpg';

// --- CUSTOM COLORED ICONS ---
const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const MicrosoftLogo = () => (
  <svg width="20" height="20" viewBox="0 0 23 23">
    <path fill="#f35325" d="M0 0h11v11H0z" />
    <path fill="#81bc06" d="M12 0h11v11H12z" />
    <path fill="#05a6f0" d="M0 12h11v11H0z" />
    <path fill="#ffba08" d="M12 12h11v11H12z" />
  </svg>
);
// -----------------------------

declare global {
  interface Window {
    google: any;
    msal: any;
  }
}

// Microsoft MSAL Configuration
const msalConfig = {
  auth: {
    clientId: 'YOUR_MICROSOFT_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  },
};

const msalRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
};

export default function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMsLoading, setIsMsLoading] = useState(false);
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllowedDomains();
    loadGoogleScript();
    loadMicrosoftScript();
  }, []);

  const fetchAllowedDomains = async () => {
    try {
      const response = await api.get('/auth/allowed-domains');
      setAllowedDomains(response.data.domains || ['itec.hcmus.edu.vn']);
    } catch (err) {
      console.error('Failed to fetch allowed domains:', err);
      setAllowedDomains(['itec.hcmus.edu.vn']);
    }
  };

  const loadGoogleScript = () => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  };

  const loadMicrosoftScript = () => {
    const script = document.createElement('script');
    script.src = 'https://alcdn.msauth.net/browser/2.30.0/js/msal-browser.min.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Microsoft MSAL loaded successfully');
    };
    document.body.appendChild(script);
  };

  const handleGoogleSignIn = () => {
    setError('');
    setIsLoading(true);

    if (window.google) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: '454552409584-9tiufajnvspp5fh3orh58nvou320gs6b.apps.googleusercontent.com',
        scope: 'openid email profile',
        prompt: 'select_account',
        callback: async (response: any) => {
          if (response.access_token) {
            try {
              const userInfoResponse = await fetch(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                  headers: { Authorization: `Bearer ${response.access_token}` },
                }
              );
              const userInfo = await userInfoResponse.json();
              await authenticateWithBackend(userInfo, 'google');
            } catch (err) {
              setError('Failed to get user info from Google');
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
          }
        },
      });
      client.requestAccessToken();
    } else {
      setIsLoading(false);
      setError('Google Sign-In is not loaded. Please refresh the page.');
    }
  };

  const handleMicrosoftSignIn = async () => {
    setError('');
    setIsMsLoading(true);

    try {
      if (!window.msal) {
        throw new Error('Microsoft MSAL library not loaded');
      }

      const msalInstance = new window.msal.PublicClientApplication(msalConfig);
      await msalInstance.initialize();

      const loginResponse = await msalInstance.loginPopup(msalRequest);

      if (loginResponse.account) {
        const tokenResponse = await msalInstance.acquireTokenSilent({
          ...msalRequest,
          account: loginResponse.account,
        });

        const graphResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        });

        const userProfile = await graphResponse.json();

        const userInfo = {
          email: userProfile.mail || userProfile.userPrincipalName,
          name: userProfile.displayName,
          picture: null,
          accessToken: tokenResponse.accessToken,
        };

        await authenticateWithBackend(userInfo, 'microsoft');
      }
    } catch (err: any) {
      console.error('Microsoft sign-in error:', err);
      if (err.errorCode === 'user_cancelled') {
        setError('Sign-in was cancelled');
      } else {
        setError('Failed to sign in with Microsoft. Please try again.');
      }
      setIsMsLoading(false);
    }
  };

  const authenticateWithBackend = async (
    userInfo: any,
    provider: 'google' | 'microsoft' = 'google'
  ) => {
    try {
      setIsLoading(provider === 'google');
      setIsMsLoading(provider === 'microsoft');

      const endpoint = provider === 'google' ? '/auth/google' : '/auth/microsoft';

      const response = await api.post(endpoint, {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        accessToken: userInfo.accessToken,
      });

      if (response.data) {
        sessionStorage.setItem('authToken', response.data.access_token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));

        const isFirstUser = response.data.isFirstUser;
        const userRole = response.data.user.role;

        if (isFirstUser || userRole === 'admin' || userRole === 'ADMIN') {
          console.log('Redirecting to Admin Settings...');
          navigate('/admin/settings', { replace: true });
        } else {
          console.log('Redirecting to Dashboard...');
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        `Authentication with ${provider} failed. Please check your account.`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsMsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // THAY ĐỔI BACKGROUND Ở ĐÂY
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // Thêm overlay để làm nổi bật form login
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.4)', // Lớp phủ trắng mờ
          zIndex: 0,
        },
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        overflow: 'hidden',
      }}
    >
      <Fade in={true} timeout={800}>
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={3} alignItems="center">
            {/* Logo & Title Section */}
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 1.5,
                  borderRadius: '16px',
                  bgcolor: 'rgba(25, 118, 210, 0.1)',
                  color: '#1976d2',
                  mb: 2,
                }}
              >
                <SchoolIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: '#1a1a1a',
                  fontFamily: 'inherit',
                  mb: 0.5,
                }}
              >
                OKR & KPI Management
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#080808ff',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                  fontSize: '20px',
                }}
              >
                University of Science - VNUHCM
              </Typography>
            </Box>

            {/* Main Login Card */}
            <Paper
              elevation={3}
              sx={{
                width: '100%',
                p: { xs: 3, sm: 4 },
                borderRadius: '16px',
                bgcolor: '#ffffff',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  textAlign: 'center',
                  mb: 1,
                  fontFamily: 'inherit',
                  color: '#1a1a1a',
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  textAlign: 'center',
                  mb: 3,
                  fontFamily: 'inherit',
                }}
              >
                Please sign in with your authorized institutional account
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', fontFamily: 'inherit' }}>
                  {error}
                </Alert>
              )}

              <Stack spacing={2}>
                {/* Google Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || isMsLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <GoogleLogo />}
                  sx={{
                    py: 1.5,
                    borderRadius: '10px',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    bgcolor: '#fff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#9ca3af',
                      bgcolor: '#f9fafb',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  {isLoading ? 'Connecting...' : 'Sign in with Google'}
                </Button>

                <Divider
                  sx={{
                    color: '#9ca3af',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    my: 1,
                  }}
                >
                  or
                </Divider>

                {/* Microsoft Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleMicrosoftSignIn}
                  disabled={isLoading || isMsLoading}
                  startIcon={
                    isMsLoading ? <CircularProgress size={20} /> : <MicrosoftLogo />
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: '10px',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    bgcolor: '#fff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#9ca3af',
                      bgcolor: '#f9fafb',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  {isMsLoading ? 'Connecting...' : 'Sign in with Microsoft'}
                </Button>
              </Stack>

              {/* Requirement Info Box */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: '#f0f9ff',
                  borderRadius: '10px',
                  border: '1px solid #e0f2fe',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#0369a1',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    mb: 0.5,
                    textAlign: 'center',
                  }}
                >
                  🔒 Access Requirement
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748b',
                    display: 'block',
                    lineHeight: 1.6,
                    fontFamily: 'inherit',
                    textAlign: 'center',
                  }}
                >
                  {allowedDomains.length > 0
                    ? `Only accounts ending in ${allowedDomains.map((d) => `@${d}`).join(', ')} are authorized.`
                    : 'System is restricted to authorized personnel.'}
                </Typography>
              </Box>
            </Paper>

            <Typography
              variant="caption"
              sx={{
                color: '#070707ff',
                fontFamily: 'inherit',
                textAlign: 'center',
                fontSize: '20px',
              }}
            >
              © {new Date().getFullYear()} University of Science - VNUHCM
            </Typography>
          </Stack>
        </Container>
      </Fade>
    </Box>
  );
}