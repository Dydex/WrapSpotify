import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID || '';

if (!CLIENT_ID) {
  console.warn('Warning: EXPO_PUBLIC_SPOTIFY_CLIENT_ID is not defined in the environment variables!');
}

// Generate the redirect URI dynamically so that it works across Web, 
// custom Dev Builds, and Expo Go.
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'wrapspotify',
  path: 'redirect',
});

const SCOPES = [
  'user-top-read',
  'user-read-recently-played',
  'user-library-read',
];

export function useSpotifyAuth() {
  const [token, setToken] = useState<string | null>(null);

  const [isExchanging, setIsExchanging] = useState(false);

  // Load token on mount
  useEffect(() => {
    console.log('Spotify Redirect URI:', REDIRECT_URI);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('spotify_token');
        if (saved) {
          setToken(saved);
        }
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }
  }, []);

  const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      usePKCE: true,
      redirectUri: REDIRECT_URI,
    },
    discovery,
  );

  // Exchange code for token
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      setIsExchanging(true);
      exchangeCode(code);
    }
  }, [response]);

  const exchangeCode = async (code: string) => {
    try {
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          code_verifier: request!.codeVerifier!,
        }).toString(),
      });
      const data = await res.json();
      if (data.access_token) {
        setToken(data.access_token);
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('spotify_token', data.access_token);
          }
        } catch (e) {
          console.warn('LocalStorage write error:', e);
        }
      } else {
        console.error('Token exchange failed:', data);
      }
    } catch (err) {
      console.error('Token exchange error:', err);
    } finally {
      setIsExchanging(false);
    }
  };

  const logout = () => {
    setToken(null);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('spotify_token');
      }
    } catch (e) {
      console.warn('LocalStorage remove error:', e);
    }
  };

  return { token, promptAsync, redirectUri: REDIRECT_URI, ready: !!request, logout, isExchanging };
}