import { useRef, useEffect } from "react";
import { View, FlatList, StyleSheet, Animated, Text, ActivityIndicator, Dimensions } from "react-native";
import { Image } from "expo-image";
import { type SpotifyDerivedAlbum } from "@/hooks/use-Spotify-Data";

interface TopAlbumsProps {
  albums?: SpotifyDerivedAlbum[];
  loading?: boolean;
  viewLayout?: 'list' | 'grid';
}

const { width } = Dimensions.get("window");
const GRID_ITEM_SIZE = (width - 48) / 3;

const AlbumRow = ({
  item,
  index,
}: {
  item: SpotifyDerivedAlbum;
  index: number;
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

  const album = item.album;
  const rank = String(index + 1).padStart(2, '0');
  const artistNames = album.artists.map((a) => a.name).join(', ');
  const year = album.release_date?.substring(0, 4) ?? '';
  const albumArt = album.images?.[2]?.url ?? album.images?.[1]?.url ?? album.images?.[0]?.url;

  return (
    <Animated.View
      style={[
        styles.albumRow,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.albumRank}>{rank}</Text>

      <View style={styles.albumIconWrap}>
        {albumArt ? (
          <Image
            source={{ uri: albumArt }}
            style={styles.albumImage}
            contentFit="cover"
          />
        ) : (
          <Text style={{ fontSize: 20 }}>🎵</Text>
        )}
      </View>

      <View style={styles.albumInfo}>
        <Text style={styles.albumTitle} numberOfLines={1}>
          {album.name}
        </Text>
        <Text style={styles.albumArtist}>{artistNames}</Text>
        <Text style={styles.albumYear}>{year}</Text>
      </View>
    </Animated.View>
  );
};

export default function TopAlbumsList({
  albums = [],
  loading = false,
  viewLayout = 'list',
}: TopAlbumsProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#8B5CF6" />
      </View>
    );
  }

  if (albums.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>No top albums available yet.</Text>
      </View>
    );
  }

  const isGrid = viewLayout === 'grid';

  return (
    <FlatList
      key={viewLayout} // Force FlatList to remount when changing layout
      data={albums}
      keyExtractor={(item) => item.album.id}
      numColumns={isGrid ? 3 : 1}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.albumList,
        isGrid ? styles.gridContainer : styles.listContentContainer
      ]}
      renderItem={({ item, index }) => {
        if (isGrid) {
          const rank = String(index + 1).padStart(2, '0');
          const album = item.album;
          const albumArt = album.images?.[1]?.url ?? album.images?.[0]?.url;

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
                    <Text style={{ fontSize: 24 }}>💿</Text>
                  </View>
                )}
                <View style={styles.gridRankBadge}>
                  <Text style={styles.gridRankText}>{rank}</Text>
                </View>
              </View>
              <Text style={styles.gridAlbumTitle} numberOfLines={1}>
                {album.name}
              </Text>
              <Text style={styles.gridAlbumArtist} numberOfLines={1}>
                {album.artists?.[0]?.name ?? 'Unknown'}
              </Text>
            </View>
          );
        }

        return (
          <AlbumRow
            item={item}
            index={index}
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  albumList: {
    paddingBottom: 50,
  },
  listContentContainer: {
    paddingHorizontal: 0,
  },
  albumRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1e2533",
  },
  albumRank: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "700",
    width: 22,
  },
  albumIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#1a2030",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  albumImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  albumInfo: {
    flex: 1,
    minWidth: 0,
  },
  albumTitle: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 1,
  },
  albumArtist: {
    color: MUTED,
    fontSize: 11,
    marginBottom: 1,
  },
  albumYear: {
    color: "#374151",
    fontSize: 10,
  },

  // Grid View Styles
  gridContainer: {
    paddingHorizontal: 0,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 6,
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
  gridAlbumTitle: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
  },
  gridAlbumArtist: {
    color: "#6b7280",
    fontSize: 10,
    textAlign: "center",
    width: "100%",
    marginTop: 2,
  },
});