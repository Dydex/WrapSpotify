const BASE = 'https://api.spotify.com/v1';

export function useSpotifyData(token: string | null) {

  // Top Tracks
  const getTopTracks = async () => {
    const res = await fetch(`${BASE}/me/top/tracks?limit=10&time_range=short_term`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json(); // .items = array of tracks
  };

  // Top Artists
  const getTopArtists = async () => {
    const res = await fetch(`${BASE}/me/top/artists?limit=10&time_range=short_term`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };

  // Saved Albums
  const getSavedAlbums = async () => {
    const res = await fetch(`${BASE}/me/albums?limit=10`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json(); // .items[].album
  };

  return { getTopTracks, getTopArtists, getSavedAlbums };
}