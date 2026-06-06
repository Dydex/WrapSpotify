import React, { createContext, useContext, type ReactNode } from 'react';
import { useSpotifyAuth } from '@/hooks/use-Spotify-Auth';
import { useSpotifyData, type SpotifyData } from '@/hooks/use-Spotify-Data';

interface SpotifyContextValue extends SpotifyData {
  token: string | null;
  promptAsync: () => void;
  redirectUri: string;
}

const SpotifyContext = createContext<SpotifyContextValue | null>(null);

export function SpotifyProvider({ children }: { children: ReactNode }) {
  const { token, promptAsync, redirectUri } = useSpotifyAuth();
  const spotifyData = useSpotifyData(token);

  return (
    <SpotifyContext.Provider value={{ ...spotifyData, token, promptAsync, redirectUri }}>
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify(): SpotifyContextValue {
  const ctx = useContext(SpotifyContext);
  if (!ctx) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return ctx;
}
