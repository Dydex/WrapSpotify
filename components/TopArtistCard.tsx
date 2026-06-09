import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { type SpotifyArtist } from '@/hooks/use-Spotify-Data';

interface TopArtistsCardProps {
  artists?: SpotifyArtist[];
  loading?: boolean;
}

export default function TopArtistsCard({ artists = [], loading = false }: TopArtistsCardProps) {
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="small" color="#8B5CF6" />
      </View>
    );
  }

  // We need at least 3 artists for the podium
  const top1 = artists[0];
  const top2 = artists[1];
  const top3 = artists[2];

  if (!top1 || !top2 || !top3) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.emptyText}>
          No top artists available yet.
        </Text>
      </View>
    );
  }

  const getImageUrl = (artist: SpotifyArtist) =>
    artist.images?.[1]?.url ?? artist.images?.[0]?.url;

  const getGenre = (artist: SpotifyArtist) => {
    const genre = artist.genres?.[0] ?? 'Music';
    return genre.charAt(0).toUpperCase() + genre.slice(1);
  };

  return (
    <View style={styles.container}>
      {/* Artist #2 */}
      <View style={styles.artistWrapper}>
        <View style={styles.smallCircleWrapper}>
          <View style={styles.smallCircleGray}>
            {getImageUrl(top2) ? (
              <Image
                source={{ uri: getImageUrl(top2) }}
                style={styles.circleImage}
                contentFit="cover"
              />
            ) : (
              <Ionicons name="musical-notes" size={26} color="#999" />
            )}
          </View>
        </View>

        <View style={styles.rankBoxGray}>
          <Text style={styles.rankText}>2</Text>
        </View>

        <Text style={styles.artistName} numberOfLines={1}>
          {top2.name}
        </Text>

        <Text style={styles.genre}>
          {getGenre(top2)}
        </Text>
      </View>

      {/* Artist #1 (Active) */}
      <View style={styles.artistWrapperActive}>
        <Text style={styles.crown}>👑</Text>

        <View style={styles.activeCircleOuter}>
          <LinearGradient
            colors={['#FF5A09', '#EC4899', '#8B5CF6']}
            style={styles.activeCircleGradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.activeCircleInner}>
              {getImageUrl(top1) ? (
                <Image
                  source={{ uri: getImageUrl(top1) }}
                  style={styles.activeCircleImage}
                  contentFit="cover"
                />
              ) : (
                <Ionicons name="mic" size={32} color="#aaa" />
              )}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.rankBoxGreen}>
          <Text style={styles.rankTextActive}>1</Text>
        </View>

        <Text style={styles.activeArtistName} numberOfLines={1}>
          {top1.name}
        </Text>

        <Text style={styles.activeGenre}>
          {getGenre(top1)}
        </Text>
      </View>

      {/* Artist #3 */}
      <View style={styles.artistWrapper}>
        <View style={styles.smallCircleWrapper}>
          <View style={styles.smallCircleBrown}>
            {getImageUrl(top3) ? (
              <Image
                source={{ uri: getImageUrl(top3) }}
                style={styles.circleImage}
                contentFit="cover"
              />
            ) : (
              <Ionicons name="headset" size={26} color="#8B6914" />
            )}
          </View>
        </View>

        <View style={styles.rankBoxBrown}>
          <Text style={styles.rankText}>3</Text>
        </View>

        <Text style={styles.artistName} numberOfLines={1}>
          {top3.name}
        </Text>

        <Text style={styles.genre}>
          {getGenre(top3)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 180,
  },

  emptyText: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
  },

  /* ---- Side artist wrappers ---- */
  artistWrapper: {
    alignItems: 'center',
    flex: 1,
  },

  /* ---- Center (active) artist wrapper ---- */
  artistWrapperActive: {
    alignItems: 'center',
    flex: 1,
    marginTop: -10,
  },

  /* ---- Small circle ring wrappers ---- */
  smallCircleWrapper: {
    padding: 2,
    borderRadius: 999,
  },

  /* ---- #2 Gray ring circle ---- */
  smallCircleGray: {
    width: 68,
    height: 68,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#888',
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  /* ---- #3 Brown ring circle ---- */
  smallCircleBrown: {
    width: 68,
    height: 68,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#A0703C',
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  circleImage: {
    width: 64,
    height: 64,
    borderRadius: 999,
  },

  /* ---- #1 Active gradient circle ---- */
  activeCircleOuter: {
    borderRadius: 999,
    padding: 3,
  },

  activeCircleGradient: {
    width: 96,
    height: 96,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeCircleInner: {
    width: 82,
    height: 82,
    borderRadius: 999,
    backgroundColor: '#6B7AF0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  activeCircleImage: {
    width: 82,
    height: 82,
    borderRadius: 999,
  },

  /* ---- Crown ---- */
  crown: {
    fontSize: 20,
    marginBottom: 4,
  },

  /* ---- Rank boxes ---- */
  rankBoxGray: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: -8,
    minWidth: 40,
    alignItems: 'center',
  },

  rankBoxBrown: {
    backgroundColor: '#5C3D2E',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: -8,
    minWidth: 40,
    alignItems: 'center',
  },

  rankBoxGreen: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: -8,
    minWidth: 48,
    alignItems: 'center',
  },

  /* ---- Rank text ---- */
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  rankTextActive: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  /* ---- Artist names ---- */
  artistName: {
    color: '#ccc',
    fontWeight: '600',
    marginTop: 10,
    fontSize: 13,
  },

  activeArtistName: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 15,
  },

  /* ---- Genres ---- */
  genre: {
    color: '#777',
    fontSize: 11,
    marginTop: 3,
  },

  activeGenre: {
    color: '#8B5CF6',
    fontSize: 11,
    marginTop: 3,
  },
});