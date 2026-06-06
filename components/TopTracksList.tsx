import { FlatList, Text, View, StyleSheet, Animated, ActivityIndicator } from "react-native";
import { useEffect, useRef } from "react";
import { Image } from "expo-image";
import { type SpotifyTrack, formatDuration } from "@/hooks/use-Spotify-Data";

interface TopTracksProps {
  tracks?: SpotifyTrack[];
  showPlays?: boolean;
  loading?: boolean;
}

const TrackRow = ({
  item,
  index,
  showPlays,
}: {
  item: SpotifyTrack;
  index: number;
  showPlays?: boolean;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rank = String(index + 1).padStart(2, '0');
  const artistNames = item.artists.map((a) => a.name).join(', ');
  const duration = formatDuration(item.duration_ms);
  const albumArt = item.album?.images?.[2]?.url ?? item.album?.images?.[0]?.url;

  return (
    <Animated.View
      style={[
        styles.trackRow,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View>
        <Text style={styles.trackRank}>{rank}</Text>
      </View>

      <View style={styles.trackIcon}>
        {albumArt ? (
          <Image
            source={{ uri: albumArt }}
            style={styles.trackImage}
            contentFit="cover"
          />
        ) : (
          <Text style={{ fontSize: 18 }}>🎧</Text>
        )}
      </View>
      <View style={styles.trackInfo}>
        <Text style={styles.trackName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.trackArtist}>
          {artistNames} · {duration}
        </Text>
      </View>
      {showPlays && (
        <View style={styles.playsBadge}>
          <Text style={styles.playsText}>#{index + 1}</Text>
        </View>
      )}
    </Animated.View>
  );
};

export default function TopTracksList({
  tracks = [],
  showPlays,
  loading = false,
}: TopTracksProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#22c55e" />
      </View>
    );
  }

  if (tracks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>No tracks yet. Connect Spotify to see your top tracks!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tracks}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal: 20, paddingBottom: 50}}
      renderItem={({ item, index }) => (
        <TrackRow
          item={item}
          index={index}
          showPlays={showPlays}
        />
      )}
    />
  );
}

const GREEN = "#22c55e";
const MUTED = "#6b7280";

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: MUTED,
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  trackIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#1a2030",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  trackImage: {
    width: 42,
    height: 42,
    borderRadius: 10,
  },
  trackRank: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "700",
    width: 22,
  },
  playsBadge: {
    backgroundColor: "#1a2a1a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  playsText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: "700",
  },
  trackInfo: {
    flex: 1,
    minWidth: 0,
  },
  trackName: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  trackArtist: {
    color: MUTED,
    fontSize: 11,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1e2533",
  },
});
