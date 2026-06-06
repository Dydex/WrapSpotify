import { useState, useEffect, useCallback } from 'react';

const BASE = 'https://api.spotify.com/v1';

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

// ── Spotify API response types ──────────────────────────────────────────────
export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  images: SpotifyImage[];
  external_urls: { spotify: string };
}

export interface SpotifyAlbumSimple {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
  artists: { id: string; name: string }[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: SpotifyAlbumSimple;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface SpotifySavedAlbum {
  added_at: string;
  album: {
    id: string;
    name: string;
    images: SpotifyImage[];
    release_date: string;
    total_tracks: number;
    artists: { id: string; name: string }[];
    external_urls: { spotify: string };
  };
  tracksCount?: number; // Number of tracks from this album in top tracks
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  images: SpotifyImage[];
  followers: { total: number };
  country: string;
  product: string;
}

// ── Hook return type ────────────────────────────────────────────────────────
export interface SpotifyData {
  // Data
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  savedAlbums: SpotifySavedAlbum[];
  userProfile: SpotifyUserProfile | null;

  // State
  loading: boolean;
  error: string | null;
  timeRange: TimeRange;

  // Actions
  setTimeRange: (range: TimeRange) => void;
  refresh: () => Promise<void>;
}

// ── Helper: format milliseconds to m:ss ─────────────────────────────────────
export function formatDuration(ms: number): string {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ── Main hook ───────────────────────────────────────────────────────────────
export function useSpotifyData(token: string | null): SpotifyData {
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<SpotifySavedAlbum[]>([]);
  const [userProfile, setUserProfile] = useState<SpotifyUserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('short_term');

  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  // Derive top albums from topTracks whenever topTracks changes
  useEffect(() => {
    if (topTracks.length === 0) {
      setSavedAlbums([]);
      return;
    }

    const albumMap: Record<string, { album: SpotifyAlbumSimple & { total_tracks?: number; external_urls?: { spotify: string } }; count: number }> = {};
    
    topTracks.forEach((track) => {
      if (!track.album) return;
      const albumId = track.album.id;
      if (!albumMap[albumId]) {
        albumMap[albumId] = {
          album: track.album,
          count: 0,
        };
      }
      albumMap[albumId].count += 1;
    });

    const derivedAlbums: SpotifySavedAlbum[] = Object.values(albumMap)
      .sort((a, b) => b.count - a.count)
      .map((item) => ({
        added_at: new Date().toISOString(),
        album: {
          id: item.album.id,
          name: item.album.name,
          images: item.album.images,
          release_date: item.album.release_date,
          total_tracks: item.album.total_tracks ?? 0,
          artists: item.album.artists,
          external_urls: item.album.external_urls ?? { spotify: '' },
        },
        tracksCount: item.count,
      }));

    setSavedAlbums(derivedAlbums);
  }, [topTracks]);

  // ── Individual fetchers ─────────────────────────────────────────────────
  const fetchTopTracks = useCallback(async (range: TimeRange) => {
    if (!headers) return;
    const res = await fetch(
      `${BASE}/me/top/tracks?limit=50&time_range=${range}`,
      { headers },
    );
    if (!res.ok) throw new Error(`Tracks fetch failed: ${res.status}`);
    const data = await res.json();
    setTopTracks(data.items ?? []);
  }, [token]);

  const fetchTopArtists = useCallback(async (range: TimeRange) => {
    if (!headers) return;
    const res = await fetch(
      `${BASE}/me/top/artists?limit=50&time_range=${range}`,
      { headers },
    );
    if (!res.ok) throw new Error(`Artists fetch failed: ${res.status}`);
    const data = await res.json();
    setTopArtists(data.items ?? []);
  }, [token]);

  const fetchUserProfile = useCallback(async () => {
    if (!headers) return;
    const res = await fetch(`${BASE}/me`, { headers });
    if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
    const data = await res.json();
    setUserProfile(data);
  }, [token]);

  // ── Fetch all data ────────────────────────────────────────────────────
  const fetchAll = useCallback(async (range: TimeRange) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchTopTracks(range),
        fetchTopArtists(range),
        fetchUserProfile(),
      ]);
    } catch (err: any) {
      setError(err.message ?? 'Failed to fetch Spotify data');
    } finally {
      setLoading(false);
    }
  }, [token, fetchTopTracks, fetchTopArtists, fetchUserProfile]);

  // ── Auto-fetch when token or time range changes ───────────────────────
  useEffect(() => {
    if (token) {
      fetchAll(timeRange);
    }
  }, [token, timeRange]);

  // ── Public refresh ────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    await fetchAll(timeRange);
  }, [fetchAll, timeRange]);

  return {
    topTracks,
    topArtists,
    savedAlbums,
    userProfile,
    loading,
    error,
    timeRange,
    setTimeRange,
    refresh,
  };
}