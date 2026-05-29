import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = 'ea76e808a7b6479381f494d17648bea1';
const REDIRECT_URI = AuthSession.makeRedirectUri({ scheme: 'myapp' });
const SCOPES = [
  'user-top-read',        // top tracks & artists
  'user-read-recently-played',
  'user-library-read',    // saved albums
];

export function useSpotifyAuth() {
  const [token, setToken] = useState<string | null>(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      usePKCE: true,
      redirectUri: REDIRECT_URI,
    },
    {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
    }
  );

  // Exchange code for token
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCode(code);
    }
  }, [response]);

  const exchangeCode = async (code: string) => {
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
    setToken(data.access_token);
  };

  return { token, promptAsync };
}