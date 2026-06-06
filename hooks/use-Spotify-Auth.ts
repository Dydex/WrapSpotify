import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = 'ea76e808a7b6479381f494d17648bea1';

// Platform-specific redirect URIs:
// - Web: http://localhost:8081 (Spotify allows http://localhost for dev)
// - Native dev build: statsspotify://callback (custom scheme)
//
// ADD BOTH to Spotify Dashboard → Redirect URIs:
//   http://localhost:8081
//   statsspotify://callback
const REDIRECT_URI = Platform.select({
  web: 'http://127.0.0.1:8081',
  default: 'statsspotify://callback',
})!;

const SCOPES = [
  'user-top-read',
  'user-read-recently-played',
  'user-library-read',
];

export function useSpotifyAuth() {
  const [token, setToken] = useState<string | null>(null);

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
      } else {
        console.error('Token exchange failed:', data);
      }
    } catch (err) {
      console.error('Token exchange error:', err);
    }
  };

  return { token, promptAsync, redirectUri: REDIRECT_URI };
}