import { FlatList, Text, View, StyleSheet, Animated, ActivityIndicator, Dimensions } from "react-native";
import { useEffect, useRef } from "react";
import { Image } from "expo-image";
import { type SpotifyTrack, formatDuration } from "@/hooks/use-Spotify-Data";

interface TopTracksProps {
  tracks?: SpotifyTrack[];
  showPlays?: boolean;
  loading?: boolean;
  viewLayout?: 'list' | 'grid';
}

const { width } = Dimensions.get("window");
const GRID_ITEM_SIZE = (width - 48) / 3;

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
        delay: index * 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 40,
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
        <Text style={styles.trackArtist} numberOfLines={1}>
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
  viewLayout = 'list',
}: TopTracksProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#8B5CF6" />
      </View>
    );
  }

  if (tracks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>No top tracks available yet.</Text>
      </View>
    );
  }

  const isGrid = viewLayout === 'grid';

  return (
    <FlatList
      key={viewLayout} // Force FlatList to remount when changing layout
      data={tracks}
      keyExtractor={(item) => item.id}
      numColumns={isGrid ? 3 : 1}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.listContainer,
        isGrid ? styles.gridContainer : styles.listContentContainer
      ]}
      renderItem={({ item, index }) => {
        if (isGrid) {
          const rank = String(index + 1).padStart(2, '0');
          const albumArt = item.album?.images?.[1]?.url ?? item.album?.images?.[0]?.url;

          return (
            <View style={styles.gridItem}>
              <View style={styles.gridImageWrapper}>
                {albumArt ? (
                  <Image
                    source={{ uri: albumArt }}
                    style={styles.gridImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.gridImagePlaceholder}>
                    <Text style={{ fontSize: 24 }}>🎵</Text>
                  </View>
                )}
                <View style={styles.gridRankBadge}>
                  <Text style={styles.gridRankText}>{rank}</Text>
                </View>
              </View>
              <Text style={styles.gridTrackName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.gridTrackArtist} numberOfLines={1}>
                {item.artists?.[0]?.name ?? 'Unknown'}
              </Text>
            </View>
          );
        }

        return (
          <TrackRow
            item={item}
            index={index}
            showPlays={showPlays}
          />
        );
      }}
    />
  );
}

const GREEN = "#8B5CF6";
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
  listContainer: {
    paddingBottom: 50,
  },
  listContentContainer: {
    paddingHorizontal: 0,
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
    backgroundColor: "#21163b",
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

  // Grid View Styles
  gridContainer: {
    paddingHorizontal: 8,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  gridImageWrapper: {
    position: "relative",
    width: GRID_ITEM_SIZE - 20,
    height: GRID_ITEM_SIZE - 20,
    borderRadius: 12,
    backgroundColor: "#1a2030",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 8,
  },
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  gridImagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a2030",
  },
  gridRankBadge: {
    position: "absolute",
    top: -2,
    left: -2,
    backgroundColor: "#8B5CF6",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#0d1117",
  },
  gridRankText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  gridTrackName: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
  },
  gridTrackArtist: {
    color: "#6b7280",
    fontSize: 10,
    textAlign: "center",
    width: "100%",
    marginTop: 2,
  },
});
