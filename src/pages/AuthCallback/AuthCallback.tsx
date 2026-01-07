import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      // Handle error
      let errorMessage = 'Authentication failed';
      switch (error) {
        case 'domain_not_allowed':
          errorMessage = 'Your email domain is not authorized';
          break;
        case 'auth_failed':
          errorMessage = 'Authentication failed. Please try again.';
          break;
      }
      
      navigate('/login', { 
        replace: true, 
        state: { error: errorMessage } 
      });
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Store authentication data
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Failed to parse user data:', err);
        navigate('/login', { 
          replace: true, 
          state: { error: 'Authentication failed. Please try again.' } 
        });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e5e7eb',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ color: '#6b7280' }}>Completing sign in...</p>
    </div>
  );
}