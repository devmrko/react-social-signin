import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import YouTubePlaylist from './YouTubePlaylist';

const Header = () => {
  const [user, setUser] = useState(null);

  // Check for stored user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleLoginSuccess = (credentialResponse) => {
    console.log('Login Success Response:', credentialResponse);
    
    if (!credentialResponse.credential) {
      console.error('No credential received');
      return;
    }

    try {
      const decoded = decodeJWT(credentialResponse.credential);
      console.log('Decoded token:', decoded);
      
      if (decoded) {
        const userData = {
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          access_token: credentialResponse.credential
        };
        
        console.log('Setting user data:', userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    console.log('Attempting logout...');
    try {
      googleLogout();
      setUser(null);
      localStorage.removeItem('user');
      window.location.reload(); // Force reload to clear any remaining state
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>Billboard Chart History</h1>
        <div>
          {user ? (
            <div className="d-flex align-items-center">
              <img 
                src={user.picture} 
                alt={user.name} 
                className="rounded-circle me-2"
                style={{ width: '32px', height: '32px' }}
              />
              <span className="me-3">{user.name}</span>
              <button 
                onClick={handleLogout}
                className="btn btn-outline-danger"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={(error) => {
                console.error('Login Failed:', error);
              }}
              useOneTap={false}
              type="standard"
              theme="filled_blue"
              size="large"
              text="signin_with"
              shape="rectangular"
              scope="https://www.googleapis.com/auth/youtube.readonly"
            />
          )}
        </div>
      </header>
      {user && <YouTubePlaylist user={user} />}
    </div>
  );
};

export default Header;